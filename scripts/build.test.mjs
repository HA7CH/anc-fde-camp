import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,access,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build,root} from './build.mjs';
test('build copies source exactly and keeps unapproved files out',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'anc-camp-'));
 try{
  for(const item of ['SKILL.md','LICENSE','references','site'])await cp(join(root,item),join(dir,item),{recursive:true});
  await writeFile(join(dir,'CONTEXT.md'),'private');
  const files=await build(dir);
  for(const file of files)assert.deepEqual(await readFile(join(dir,file)),await readFile(join(dir,'dist',file)));
  await assert.rejects(access(join(dir,'dist/CONTEXT.md')));
  const program=join(dir,'references/program.md');
  await writeFile(program,(await readFile(program,'utf8'))+'\n## Updated cohort marker\n\nSingle source proof.\n');
  await writeFile(join(dir,'dist/stale.txt'),'must disappear');
  await build(dir);
  await assert.rejects(access(join(dir,'dist/stale.txt')));
  const html=await readFile(join(dir,'dist/index.html'),'utf8');
  assert.match(html,/Updated cohort marker/);
  assert.match(html,/href="\/SKILL.md"/);
  assert.match(html,/上海/);
  assert.match(html,/2026-10-17/);
  for(const file of files.filter(f=>f.endsWith('.md'))){
   const text=await readFile(join(dir,'dist',file),'utf8');
   for(const [,target] of text.matchAll(/\]\(([^)]+)\)/g)){
    const url=new URL(target,'https://camp.ha7ch.com/'+file);
    if(url.origin==='https://camp.ha7ch.com')await access(join(dir,'dist',url.pathname));
   }
  }
 }finally{await rm(dir,{recursive:true,force:true});}
});
