const mongoose = require('mongoose')

const apischema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    genshin:{
        type:String,
        required: true
    },
    equipo:{
        type:String,
        required:true,
        default: '1'
    },
    arma: {
        type:String,
        required:true
    },
    armatype: {
        type:String,
        required:true
    },
    elemento: {
        type:String,
        required:true
    }
})

module.exports = mongoose.model('api', apischema)