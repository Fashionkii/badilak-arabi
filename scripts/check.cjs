'use strict';
// One command for the current regression guards: `node scripts/check.cjs`.
// Builds dist first, then runs every guard that protects the site as it is today.
// Historical task audits (see AGENTS.md) are intentionally not run here: they compare
// against the commit their own task started from, so later approved changes fail them.
const {spawnSync,execFileSync}=require('node:child_process');
const path=require('node:path');
const root=path.join(__dirname,'..');
const run=(args)=>spawnSync(process.execPath,args,{cwd:root,encoding:'utf8',timeout:300000});
const last=s=>(s||'').trim().split('\n').filter(Boolean).pop()||'';
// Prefer the assertion message over Node's trailing version line.
const reason=r=>{
 const out=(r.stderr||'')+'\n'+(r.stdout||'');
 const msg=out.match(/message: '([^']+)'/)||out.match(/^(?:Assertion)?Error[^\n]*: ([^\n]+)/m)||out.match(/^fatal: ([^\n]+)/m);
 return msg?msg[1].slice(0,200):last(r.stderr)||last(r.stdout);
};

const guards=[
 ['scripts/audit-prelaunch.cjs','noindex, canonicals, links, article bodies, protected data'],
 ['scripts/test-coherent-navigation.cjs','one navigation, articles, news, journeys'],
 ['scripts/test-review-fixes.cjs','search, learning cautions, protected files (needs full git history)'],
 ['scripts/test-directory-group-rotation.cjs','directory groups and rotation'],
 ['scripts/test-screenshot-corrections.cjs','curated examples stay in their categories'],
 ['scripts/audit-category-links.cjs','crawlable category links'],
 ['scripts/audit-feedback.cjs','feedback form stays disabled until approved'],
 ['scripts/test-studio.cjs','design studio unit tests'],
];
const historyBase='eea149be3b02e9543ed57006caecc699ad790beb';

const build=run(['scripts/build-site.cjs']);
if(build.status!==0){console.error('FAIL build-site\n'+(build.stderr||build.stdout));process.exit(1);}
console.log('PASS build-site :: '+last(build.stdout));

let hasHistory=true;
try{execFileSync('git',['cat-file','-e',historyBase+'^{commit}'],{cwd:root,stdio:'ignore'});}catch{hasHistory=false;}

let failed=0;
for(const [file,what] of guards){
 if(file.endsWith('test-review-fixes.cjs')&&!hasHistory){
  failed++;
  console.log('FAIL '+path.basename(file)+' :: shallow clone, baseline '+historyBase.slice(0,7)+' missing. Run: git fetch --depth=400 origin main');
  continue;
 }
 const r=run([file]);
 const ok=r.status===0;
 if(!ok)failed++;
 console.log((ok?'PASS ':'FAIL ')+path.basename(file)+' :: '+(ok?what:reason(r)));
}
const diff=spawnSync('git',['diff','--check'],{cwd:root,encoding:'utf8'});
if(diff.status!==0){failed++;console.log('FAIL git diff --check :: '+last(diff.stdout));}
else console.log('PASS git diff --check');

console.log(failed?`\n${failed} check(s) failed. Do not open a pull request until they pass.`:'\nAll current guards passed.');
process.exit(failed?1:0);
