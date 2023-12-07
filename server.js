require('dotenv').config()

const express = require("express")
const app = express()
const cors = require('cors')
app.use(cors())
const mongoose = require("mongoose")
//{useNewUrlParser:true}
mongoose.connect(process.env.DATABASE_URL )
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Conectado a la Base de Datos'))

app.use(express.json())
const apiRouter = require('./routes/api')
app.use('/api', apiRouter)


app.listen(3000, () => console.log('Server started'))

