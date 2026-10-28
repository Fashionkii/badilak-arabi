"""Re-extract existing campaign art; never generate or redraw its content.

Usage: python scripts/prepare-studio-art.py --source-root /path/to/campaign/files
The source PNGs live with the campaign originals, outside the site repository.
The canonical wordmark already belongs to this repository.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

REPO = Path(__file__).resolve().parents[1]
STUDIO = REPO / "server/studio"
SOURCES = {
    "learning": "generated_images/exec-d7701291-82d8-4ca6-8603-3534ef5baf8d.png",
    "business": "generated_images/exec-c40f762d-21a9-409e-a79e-f7e5e3ae2b91.png",
    "research": "generated_images/exec-f304d905-df0f-4783-8e6b-b000563167fe.png",
    "culture": "upload/Arabic platform names typography update-4.png",
    "fit": "upload/Finding the right fit for you(2).png",
    "presentation": "generated_images/exec-e5a74b9a-3168-46ed-b963-79e3ca90b18c.png",
    "choice": "generated_images/exec-a0341529-102d-4001-8ef2-174aa1208da9.png",
}
# Pixel rectangles refer to the inspected 1122 x 1402 originals, not a resized
# preview. Include the entire object and its shadow; exclude captions/badges.
CROPS = {
    "learning": [(75, 458, 326, 650), (73, 693, 325, 888), (73, 928, 330, 1103)],
    "business": [(613, 476, 814, 676), (611, 711, 837, 906), (623, 947, 849, 1130)],
    "research": [(69, 464, 348, 650), (62, 698, 315, 888), (68, 929, 345, 1122)],
    "culture": [(68, 561, 306, 749), (63, 789, 327, 962), (92, 995, 323, 1173)],
    "fit": [(807, 866, 1027, 1055), (468, 866, 669, 1053), (117, 867, 308, 1057)],
    "presentation": [(820, 888, 1008, 1050), (454, 900, 663, 1048), (128, 895, 339, 1049)],
    "choice": [(823, 913, 974, 1080), (480, 917, 657, 1080), (128, 913, 304, 1080)],
}


def white_wordmark(source):
    """Map the original's color roles for white paper, retaining its geometry.

    Original negative-space letter dots become white, consistently. The slogan
    and its ordinary letter dots share forest ink. Gold foliage stays gold.
    A three-color separation preserves antialiasing without tracing any glyph.
    """
    pixels = np.asarray(source.convert("RGB"), dtype=float)
    dark = np.array([2., 26., 35.])
    light = np.array([254., 250., 242.])
    gold = np.array([220., 170., 65.])
    basis = np.column_stack((light - dark, gold - dark))
    weights = (pixels - dark) @ np.linalg.pinv(basis).T
    weights = np.clip(weights, 0, 1)
    weights /= np.maximum(1, weights.sum(axis=2, keepdims=True))
    ink, leaf = weights[..., 0:1], weights[..., 1:2]
    backdrop = 1 - ink - leaf
    residual = pixels - (backdrop * dark + ink * light + leaf * gold)
    # Suppress compression-color halos around lettering; retain gold variation.
    result = backdrop * 255 + ink * np.array([25., 63., 53.]) + leaf * gold + residual * leaf ** 4
    result[(ink + leaf)[..., 0] < .035] = 255
    result[(ink[..., 0] > .965) & (leaf[..., 0] < .02)] = [25, 63, 53]
    return Image.fromarray(np.uint8(np.clip(np.rint(result), 0, 255)))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, required=True)
    args = parser.parse_args()
    manifest_path = STUDIO / "templates.json"
    manifest = json.loads(manifest_path.read_text())
    provenance = {"revision": "2026-10-28-art-correction", "assets": {}}

    def save(key, image, source, **details):
        target = STUDIO / "assets" / (key + ".webp")
        # Do not replace a working asset with an empty/invalid encoder result.
        encoded = b""
        for method in (6, 4, 0):
            buffer = io.BytesIO()
            image.save(buffer, format="WEBP", lossless=True, method=method)
            encoded = buffer.getvalue()
            if encoded:
                check = Image.open(io.BytesIO(encoded))
                check.load()
                if check.size == image.size:
                    break
        if not encoded:
            raise ValueError(f"Empty encoded asset: {key}")
        temporary = target.with_suffix(".webp.tmp")
        temporary.write_bytes(encoded)
        temporary.replace(target)
        manifest["assets"][key] = {"file": target.name, "width": image.width, "height": image.height}
        provenance["assets"][key] = {
            "source": str(source.relative_to(args.source_root)) if source.is_relative_to(args.source_root) else str(source.relative_to(REPO)),
            "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
            "sourceSize": list(Image.open(source).size),
            **details,
            "outputSha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        }

    for group, relative in SOURCES.items():
        source = args.source_root / relative
        original = Image.open(source).convert("RGB")
        if original.size != (1122, 1402):
            raise ValueError(f"Unexpected source size for {group}: {original.size}")
        for i, crop in enumerate(CROPS[group]):
            image = original.crop(crop)
            details = {"crop": list(crop)}
            # These two numbered source cards have a gold badge next to the
            # object. Exclude just that disconnected badge, retaining the glass
            # handle/arrow. Never carry Arabic numbers into the English artwork.
            if group == "choice" and i in (1, 2):
                image = image.convert("RGBA")
                mask = Image.new("L", image.size, 255)
                excluded = (150, 0, image.width, 104) if i == 1 else (166, 38, image.width, 108)
                ImageDraw.Draw(mask).rectangle(excluded, fill=0)
                image.putalpha(mask)
                details["excludeSourceBadge"] = list(excluded)
            save(f"{group}-icon{i}", image, source, **details)

    logo = REPO / "images/brand/wordmark-main-20261016-dots-1080.webp"
    save("logo", white_wordmark(Image.open(logo)), logo,
         operation="Original wordmark, unchanged geometry; white background, forest ink, gold foliage. Negative-space dots all white.")
    manifest["rulesVersion"] = "2026-10-28-white-logo-art-fix"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    (STUDIO / "asset-provenance.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n")
    print(f"Prepared {len(provenance['assets'])} corrected assets from existing originals.")


if __name__ == "__main__":
    main()
