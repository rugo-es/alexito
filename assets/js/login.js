/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function login () {
  $('#btnLoginSubmit').prop('disabled', true)
  $('#loaderLoginSubmit').removeClass('d-none')
  $('#txtLoginSubmit').text('Iniciando sesión')
  const credentials = {
    email: $('#email').val(),
    password: $('#password').val()
  }
  console.log(credentials)
  const settings = {
    url: '/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(credentials)
  }
  $.ajax(settings)
    .done(function (response) {
      if (response.error) {
        loadErrors(response.data)
        return
      }
      location.href = '/profile'
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      loadErrors([{ field: 'password', message: 'Contraseña incorrecta' }])
    }).always(function () {
      $('#btnLoginSubmit').prop('disabled', false)
      $('#loaderLoginSubmit').addClass('d-none')
      $('#txtLoginSubmit').text('Iniciar sesión')
    })
}

function loadErrors (errors) {
  $('.form-control').removeClass('is-invalid')
  for (error of errors) {
    $(`#${error.field}`).addClass('is-invalid').nextAll('div.invalid-feedback').html(error.message)
  }
}
