import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {root} from './build.mjs';
const paths=['SKILL.md','LICENSE',...(await readdir(resolve(root,'references'))).filter(n=>n.endsWith('.md')).map(n=>'references/'+n)];
for(const path of paths){
 const response=await fetch('https://camp.ha7ch.com/'+path,{cache:'no-store'});
 assert.equal(response.status,200,path);
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(resolve(root,path)),path);
 console.log('Matches repository:',path);
}
const home=await fetch('https://camp.ha7ch.com/',{cache:'no-store'});
assert.equal(home.status,200);
const html=await home.text();
assert.equal(html,await readFile(resolve(root,'dist/index.html'),'utf8'));
assert.match(html,/href="\/SKILL.md"/);
console.log('Homepage and Skill discovery verified.');

const release=await fetch('https://camp.ha7ch.com/release.json',{cache:'no-store'});
assert.equal(release.status,200);
assert.deepEqual(await release.json(),JSON.parse(await readFile(resolve(root,'dist/release.json'),'utf8')));
console.log('Release commit and artifact hashes verified.');
