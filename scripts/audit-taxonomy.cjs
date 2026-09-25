// Run with: node scripts/audit-taxonomy.cjs [catalog-data.js]
// Checks discoverability, not product claims or semantic equivalence.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(process.argv[2] || path.join(root, 'js/catalog-data.js'), 'utf8');
const {items, originRouteMap, subfilterMap} = vm.runInNewContext(
  source + ';({items,originRouteMap,subfilterMap})'
);
const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const origins = [...page.matchAll(/data-origin="([^"]+)"/g)].map(match => match[1]);
const errors = [], notes = [], ids = new Set();
const validPlace = (cat, sub) => subfilterMap[cat]?.some(([key]) => key === sub);

for (const item of items) {
  if (ids.has(item.id)) errors.push(`Duplicate item: ${item.id}`);
  ids.add(item.id);
  if (!validPlace(item.cat, item.sub)) errors.push(`Invalid category: ${item.id} (${item.cat}/${item.sub})`);
  if (!Array.isArray(item.origin)) errors.push(`Invalid origins: ${item.id}`);
  if (item.sub === 'all') notes.push(`Review broad classification: ${item.id} (${item.cat}/all)`);
}
for (const origin of origins) {
  if (!originRouteMap[origin]) errors.push(`Visible choice has no route: ${origin}`);
}
for (const [origin, route] of Object.entries(originRouteMap)) {
  if (!(route.cat === 'all' && route.sub === 'all') && !validPlace(route.cat, route.sub)) {
    errors.push(`Invalid route: ${origin} (${route.cat}/${route.sub})`);
  }
  const related = items.filter(item => item.origin?.includes(origin));
  if (!related.length) errors.push(`Route has no related items: ${origin}`);
  for (const item of related) {
    if ((route.cat !== 'all' && route.cat !== item.cat) || (route.sub !== 'all' && route.sub !== item.sub)) {
      errors.push(`Hidden from ${origin}: ${item.id} (${item.cat}/${item.sub})`);
    }
  }
}
const comparisonOnly = [...new Set(items.flatMap(item => item.origin || []))]
  .filter(origin => !originRouteMap[origin]);
console.log(`${items.length} items; ${origins.length} visible choices; ${Object.keys(originRouteMap).length} routes checked.`);
console.log(`Comparison labels without selectable routes: ${comparisonOnly.join(', ') || 'none'}`);
for (const note of notes) console.warn(note);
for (const error of errors) console.error(error);
if (errors.length) process.exitCode = 1;
else console.log('PASS: every routed comparison can reach all its related items.');
