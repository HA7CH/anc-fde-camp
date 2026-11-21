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
  assert.match(html,/<title>ANC Camp · 课程与咨询<\/title>/);
  assert.match(html,/<meta name="description" content="ANC Camp 公开课程、下一期公布状态与适合度咨询">/);
  const current = html.match(/<h2>下一期待公布<\/h2>([\s\S]*?)<h2>往期公告<\/h2>/)?.[1];
  assert.ok(current);
  assert.match(current,/https:\/\/ha7ch\.com\/contact/);
  assert.doesNotMatch(current,/深圳|北京|上海|Shanghai|2026|12,800|10:00|18:00|微信/);
  const history = html.match(/<h2>往期公告<\/h2>([\s\S]*?)<h2>课程定位<\/h2>/)?.[1];
  assert.ok(history);
  assert.match(history,/深圳场：2026 年 9 月 13 日/);
  assert.match(history,/北京场：2026 年 9 月 26–27 日/);
  assert.match(history,/上海场：2026 年 10 月 24–25 日/);
  assert.doesNotMatch(html.replace(history,''),/深圳|北京|上海|Shanghai|12,800|10:00|18:00/);
  for(const file of ['README.md','agents/openai.yaml','SKILL.md','references/story.md','references/field-evidence.md']){
   const source=await readFile(join(root,file),'utf8');
   assert.doesNotMatch(source,/上海|Shanghai|12,800|10:00|18:00|2026-10-24/,file);
  }
  for(const file of files.filter(f=>f.endsWith('.md'))){
   const text=await readFile(join(dir,'dist',file),'utf8');
   for(const [,target] of text.matchAll(/\]\(([^)]+)\)/g)){
    const url=new URL(target,'https://camp.ha7ch.com/'+file);
    if(url.origin==='https://camp.ha7ch.com')await access(join(dir,'dist',url.pathname));
   }
  }
 }finally{await rm(dir,{recursive:true,force:true});}
});
