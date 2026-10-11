'use strict';
// Only the retired intermediary shelf may change in the discovery memory adapter.
// Everything else, including restored filters, reading position and dialogs, is protected.
exports.withoutRetiredShelf=source=>source
 .replace('shelf:activeCardShelfId,detail:','detail:')
 .replace('   const shelfItem=items.find(x=>x.id===state.shelf);\n   const shelfButton=shelfItem&&document.querySelector(`[data-item-id="${shelfItem.id}"] .more-btn`);\n   if(shelfButton)openCardShelf(shelfItem.id,shelfButton,false);\n','');
