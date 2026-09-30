import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,rm,copyFile,readdir} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import MarkdownIt from 'markdown-it';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export async function build(base=root){
 const out=resolve(base,'dist');
 await rm(out,{recursive:true,force:true});
 await mkdir(resolve(out,'references'),{recursive:true});
 // Explicit public allowlist: never copy the repository or task directory wholesale.
 const files=['SKILL.md','LICENSE',...(await readdir(resolve(base,'references'))).filter(n=>n.endsWith('.md')).map(n=>'references/'+n)];
 for(const file of files) await copyFile(resolve(base,file),resolve(out,file));
 await copyFile(resolve(base,'site/_headers'),resolve(out,'_headers'));
 const program=await readFile(resolve(base,'references/program.md'),'utf8');
 const md=new MarkdownIt({html:false,linkify:true});
 const defaultLink=md.renderer.rules.link_open;
 md.renderer.rules.link_open=(tokens,idx,opts,env,self)=>{
   const href=tokens[idx].attrGet('href');
   if(href && !/^[a-z][a-z0-9+.-]*:|^\/|^#/i.test(href)){
     const url=new URL(href,'https://camp.ha7ch.com/references/program.md');
     tokens[idx].attrSet('href',url.pathname+url.search+url.hash);
   }
   return defaultLink?defaultLink(tokens,idx,opts,env,self):self.renderToken(tokens,idx,opts);
 };
 const title=program.match(/^# (.+)$/m)?.[1]??'ANC Camp';
 const template=await readFile(resolve(base,'site/index.html'),'utf8');
 await writeFile(resolve(out,'index.html'),template.replace('{{TITLE}}',md.utils.escapeHtml(title)).replace('{{PROGRAM}}',md.render(program)));
 let commit=null;
 try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:base,stdio:['ignore','pipe','ignore']}).toString().trim();}catch{}
 if(commit){
  const hashes={};
  for(const file of [...files,'index.html'])hashes[file]=createHash('sha256').update(await readFile(resolve(out,file))).digest('hex');
  await writeFile(resolve(out,'release.json'),JSON.stringify({repository:'HA7CH/anc-fde-camp',commit,sha256:hashes},null,2)+'\n');
 }
 return files;
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log(`Built ${(await build()).length} public source files and homepage.`);
}
