'use strict'

const paht = require('path'),
      fs = require('fs'),
      mongoosePaginate = require('mongoose-pagination'),
      Artist = require('../models/artist'),
      Album = require('../models/album'),
      Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) =>{
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if (!song) {
                res.status(404).send({message: 'La cancion no existe!!'});
            }else{
                res.status(200).send({song});
            }
        }
    });
}

function saveSong(req, res){
    let song = new Song();

    let params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) =>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!songStored) {
                res.status(404).send({message: 'No se guardo la cancion'});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });

}

function getSongs(req, res){
    let albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        Populate: {
            path: 'artist',
            model:'Artist'
        }
    }).exec((err, songs)=>{
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if (!songs) {
                res.status(404).send({message: 'No hay canciones'});
            }else{
                res.status(200).send({songs});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) =>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!songUpdated) {
                res.status(404).send({message: 'No se ha actualizado la cancion'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) =>{
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if (!songRemoved) {
                res.status(404).send({message:'No se ha borrado la cancion'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    });

//   Song.findByIdAndRemove(songId, (err, songRemoved) =>{
//       if (err) {
//           res.status(500).send({message: 'Error en el servidor'});
//       }else{
//           if (!songRemoved) {
//               res.status(404).send({message:'No se ha borrado la cancion'});
//           }else{
//               res.status(200).send({song: songRemoved});
//           }
//       }
//   });
}



module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong
};