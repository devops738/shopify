const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=fs.readFileSync('sections/main-page-services.liquid','utf8');
const functions=source.slice(source.indexOf('function normTxt('),source.indexOf('function storageJson('));
let now=0, queue=[], events=[];
const timer=(fn,delay)=>queue.push({fn,time:now+delay});
function field(name,values){
 return {name,disabled:false,value:'',options:values.map(value=>({value,textContent:value})),
 dispatchEvent(event){
  if(event.type!=='change')return;
  events.push(name);
  if(name==='year'){make.options=[];model.options=[];timer(()=>make.options=[{value:'Chevrolet',textContent:'Chevrolet'}],1600);}
  if(name==='make'){model.options=[];timer(()=>model.options=[{value:'Bolt',textContent:'Bolt'}],2100);}
 }};
}
const year=field('year',['2025']),make=field('make',[]),model=field('model',[]);
const context={window:{},st:{year:'2025',make:'Chevrolet',model:'Bolt',store:null},setTimeout:timer,Event:class{constructor(type){this.type=type}},$:()=>({querySelectorAll:()=>[year,make,model]})};
vm.createContext(context);vm.runInContext(functions,context);
function drain(){let guard=0;while(queue.length){assert.ok(++guard<500);queue.sort((a,b)=>a.time-b.time);const task=queue.shift();now=task.time;task.fn();}}
context.syncTireConnectServicesContext();drain();
assert.deepEqual(events,['year','make','model']);
assert.equal(model.value,'Bolt');
context.syncTireConnectServicesContext();drain();
assert.deepEqual(events,['year','make','model'],'Matching values must not dispatch changes');
year.value='';make.value='';model.value='';events=[];
context.syncTireConnectServicesContext();context.syncTireConnectServicesContext();drain();
assert.deepEqual(events,['year','make','model'],'Superseded sync must stop');
console.log('PASS: delayed options, no repeated reset, cancellation');
