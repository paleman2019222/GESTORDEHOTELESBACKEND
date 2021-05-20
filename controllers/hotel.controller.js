'use strict'

var Hotel = require('../models/hotel.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var User = require('../models/user.model');
var Habitacion = require('../models/habitacion.model');



var fs = require('fs');
var path = require('path');
/*
function saveHotelAdmin (req, res){
    var hotel = new Hotel();
    var params = req.body;
    let userId = req.params.id;  
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion '})
    }else{
        if(params.name && params.direction && params.description && params.telefono){
           
            Hotel.findOne({name: params.name}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err})
                }else if(hotelFind){
                    res.status(200).send({message: 'Nombre de hotel en uso'})
                }else{                       
                                    hotel.name = params.name;
                                    hotel.direction = params.direction;
                                    hotel.description = params.description;
                                    hotel.telefono = params.telefono;                                           
                                    hotel.save((err, hotelSaved)=>{
                                        if(err){
                                            res.status(500).send({message: 'Error general', err})
                                        }else if(hotelSaved){
                                            res.status(200).send({message: 'Hotel registrado con éxito', hotelSaved})
                                        }else{
                                            res.status(401).send({message: 'No se pudo registrar el hotel'})
                                        }

                                    })  
                }

            })
        
}else{
    res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
}
    }

    
}
*/

function saveHotelAdmin (req, res){
    var hotel = new Hotel();
    var params = req.body;
    let userId = req.params.id;  
    let adminId = req.params.idA;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        if(params.name && params.direction && params.description && params.telefono){
           
            Hotel.findOne({name: params.name}, (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err})
                }else if(hotelFind){
                    res.status(200).send({message: 'Nombre de hotel en uso'})
                }else{                       
                    User.findOne({_id: adminId}, (err, adminFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(adminFind){
                            if(adminFind.role!='ADMINH'){
                                res.status(200).send({message: 'Este usuario no tiene permiso para administrar el hotel. Cambie el rol en los datos del usuario'})
                            }else{
                                hotel.name = params.name;
                       hotel.direction = params.direction;
                       hotel.description = params.description;
                       hotel.telefono = params.telefono;                                          
                       hotel.save((err, hotelSaved)=>{
                           if(err){
                                res.status(500).send({message: 'Error general', err})
                            }else if(hotelSaved){
                                Hotel.findByIdAndUpdate(hotelSaved, {$push:{admin: adminId}}, {new: true}, (err, pushAdmin)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general', err})   
                                    }else if(pushAdmin){
                                        res.status(200).send({message: 'Hotel registrado con éxito', hotelSaved})
                                    }else{
                                        res.status(403).send({message: 'No se pudo agregar el hotel'})
                                    }
                                })
                            }else{
                                res.status(401).send({message: 'No se pudo registrar el hotel'})
                                }
                               })                      
                            }
                        }else{
                            res.status(500).send({message:'Usuario no encontrado'})
                        }
                    })  
                }
            })   
}else{
    res.status(401).send({message: 'Ingrese los datos minimos para el registro'})
}
    }
}

function deleteHotel(req, res){
    var idHotel = req.params.idH;
    var userId = req.params.id;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        Hotel.findByIdAndRemove(idHotel, (err, hotelDeleted)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL'});
            }else if(hotelDeleted){
                res.send({message: 'El hotel fue eliminado: '});
            }else{
                res.send({message: 'Hotel no eliminado'});
            }
        });
    }
}

function updateHotel(req, res){
    var idHotel = req.params.idH;
    var update = req.body;
    var userId = req.params.id;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        Hotel.findOneAndUpdate(idHotel, update, {new: true}, (err, hotelUpdated)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENRAL'});
            }else if(hotelUpdated){
                res.send({message:'El hotel fue actualizado', hotel: hotelUpdated});
            }else{
                res.status(404).send({message: 'Hotel no actualizado'});
            }
        });
    }
}

function searchHotel(req, res){
    var params = req.body;
    if(params.search){
        Hotel.find({$or:[{name: params.search},
            {direction: params.search},
    ]}, (err, resultsSearch)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err})
            }else if(resultsSearch){
                return res.send({resultsSearch})
            }else{
                return res.status(404).send({message:'No hay registros para mostrar'})
            }
        })
    }else{
        return res.status(403).send({message:'Ingresa algún dato en el campo de búsqueda'})
    }
}


function getHoteles(req, res){
    Hotel.find({}).exec((err, hotel)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'})
        }else if(hotel){
            res.status(200).send({message: 'Productos encontrados', hotel})
        }else{
            res.status(200).send({message: 'No hay registros'})
        }
    }) 
}


function setHabitacion(req, res){
    let userId = req.params.id;
    let hotelId = req.params.idH;
    let params = req.body;
    let habitacion = new Habitacion();
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
    Hotel.findById(hotelId, (err, hotelFind)=>{
        if(err){
            res.status(500).send({message: 'Error general', err})
        }else if (hotelFind){
            if(params.name && params.tipo && params.precio){
                habitacion.name= params.name;
                habitacion.tipo = params.tipo;
                habitacion.precio = params.precio;
                Hotel.findByIdAndUpdate(hotelId, {$push: {habitacion: habitacion}}, {new: true}, (err, habitacionSaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error general', err})
                    }else if(habitacionSaved){
                        res.status(200).send({message: 'Habitación guardada: ', habitacionSaved});
                    }else{
                        res.status(418).send({message: 'Habitación no agregado, intentelo de nuevo más tarde'});
                    }
                });
            }else{
                res.status(404).send({message: 'Ingrese los datos mínimos para agregar una habitación'})
            }
        }else{
            res.status(200).send({message: 'No hay ningun registro'})
        }
    })
    }
}


module.exports = {
    saveHotelAdmin,
    deleteHotel,
    updateHotel,
    searchHotel,
    getHoteles,
    setHabitacion
    //saveHotelAdminHotel
}