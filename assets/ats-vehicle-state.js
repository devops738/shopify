(function () {
  'use strict';
  var keys = ['atsTireConnectVehicle', 'tcVehicle', 'tc_vehicle', 'tcwlwVehicle', 'tcwlw_vehicle', 'TCWidgetVehicle'];
  function read() {
    try { return JSON.parse(localStorage.getItem(keys[0]) || sessionStorage.getItem(keys[0]) || 'null'); }
    catch (_) { return null; }
  }
  function capture() {
    var hash = location.hash;
    if (!/#!(?:tires\/search|services)\?/.test(hash)) return;
    var params = new URLSearchParams(hash.slice(hash.indexOf('?') + 1));
    var year = params.get('year'), make = params.get('make'), model = params.get('model');
    // An incomplete widget route must not erase a previously selected vehicle.
    if (!year || !make || !model) return;
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
      window.dispatchEvent(new CustomEvent('ats:tireconnect-updated'));
    } catch (_) {}
  }
  function render() {
    var vehicle = read();
    if (!vehicle || !vehicle.year || !vehicle.make || !vehicle.model) return;
    document.querySelectorAll('#vehVal').forEach(function (label) {
      label.textContent = [vehicle.year, vehicle.make, vehicle.model].join(' ');
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
  window.setInterval(refresh, 500);
  capture();
})();
