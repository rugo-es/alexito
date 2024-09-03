const path = require('path')

const Account = require(path.join(__dirname, '../models/account'))

async function validateRegisterForm ({ name, lastName, username, email, password, passwordConfirm, acceptTerms }) {
  const errors = []
  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  if (!validEmail.test(email)) errors.push({ field: 'email', message: 'Formato del email no válido' })
  const emailExist = await Account.findOne().byEmail(email).exec()
  if (emailExist) errors.push({ field: 'email', message: 'Email ya registrado' })
  if (password !== passwordConfirm) errors.push({ field: 'passwordConfirm', message: 'La contraseña no coincide' })
  const usernameExist = await Account.findOne().where({ username }).exec()
  if (usernameExist) errors.push({ field: 'username', message: 'Nombre de usuario ya registrado' })
  // Validación de campos vacíos
  if (!name) errors.push({ field: 'name', message: 'Introduce el nombre' })
  if (!lastName) errors.push({ field: 'lastName', message: 'Introduce los apellidos' })
  if (!username) errors.push({ field: 'username', message: 'Introduce el nombre de usuario' })
  if (!email) errors.push({ field: 'email', message: 'Introduce el email' })
  if (!password) errors.push({ field: 'password', message: 'Introduce la contraseña' })
  if (!passwordConfirm) errors.push({ field: 'passwordConfirm', message: 'Introduce la contraseña' })
  if (!acceptTerms) errors.push({ field: 'acceptTerms', message: 'Acepte los términos' })
  return errors
}

async function validateLoginForm ({ email, password }) {
  const errors = []
  const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
  if (!validEmail.test(email)) errors.push({ field: 'email', message: 'Formato del email no válido' })
  // Validación de campos vacíos
  if (!email) errors.push({ field: 'email', message: 'Introduce el email' })
  if (!password) errors.push({ field: 'password', message: 'Introduce la contraseña' })
  return errors
}

module.exports = {
  validateRegisterForm,
  validateLoginForm
}
