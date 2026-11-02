const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const data=new Map(),listeners={};
const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
const label={textContent:''};
const context={localStorage:storage,sessionStorage:storage,URLSearchParams,
 location:{hash:'#!tires/search?year=2025&make=Aston%20Martin&model=DBX707&submodel=Base&drive_type=AWD'},
 document:{querySelectorAll:s=>s==='#vehVal'?[label]:[],addEventListener:()=>{}},
 CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},
 window:{addEventListener:(k,f)=>listeners[k]=f,dispatchEvent:e=>listeners[e.type]?.(),setInterval:()=>{}}};
vm.runInNewContext(fs.readFileSync('assets/ats-vehicle-state.js','utf8'),context);
assert.equal(JSON.parse(data.get('atsTireConnectVehicle')).model,'DBX707');
assert.equal(JSON.parse(data.get('atsTireConnectVehicle')).submodel,'Base');
context.location.hash='';listeners.pageshow();
assert.equal(label.textContent,'2025 Aston Martin DBX707');
context.location.hash='#!services?year=2026';listeners.hashchange();
assert.equal(JSON.parse(data.get('atsTireConnectVehicle')).year,'2026');
assert.equal(JSON.parse(data.get('atsTireConnectVehicle')).model,'');
assert.equal(label.textContent,'2026 — Select make');
context.location.hash='#!services?year=2026&make=Cadillac';listeners.hashchange();
assert.equal(label.textContent,'2026 Cadillac — Select model');
context.location.hash='#!services?year=2026&make=Toyota&model=Camry';listeners.hashchange();
assert.equal(JSON.parse(data.get('atsTireConnectVehicle')).model,'Camry');
assert.equal(JSON.parse(data.get('atsTireConnectVehicle')).submodel,undefined);
console.log('PASS: widget capture, cross-page restore, partial routes, vehicle replacement');
