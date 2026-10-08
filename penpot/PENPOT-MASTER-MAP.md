# بديلك عربي — Penpot Master Map

الحالة: **Penpot-ready، غير معتمد للنشر على main.**

## لماذا هذه الحزمة؟
Penpot غير متاح كـChatGPT Plugin مباشر في الجلسة الحالية، لذلك جرى تجهيز حزمة مفتوحة قابلة للاستيراد بدل توقف العمل.

## Source of Truth
- GitHub / الموقع الحالي: Copy + Data + Links + Behavior + Technical implementation.
- Penpot: Visual Master بعد اعتماد المستخدم فقط.
- Preview branch: الاختبار الحي.
- Handoff docs: الجسر بين التصميم والتنفيذ.

## ملفات الاستيراد
### Tokens
- `penpot/badilak.tokens.json`
- مطابق لبنية Penpot/W3C DTCG.
- الاستيراد: Tokens → Tools → Import → Single JSON.

### Editable SVG boards
- `penpot/boards/00-foundations.svg`
- `penpot/boards/01-components.svg`
- `penpot/boards/02-home-desktop.svg`
- `penpot/boards/03-home-mobile.svg`

هذه الملفات ليست Screenshots؛ هي SVG قابلة للإدخال والتحرير وإعادة الترتيب داخل Penpot.

## Pages المقترحة داخل Penpot
1. 00 — Foundations
2. 01 — Components
3. 02 — Desktop 1440
4. 03 — Tablet 768
5. 04 — Mobile 390 / 360
6. 05 — States
7. 06 — Ads & Monetization
8. 07 — Articles
9. 08 — Assets

## الأصول
استخدم مباشرة:
- `images/brand/*.svg`
- `images/visual/*.svg`

لا تعِد رسم الأصول قبل مراجعتها بصريًا؛ هي مرشحات تجريبية.

## ملاحظة مهمة
لم يتم إنشاء ملف `.penpot` أصلي داخل هذه الجلسة لأن إنشاءه بصورة موثوقة يتطلب Penpot نفسه أو MCP مباشر متصل. الحزمة الحالية مصممة لتكون نقطة دخول آمنة ومفتوحة بدل اختراع ملف Penpot قد يفشل في الاستيراد.
