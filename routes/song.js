'use strict'
const express = require('express'),
      SongController = require('../controllers/song'),
      api = express.Router(),
      md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'),
    md_upload = multipart({uploadDir: './uploads/album'});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);


module.exports = api;