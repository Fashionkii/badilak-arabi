/* One command for the checks that describe the site as it is now:

     node scripts/check.cjs

   It builds the site, then runs each check below and prints one line per check. The exit code
   is 0 only when every check passes, so a new failure cannot hide among old ones.

   Not run here:
   - scripts/legacy/*            compare the site with approved snapshots from October and early
                                 November 2026; see scripts/legacy/README.md.
   - audit-taxonomy.cjs          a report on comparison routes, written before the extra origin
                                 choices and their shared routes; its findings need review.
   - audit-studio-browser.cjs,
     audit-studio-render.cjs     need a running studio server and the canvas package. */
'use strict';
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const checks=['audit-prelaunch','audit-category-links','audit-feedback','test-coherent-navigation','test-directory-group-rotation','test-screenshot-corrections','test-studio'];
const run=name=>spawnSync(process.execPath,[path.join(__dirname,name+'.cjs')],{cwd:root,encoding:'utf8'});
const build=run('build-site');
if(build.status!==0){process.stdout.write(build.stdout+build.stderr);console.log('FAIL  build-site');process.exit(1);}
console.log('ok    build-site');
let failed=0;
for(const name of checks){
 const result=run(name);
 if(result.status===0)console.log('ok    '+name);
 else{failed++;console.log('FAIL  '+name);process.stdout.write((result.stdout+result.stderr).split('\n').filter(line=>line.trim()).slice(0,12).join('\n')+'\n');}
}
console.log(failed?`${failed} of ${checks.length} checks failed.`:`All ${checks.length} checks passed.`);
process.exit(failed?1:0);
