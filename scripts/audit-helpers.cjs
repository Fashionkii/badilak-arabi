'use strict';
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
