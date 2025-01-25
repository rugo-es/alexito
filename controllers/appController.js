const style = '/css/style.css'
const jquery = '/vendor/jquery/jquery-3.7.1.js'
const bootstrap = {
  css: '/vendor/bootstrap/bootstrap-5.3.3-dist/css/bootstrap.min.css',
  js: '/vendor/bootstrap/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js'
}
const leaflet = {
  css: '/vendor/leaflet/leaflet.css',
  js: '/vendor/leaflet/leaflet.js',
  geocoder: {
    css: '/vendor/leaflet-geocoder/Control.Geocoder.min.css',
    js: '/vendor/leaflet-geocoder/Control.Geocoder.min.js'
  }
}
const websocket = '/vendor/socket/socket.io.min.js'
const commonJs = [jquery, bootstrap.js, websocket, '/js/websocket.js']

async function landing (req, res) {
  return res.render('landing', {
    account: req.session?.account || null,
    css: [bootstrap.css, leaflet.css, leaflet.geocoder.css, style],
    scripts: [...commonJs, leaflet.js, leaflet.geocoder.js, '/js/landing.js']
  })
}

async function login (req, res) {
  res.render('login', {
    css: [bootstrap.css, style],
    scripts: [...commonJs, '/js/login.js']
  })
}

async function register (req, res) {
  res.render('register', {
    css: [bootstrap.css, leaflet.css, leaflet.geocoder.css, style],
    scripts: [...commonJs, leaflet.js, leaflet.geocoder.js, '/js/register.js']
  })
}

async function profile (req, res) {
  res.render('profile', {
    account: req.session.account,
    css: [bootstrap.css, leaflet.css, leaflet.geocoder.css, style],
    scripts: [...commonJs, leaflet.js, leaflet.geocoder.js, '/js/profile.js']
  })
}

async function chat (req, res) {
  res.render('chat', {
    account: req.session.account,
    css: [bootstrap.css, style],
    scripts: [...commonJs, '/js/chat.js']
  })
}

async function faqs (req, res) {
  res.render('faqs', {
    account: req.session?.account || null,
    css: [bootstrap.css, style],
    scripts: [...commonJs]
  })
}

module.exports = {
  landing,
  login,
  register,
  profile,
  chat,
  faqs
}
