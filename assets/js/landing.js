/* eslint-disable no-undef */
$(document).ready(function () {
  const map = L.map('map').setView([40.416644, -3.703376], 13)
  // Capas para el mapa: https://leaflet-extras.github.io/leaflet-providers/preview/
  // https://tile.openstreetmap.org/{z}/{x}/{y}.png
  // https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
  // https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  L.Control.geocoder({
    query: '',
    placeholder: 'Buscar ciudad...',
    geocoder: L.Control.Geocoder.nominatim(),
    defaultMarkGeocode: false,
    errorMessage: 'No hay resultados'
  }).on('markgeocode', function (e) {
    const center = e.geocode.center
    map.setView(center).setZoom(13)
  }).addTo(map)

  const settings = {
    url: '/api/account',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  $.ajax(settings)
    .done(function (response) {
      for (account of response) {
        if (account.zone) {
          const zone = L.circle(account.zone, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 300
          }).addTo(map)
          const avatar = account.avatar || '/img/placeholder.jpg'
          zone.bindPopup(`<img src="${avatar}" class="rounded-circle border border-2 avatar-sm me-2" alt=""><b>${account.username}</b>`)
        }
      }
    })
    .fail(function (jqXHR) {
      alert(`${jqXHR.status} - ${jqXHR.responseJSON.message}`)
    })
})
