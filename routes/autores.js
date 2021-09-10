const express = require('express')//modulo de uso de express
const Autor = require('../models/autor') //modulo que importa el acceso a la db
const router = express.Router() //modulo de rutas


//ruta de todos los autores
router.get('/', async (req, res) => {
  let searchOptions = {}
  if(req.query.nombre !=null && req.query.nombre !==''){ //metodo de busqueda en base a una palabra clave, en caso de que no se encuentre retornara a lo mismo
    searchOptions.nombre = new RegExp(req.query.nombre,'i')
  }
  try{
    const autores = await Autor.find(searchOptions) //metodo para buscar autores
    res.render('autores/index', {
      autores: autores,
      searchOptions:req.query})//variable con la que se buscaran los autores mas el let para la busqueda del autor
  }catch{
    res.redirect('/') //en caso de que no pueda encontrar el autor se redirige a la pagina de inicio
  }
})

//ruta para nuevo autor
router.get('/nuevo',(req, res)=>{
  res.render('autores/nuevo',{ autor: new Autor() })

})

//ruta para registrar autores
router.post('/',async (req, res)=>{
  const autor = new Autor({ //metodo para almacenar autor
    nombre : req.body.nombre
  })
  try{
    const newAutor = await autor.save() //metodo para almacenar autor
    //res.redirect(`autores/${newAutor.id}`)
    res.redirect('autores')
  }catch{
    //let locals = {errorMessage: "Error al crear autor"} //variable para mensaje de eror
    res.render('autores/nuevo',{  //seccion que mostrara el mensaje de error
      autor: autor,
      errorMessage: "Error al crear autor"
      //locals:locals
    })  
  }
})

module.exports = router