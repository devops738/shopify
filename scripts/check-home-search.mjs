import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Alter/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage();
page.on('pageerror',e=>console.log('JS',e.message));
page.on('response',r=>{if(r.url().includes('tireconnect')&&r.status()>=400)console.log('HTTP',r.status(),r.url().split('?')[0]);});
await page.goto('https://usj86p-qn.myshopify.com/',{waitUntil:'domcontentloaded'});
if(await page.locator('input[name=password]').count()){await page.locator('input[name=password]').fill('chitea');await page.locator('button[type=submit],input[type=submit]').first().click();await page.waitForLoadState('domcontentloaded');}
await page.waitForTimeout(4000);
console.log(await page.evaluate(()=>({widget:typeof TCWidget,init:typeof window.TCWidget?.init})));
console.log(await page.evaluate(async()=>{
 try{st.mode='size';st.w='215';st.r='45';st.d='17';st.store=STORES.find(s=>String(s.id)==='52819');
 const original=window.TCWidget?.init;
 if(original)window.TCWidget.init=function(config){try{return original.call(this,config)}catch(e){window.testInitError=e.message;throw e;}};
 openTireConnect('tires');return 'clicked';
 }catch(e){return e.message;}
}));
await page.waitForTimeout(6000);
console.log(await page.evaluate(()=>({error:window.testInitError,text:document.getElementById('tcInlineWidget')?.innerText.slice(0,600)})));
await browser.close();
