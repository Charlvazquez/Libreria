if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser') //constante para body-parser

const indexRouter = require('./routes/index')// constante donde se indicara donde estaran nuestras rutas
const autorRouter = require('./routes/autores') //constante que indicara el archivos donde estaran las rutas de autores
const libroRouter = require('./routes/libros') //constante que indicara el archivo donde estaran las rutas de libros

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const mongoose = require('mongoose') //modulo para usar mongodb
mongoose.connect(process.env.DATABASE_URL,{
   useNewUrlParser: true 
})
const db = mongoose.connection
db.on('error',error =>console.error(error))
db.once('open',() => console.log('Conectado a la base de datos'))

app.use('/', indexRouter) //ruta inicial donde el servidor iniciara
app.use('/autores', autorRouter)//ruta secundaria donde mostrara las views autores
app.use('/libros', libroRouter)//ruta secundaria donde mostrara las views libros

app.listen(process.env.PORT || 4000)