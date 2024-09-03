const mongoose = require('mongoose')

mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB', error))
