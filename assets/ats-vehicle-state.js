(function () {
  'use strict';
  var keys = ['atsTireConnectVehicle', 'tcVehicle', 'tc_vehicle', 'tcwlwVehicle', 'tcwlw_vehicle', 'TCWidgetVehicle'];
  var lastHash = null;
  var requests = new Map();
  window.atsVehicleRequest = function (url) {
    var key = String(url);
    if (requests.has(key)) return requests.get(key);
    var request = fetch(key).then(function (response) {
      if (!response.ok) throw new Error('Vehicle lookup unavailable');
      return response.json();
    }).catch(function (error) { requests.delete(key); throw error; });
    requests.set(key, request);
    return request;
  };
  function read() {
    try { return JSON.parse(localStorage.getItem(keys[0]) || sessionStorage.getItem(keys[0]) || 'null'); }
    catch (_) { return null; }
  }
  function capture() {
    var hash = location.hash;
    if (hash === lastHash) return;
    lastHash = hash;
    if (!/#!(?:tires\/search|services)\?/.test(hash)) return;
    var params = new URLSearchParams(hash.slice(hash.indexOf('?') + 1));
    var year = params.get('year'), make = params.get('make'), model = params.get('model');
    if (!year) return;
    make = make || '';
    model = make ? (model || '') : '';
    var previous = read();
    var same = previous && String(previous.year) === year && previous.make === make && previous.model === model;
    var vehicle = Object.assign({}, same ? previous : {}, {year: year, make: make, model: model});
    ['submodel', 'trim', 'body_type', 'option', 'drive_type', 'size_type', 'size_id'].forEach(function (key) {
      if (params.get(key)) vehicle[key] = params.get(key);
    });
    var json = JSON.stringify(vehicle);
    try {
      if (json === JSON.stringify(previous)) return;
      keys.forEach(function (key) { localStorage.setItem(key, json); sessionStorage.setItem(key, json); });
      window.dispatchEvent(new CustomEvent('ats:vehicle-changed', {detail: vehicle}));
      window.dispatchEvent(new CustomEvent('ats:tireconnect-updated'));
    } catch (_) {}
  }
  function render() {
    try {
      var store=JSON.parse(localStorage.getItem('atsTireConnectStore')||'null');
      if(store&&window.atsSharedStores){var index=window.atsSharedStores.findIndex(function(s){return (s.id&&String(s.id)===String(store.id))||s.city===store.city;});
        if(index>=0)document.querySelectorAll('#hstore').forEach(function(s){if(s.value!==String(index))s.value=String(index);});}
    }catch(_){}
    var vehicle = read();
    if (!vehicle || !vehicle.year) return;
    document.querySelectorAll('#vehVal').forEach(function (label) {
      var text = [vehicle.year, vehicle.make, vehicle.model || (vehicle.make ? '— Select model' : '— Select make')].filter(Boolean).join(' ');
      if(label.textContent!==text)label.textContent=text;
    });
    document.querySelectorAll('#vehField').forEach(function (field) { field.classList.add('set'); });
  }
  function refresh() { capture(); render(); }
  window.addEventListener('hashchange', refresh);
  window.addEventListener('pageshow', refresh);
  window.addEventListener('storage', render);
  window.addEventListener('ats:tireconnect-updated', render);
  document.addEventListener('DOMContentLoaded', refresh);
  // Capture before internal navigation, including widget routes updated via replaceState.
  document.addEventListener('click', capture, true);
  window.addEventListener('pagehide', capture);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) refresh(); });
  window.setInterval(function () { if (!document.hidden) refresh(); }, 500);
  capture();
  var product=location.pathname==='/pages/tire-search'?'tire':location.pathname==='/pages/packages'?'package':null;
  if(product){
    var attempts=0;
    var tabTimer=setInterval(function(){
      var root=document.querySelector(product==='tire'?'#wh-mount':'#pkgMount');
      var button=root&&Array.from(root.querySelectorAll('button')).find(function(b){return b.textContent.trim().toLowerCase()===product&&b.querySelector('img');});
      if(button){button.click();clearInterval(tabTimer);}
      else if(++attempts>120)clearInterval(tabTimer);
    },250);
  }
})();
