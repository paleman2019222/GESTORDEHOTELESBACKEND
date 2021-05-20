'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var hotelSchema = Schema({
    name: String,
    direction: String,
    description: String,
    telefono: Number,
    calificaciones: [{
        calificacion: Number

     } ],

    habitacion: [{
        name: String,
        tipo: String,
        estado: Boolean,
        precio: Number,
        images: [{image:String}],

     } ],
     eventos: [{
        name: String,
        estado: Boolean,
        precio: Number,
        fecha: String,
        hora: String
     } ],
     images: [{image:String}],

     admin: [{type: Schema.ObjectId, ref: 'user'}]
})
module.exports = mongoose.model('hotel', hotelSchema);

