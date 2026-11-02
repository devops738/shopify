import {createRequire} from 'node:module';
const require=createRequire('C:/Users/Alter/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const page=await browser.newPage({viewport:{width:390,height:844}});
const base='https://usj86p-qn.myshopify.com';
await page.goto(base);
if(await page.locator('input[type=password]').count()){
 await page.locator('input[type=password]').fill('chitea');
 await page.locator('button[type=submit],input[type=submit]').first().click();
}
for(const name of ['locations','location-glendale-ca','location-valencia-ca','location-bellflower-ca']){
 await page.goto(base+'/pages/'+name,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1800);
 console.log(name,JSON.stringify(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,addresses:[...document.querySelectorAll('.getting-addr b')].map(e=>({text:e.textContent,color:getComputedStyle(e).color})),grids:[...document.querySelectorAll('.locs')].map(e=>getComputedStyle(e).gridTemplateColumns),buttons:[...document.querySelectorAll('.final>.wrap>.btn')].map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom}))}))));
 for(const [key,selector] of [['address','.getting-addr'],['other-stores','.locs'],['closing','.final']]){const el=page.locator(selector).last();if(await el.count()){await el.scrollIntoViewIfNeeded();await page.screenshot({path:'output/qa-screenshots/'+name+'-'+key+'-mobile.png'});}}
}
await browser.close();
