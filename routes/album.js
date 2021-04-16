'use strict'
const express = require('express'),
      AlbumController = require('../controllers/album'),
      api = express.Router(),
      md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'),
    md_upload = multipart({uploadDir: './uploads/album'});

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);


module.exports = api;