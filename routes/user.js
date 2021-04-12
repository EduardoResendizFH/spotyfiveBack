'use strict'
const express = require('express'),
      UserController = require('../controllers/user'),
      md_auth = require('../middlewares/authenticated'),
      multipart = require('connect-multiparty'),
      md_upload = multipart({uploadDir: '../uploads/users'}),
      fs = require('fs'),
      api = express.Router();
      
api.get('/probando-controlador',  md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api; 