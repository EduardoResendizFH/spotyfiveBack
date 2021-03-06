'use strict'

const paht = require('path'),
      fs = require('fs'),
      mongoosePaginate = require('mongoose-pagination'),
      Artist = require('../models/artist'),
      Album = require('../models/album'),
      Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) =>{
        if (err) {
            res.status(500).send({
                message:'Error en la peticion'
            });
        }else{
            if (!album) {
                res.status(404).send({
                    message:'El album no existe'
                });
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res){
    var artistId = req.params.artist;

    if (!artistId) {
        //Sacar todos los albums de la BD
        var find = Album.find({}).sort('title');
    }else{
        //Sacar los albums de un artista concreto de la BD
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) =>{
        if (err) {
            res.status(500).send({
                message:'Error en la peticion'
            });
        }else{
            if (!albums) {
                res.status(404).send({
                    message:'No hay albums'
                });
            }else{
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new Album();

    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) =>{
        if (err) {  
            res.status(500).send({
                message: 'Error en el servidor'
            });
        }else{
            if (!albumStored) {
                res.status(404).send({
                    message: 'No se guardo el album'
                });
            }else{
                res.status(200).send({album});
            }
        }
    });
} 

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
        if (err) {
            res.status(500).send({
                message:'Error en el servidor'
            });
        }else{
            if (!albumUpdated) {
                res.status(404).send({message: 'No se ha actualizado el album'});
            }else{
                res.status(200).send({
                    album: albumUpdated
                });
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) =>{
        if (err) {
            res.status(500).send({message:'Error al eliminar el album'});
        }else{
            if (!albumRemoved) {
                res.status(404).send({
                    message: 'El album no ha sido eliminado'
                });
            }else{
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) =>{
                    if (err) {
                        res.status(500).send({message: 'Error al eliminar la cancion'});
                    }else{
                        if (!songRemoved) {
                            res.status(404).send({message:'La cancion no ha sido eliminada'})
                        }else{
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
 }


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum 
};