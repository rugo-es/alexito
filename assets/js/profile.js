/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let avatar, zone

$(document).ready(function () {
  document.getElementById('avatar').addEventListener('change', function (event) {
    $('#avatarLoader').removeClass('d-none').addClass('d-block')
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('avatar', file)
      $.ajax({
        url: '/api/account/uploadAvatar',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
          avatar = data.url
          $('#avatarPreview').attr('src', avatar)
        },
        error: function (xhr, status, error) {
          console.error('Error al subir la imagen:', error)
        },
        complete: function () {
          $('#avatarLoader').addClass('d-none').removeClass('d-block')
        }
      })
    }
  })

  const lat = $('#accountZoneLat').val()
  const lng = $('#accountZoneLng').val()
  const accountZone = (!lat && !lng) ? null : { lat, lng }
  const center = (!lat && !lng) ? { lat: 40.416644, lng: -3.703376 } : { lat, lng }

  const map = L.map('map').setView(center, 13)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  if (accountZone) {
    zone = L.circle(accountZone, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 300
    }).addTo(map)
  }
  L.Control.geocoder({
    query: '',
    placeholder: 'Buscar ciudad...',
    geocoder: L.Control.Geocoder.nominatim(),
    defaultMarkGeocode: false,
    errorMessage: 'No hay resultados'
  }).on('markgeocode', function (e) {
    const bbox = e.geocode.center
    map.setView(bbox)
  }).addTo(map)

  map.on('click', function (e) {
    if (zone) map.removeLayer(zone)
    zone = L.circle(e.latlng, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 300
    }).addTo(map)
  })
})

function updateProfile () {
  $('#btnUpdateProfileSubmit').prop('disabled', true)
  $('#loaderUpdateProfileSubmit').removeClass('d-none')
  $('#txtUpdateProfileSubmit').text('Guardando cambios')
  const accountData = {
    username: $('#username').val()
  }
  const password = $('#password').val()
  if (password) {
    accountData.password = password
  }
  if (avatar) accountData.avatar = avatar
  if (zone) accountData.zone = zone._latlng
  const settings = {
    url: `/api/account/${$('#accountId').val()}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(accountData)
  }
  $.ajax(settings)
    .done(function (response) {
      if (response.error) {
        loadErrors(response.data)
        return
      }
      updateToken()
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    }).always(function () {
      $('#btnUpdateProfileSubmit').prop('disabled', false)
      $('#loaderUpdateProfileSubmit').addClass('d-none')
      $('#txtUpdateProfileSubmit').text('Guardar cambios')
    })
}

function updateToken () {
  const settings = {
    url: `/updateToken/${$('#accountId').val()}`,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  }
  $.ajax(settings)
    .done(function () {
      $('#profileModal').modal('show')
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus)
    })
}

function loadErrors (errors) {
  $('.form-control').removeClass('is-invalid')
  $('#reviewMessage').addClass('d-none')
  for (error of errors) {
    $(`#${error.field}`).addClass('is-invalid').next('.invalid-feedback').html(error.message)
  }
  $('#reviewMessage').removeClass('d-none')
}
