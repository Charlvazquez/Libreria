const express = require('express')//modulo de uso de express
const Libro = require('../models/libro') //modulo para base de datos de libros
const router = express.Router() //modulo de rutas
const fs = require('fs')
const path = require('path') //modulo para rutas de archivos
const uploadPath = path.join('public',Libro.portadaImagenBasePath)// ruta de archivo para almacenar las portadas
const multer = require('multer')// modulo para usar multer para almacenar datos tipo imagenes
const Autor = require('../models/autor') //modulo para base de datos de autores
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] //formato para guardar archivos tipo imagen y gif

const upload = multer({
    dest: uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype) )
    }
})

//ruta de todos los libros
router.get('/', async (req, res) => {
    let query = Libro.find() //peticion de busqueda
    if(req.query.titulo != null && req.query.titulo != ''){// metodo para busqueda de titulos almacenados
        query = query.regex('titulo',new RegExp(req.query.titulo, 'i'))
    }
    if(req.query.publicadoAntes != null && req.query.publicadoAntes != ''){ //metodo para busqueda por fecha de publicacion cuando se creo antes
        query = query.lte('publicadoAntes', req.query.publicadoAntes)// empleando lte = LowerThanOrEqualTo
    }
    if(req.query.publicadoDespues != null && req.query.publicadoDespues != ''){ //metodo para busqueda por fecha de publicacion antes
        query = query.gte('publicadoDespues', req.query.publicadoDespues) //empleando gte = GreaterThanOrEqualTo
    }
    try{
        const libros = await query.exec()
        res.render('libros/index',{ //pagina a renderizar
            //variables que se conectaran con dicha view
            libros: libros,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

//ruta para nuevo libro
router.get('/nuevo', async(req, res)=>{
    renderNewPage(res, new Libro()) //llamar funcion para saber que todo esta bien al guardar un nuevo libro   
})

// Create Book Route
router.post('/', upload.single('portada'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const libro = new Libro({
      titulo: req.body.titulo,
      autor: req.body.autor,
      Fecha_publicacion: new Date(req.body.Fecha_publicacion),
      No_paginas: req.body.No_paginas,
      Nombre_portada: fileName,
      descripcion: req.body.descripcion
    })
  
    try {
      const newLibro = await libro.save()
      // res.redirect(`libros/${newLibro.id}`)
      res.redirect('libros')
    } catch {
        if(libro.Nombre_portada != null){
            removeBookCover(libro.Nombre_portada)//metodo para eliminar portada del libro

        }  
      renderNewPage(res, libro, true)
    }
  })

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath),err =>{ 
        if(err) console.error(err)
    })
}

async function renderNewPage(res, libro, hasError = false) {
    try {
      const autores = await Autor.find({})
      const params = {
        autores: autores,
        libro: libro
      }
      if (hasError) params.errorMessage = 'Error Creating Book'
      res.render('libros/nuevo', params)
    } catch {
      res.redirect('/libros')
    }
  }

module.exports = router