const mongoose = require('mongoose') //modulo para usar mongodb
const path = require('path')

const portadaImagenBasePath = 'uploads/portada_libros' //constante para almacenar los archivos de las portadas de libros

const libroSchema = new mongoose.Schema({ //construccion de campos y tipo de dato de db
    titulo :{ //columna de titulo de libro
        type: String, //tipo de dato
        required:true
    },
    descripcion :{ //columna de descripcion de libro
        type: String, //tipo de dato
    },
    Fecha_publicacion :{ //columna fecha de publicacion
        type: Date, //tipo de dato
        required:true
    },
    No_paginas:{// columna no de paginas
        type: Number, //tipo de dato
        required:true
    },
    creadoEn:{// columna de creado en tal fecha
        type: Date,//tipo de dato
        required: true,
        default: Date.now //condicion de mostrar si se creo en ese instante
    },
    Nombre_portada:{//columna de la portada del libro
        type: String,//tipo de dato
        required:true,
    },
    autor:{
        type: mongoose.Schema.Types.ObjectId, //relacion con la tabla autor en base a el id
        required:true, //campo requerido
        ref: 'Autor' //para la refernecia el nombre en el esquema, tiene que coincidir 
    }

})

libroSchema.virtual('portadaPath').get(function(){
    if (this.Nombre_portada != null){
        return path.join('/', portadaImagenBasePath, this.Nombre_portada)
    }
})

module.exports = mongoose.model('Libro',libroSchema)
module.exports.portadaImagenBasePath = portadaImagenBasePath