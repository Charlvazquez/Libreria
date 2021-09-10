const mongoose = require('mongoose') //modulo para usar mongodb

const autorSchema = new mongoose.Schema({ //construccion de campos y tipo de dato de db
    nombre :{
        type: String,
        required:true
    }

})

module.exports = mongoose.model('Autor',autorSchema)