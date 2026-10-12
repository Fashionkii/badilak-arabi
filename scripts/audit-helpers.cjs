'use strict';
// Permit only the reviewed PNG -> JPEG share-image delivery change.
// Exact tags keep unrelated URLs, MIME types, dimensions, alt text and copy protected.
exports.withPreviousSharedBrandImage=html=>html
 .replace('<meta property="og:image" content="https://badilak-arabi.vercel.app/images/social/badilak-share-20261012.jpg">\n<meta property="og:image:type" content="image/jpeg">','<meta property="og:image" content="https://badilak-arabi.vercel.app/images/social/badilak-social-base.png?v=20261011-1">')
 .replace('<meta name="twitter:image" content="https://badilak-arabi.vercel.app/images/social/badilak-share-20261012.jpg">','<meta name="twitter:image" content="https://badilak-arabi.vercel.app/images/social/badilak-social-base.png?v=20261011-1">');

// Only the retired intermediary shelf may change in the discovery memory adapter.
// Everything else, including restored filters, reading position and dialogs, is protected.
exports.withoutRetiredShelf=source=>source
 .replace('shelf:activeCardShelfId,detail:','detail:')
 .replace('   const shelfItem=items.find(x=>x.id===state.shelf);\n   const shelfButton=shelfItem&&document.querySelector(`[data-item-id="${shelfItem.id}"] .more-btn`);\n   if(shelfButton)openCardShelf(shelfItem.id,shelfButton,false);\n','');

// Permit only the explicit saved-dialog handoff; all other navigation logic stays exact.
exports.withoutModalRestoreHandoff=source=>source
 .replace(/\n \/\/ A saved directory dialog needs the discovery runtime; a fresh service URL does not\.\n function restoreVisit\(target,replace=false\)\{[\s\S]*?\n \}\n/,'')
 .replaceAll('    restoreVisit(target);','    write(RESTORE,target);\n    location.href=target.url;')
 .replace('  if(r.discovery&&!window.badilakDiscoveryMemory&&/^\\/discover\\//.test(location.pathname)){restoreVisit(r,true);return;}\n','');

// Replace only the six decorative title images; preserve their exact accessible text.
exports.withTextSectionHeadings=html=>html.replace(/<h2 class="art-title art-title--section art-title--[^" ]+"><span class="sr-only">([^<]+)<\/span><img[^>]+><\/h2>/g,'<h2 class="section-title">$1</h2>');

// Only directory control presentation changes; keep button labels, filters and handlers exact.
exports.withoutDirectoryControlPresentation=html=>html
 .replace(/^    <button[^\n]+data-refine-trigger="(?:category|sub)"[^\n]+\n/gm,'')
 .replace(/id="directoryRefineCategory"(?: hidden| role="group" aria-label="ماذا تبحث عنه؟")/g,'id="directoryRefineCategory"')
 .replace(/(<button class="filter(?: active)?" data-filter="[^"]+"[^>]*>)([\s\S]*?)(<\/button>)/g,(_,open,body,close)=>open.replace(/ aria-pressed="(?:true|false)"/,'')+body.replace(/<svg[\s\S]*?<\/svg>/,'').replace(/<\/?span>/g,'')+close);

// Reverse only the approved 12 October reading-priority markup changes.
// The current renderer itself is exercised by audit-reading-hierarchy.cjs.
exports.withoutReadingHierarchyApp=source=>source
 .replace('  <div class="decision-panel-head"><strong>مهم قبل الاختيار</strong></div>\n','')
 .replace("   ${learningDecisionPanelMarkup(x)}\n   <div class=\"detail-facts\">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}", "   <div class=\"detail-facts\">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}    ${learningDecisionPanelMarkup(x)}");
exports.withoutReadingHierarchyRenderer=source=>source
 .replace("   ${decisionPanelMarkup(x)}\n   <div class=\"detail-facts\">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}", "   <div class=\"detail-facts\">${facts.map(([l,v])=>detailFact(l,v)).join('')}</div>    ${geoContextMarkup(x.id)}    ${decisionPanelMarkup(x)}")
 .replace(" // Show the existing decision limit in every browsing context, without shortening it.\n const keyLimit=caution||decisionNoteFor(x)?.alert||'';\n",'')
 .replace('   ${keyLimit?`<p class="card-key-limit${caution?\'\':\' card-key-limit--general\'}"><strong>قبل أن تختار</strong><span>${keyLimit}</span></p>`:\'\'}','   ${caution?`<p class="card-key-limit">${caution}</p>`:\'\'}');
// Compare all text tokens and functional destinations when only DOM order changes.
exports.markupMeaning=html=>({
 words:html.replace(/<[^>]*>/g,' ').trim().split(/\s+/).filter(Boolean).sort(),
 attrs:[...html.matchAll(/(?:href|src|onclick|target|rel)="([^"]*)"/g)].map(x=>x[0]).sort()
});
