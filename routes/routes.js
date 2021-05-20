'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var hotelController = require('../controllers/hotel.controller');
const { ensureAuth } = require('../middlewares/authenticated');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

//var connect = require('connect-multiparty');

//USUARIOS
api.get('/prueba', userController.prueba);
api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.put('/updateUser/:id' , mdAuth.ensureAuth, userController.updateUser);
api.delete('/removeUserAdmin/:id' ,  [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.removeUserAdmin);
api.put('/updateUserAdmin/:idU/:idA' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.updateUserAdmin);
api.post('/searchUser/:id' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.searchUser);
api.get('/getUsers', userController.getUsers);
api.put('/updateUserU/:idU', mdAuth.ensureAuth, userController.updateUserU);
api.delete('/removeUser/:idU', mdAuth.ensureAuth, userController.removeUser);


//HOTELES
//funcion para que únicamente el administrador de aplicacion agregue un hotel.
api.post('/saveHotelAdmin/:id/:idA' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],  hotelController.saveHotelAdmin);
api.delete('/deleteHotel/:id/:idH' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],  hotelController.deleteHotel);
api.put('/updateHotel/:id/:idH' ,[mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],  hotelController.updateHotel);
api.post('/searchHotel', hotelController.searchHotel);
api.get('/getHoteles', hotelController.getHoteles);
api.put('/setHabitacion/:id/:idH', [mdAuth.ensureAuth, mdAuth.ensureAuthAdminH], hotelController.setHabitacion);



module.exports = api;




