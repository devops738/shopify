const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let calls=0,fail=false;
const context={Map,URLSearchParams,location:{hash:'',pathname:'/'},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null},document:{addEventListener(){},querySelectorAll:()=>[]},window:{addEventListener(){},setInterval(){}},fetch:async()=>{calls++;return {ok:!fail,json:async()=>({data:{values:['2026']}})};}};
vm.runInNewContext(fs.readFileSync('assets/ats-vehicle-state.js','utf8'),context);
(async()=>{
 const request=context.window.atsVehicleRequest;
 const first=request('years'),second=request('years');
 assert.equal(first,second);await Promise.all([first,second]);await request('years');assert.equal(calls,1);
 fail=true;await assert.rejects(request('makes'));fail=false;await request('makes');assert.equal(calls,3);
 console.log('PASS: duplicate/in-flight requests reused; failures remain retryable');
})().catch(e=>{console.error(e);process.exitCode=1;});
