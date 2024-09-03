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
  const map = L.map('map').setView([40.416644, -3.703376], 13)
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

function register () {
  $('#btnRegisterSubmit').prop('disabled', true)
  $('#loaderRegisterSubmit').removeClass('d-none')
  $('#txtRegisterSubmit').text('Cargando')
  const newAccount = {
    name: $('#name').val(),
    lastName: $('#lastName').val(),
    username: $('#username').val(),
    email: $('#email').val(),
    password: $('#password').val(),
    passwordConfirm: $('#passwordConfirm').val(),
    acceptTerms: $('#acceptTerms').is(':checked')
  }
  if (avatar) newAccount.avatar = avatar
  if (zone) newAccount.zone = zone._latlng
  const settings = {
    url: '/api/account',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(newAccount)
  }
  $.ajax(settings)
    .done(function (response) {
      if (response.error) {
        loadErrors(response.data)
        return
      }
      $('#registerModal').modal('show')
    })
    .fail(function (jqXHR) {
      alert(`${jqXHR.status} - ${jqXHR.responseJSON.message}`)
      // showAlert('alert-danger', 3000, '<strong>'+errorThrown+'</strong>')
    }).always(function () {
      $('#btnRegisterSubmit').prop('disabled', false)
      $('#loaderRegisterSubmit').addClass('d-none')
      $('#txtRegisterSubmit').text('Registrarse')
    })
}

function loadErrors (errors) {
  $('.form-control, .form-check-input').removeClass('is-invalid')
  $('#reviewMessage').addClass('d-none')
  for (error of errors) {
    $(`#${error.field}`).addClass('is-invalid').next('.invalid-feedback').html(error.message)
  }
  $('#reviewMessage').removeClass('d-none')
}
