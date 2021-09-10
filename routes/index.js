const express = require('express')//modulo de uso de express
const router = express.Router() //modulo de rutas
const Libro = require('../models/libro') //modulo para el uso de la db libros

//ruta principal
router.get('/', async (req, res) => { 
  let libros
  try{ //metodo para buscar los libros ya almacenados
    libros = await Libro.find().sort({creadoEn: 'desc'}).limit(10).exec()

  }catch{ 
    libros = []   

  }
  res.render('index',{libros:libros}) //se anexa la variable libros de las ruta libros al mostrar la vista)
})

module.exports = router