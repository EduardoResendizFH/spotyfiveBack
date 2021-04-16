'use strict'

const paht = require('path'),
      fs = require('fs'),
      mongoosePaginate = require('mongoose-pagination'),
      Artist = require('../models/artist'),
      Album = require('../models/album'),
      Song = require('../models/song');

function getArtist(req, res){
    let artistId = req.params.id;

    Artist.findById(artistId, (err, artist)=>{
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if (!artist) {
                res.status(404).send({message: 'Error en la peticion'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}

function getArtists(req, res){
    if (req.params.page) {
        var page = req.params.page;
    }else{
        var page = 1;
    }
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total)=>{
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if (!artists) {
                res.status(404).send({message: 'no hay artistas'});
            }else{
                return res.status(200).send({
                    pages: total,
                    artists: artists
                });
            }
        }
    })
}

function saveArtist(req, res){
    let artist = new Artist();
    let params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) =>{
        if (err) {
            res.status(500).send({
                message: 'Error al guardar artista'
            });
        }else{
            if (!artistStored) {
                res.status(404).send({message: 'El artista no ha sido guardado'});
            }else{
                res.status(200).send({
                    artist: artistStored
                });
            }
        }
    });
}

function updateArtist(req, res){
    let artistId = req.params.id;
    let update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdate) =>{
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if (!artistUpdate) {
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({artist: artistUpdate});
            }
        }
    })
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndDelete(artistId, (err, artistRemoved) =>{
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if (!artistRemoved) {
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            }else{
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) =>{
                    if (err) {
                        res.status(500).send({message: 'Error al eliminar el album'});
                    }else{
                        if (!albumRemoved) {
                            res.status(404).send({message:'El album no ha sido eliminado'});
                        }else{
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) =>{
                                if (err) {
                                    res.status(500).send({message:'Error al eliminar la cancion'});
                                }else{
                                    if (!songRemoved) {
                                        res.status(404).send({message: 'La cancion no ha sido eliminada'});
                                    }else{
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    });
}


// function deleteArtist(req, res){
//     var artistId = req.params.id;

//     Artist.findOneAndDelete(artistId, (err, artistRemoved) =>{
//         if (err) {
//             res.status(500).send({message: 'Error al eliminar el artista'});
//         }else{
//             if (!artistRemoved) {
//                 res.status(404).send({message: 'El artista no ha sido eliminado'});
//             }else{
//                 res.status(404).send({artistRemoved});

//                 Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) =>{
//                     if (err) {
//                         res.status(500).send({message:'Error al eliminar album'});
//                     }else{
//                         if (!albumRemoved) {
//                             res.status(404).send({message: 'El album no ha sido eliminado'});
//                         }else{
//                             Song.find({album: albumRemoved._id}).remove((err, songRemoved) =>{
//                                 if(err){
//                                     res.status(500).send({message: 'Error al eliminar la cancion'});
//                                 }else{
//                                     if (!songRemoved) {
//                                         res.status(404).send({message: 'La cancion no ha sido eliminado'});
//                                     }else{
//                                         res.status(200).send({artist: artistRemoved});
//                                     }
//                                 }
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     });
// }

// function deleteArtist(req, res){
//     let artistId = req.params.id;

// Artist.findByIdAndDelete(artistId, (err, artistRemove) =>{
//         if (err) {
//             res.status(500).send({message:'Error al eliminar artista'});
//         }else{
//             if (!artistRemove) {
//                 res.status(404).send({
//                     message:'El artista no ha sido eliminado'
//                 });
//             }else{
//                 res.status(404).send({artistRemove});
//                 Album.find({artist: artistRemove._id}).remove((err, albumRemoved) =>{
//                     if (err) {
//                         res.status(500).send({
//                             message:'Error al eliminar el album'
//                         });
//                     }else{
//                         if (!albumRemoved) {
//                             res.status(404).send({
//                                 message:'El album no ha sido eliminado'
//                             })
//                         }else{
//                             Song.find({album: albumRemoved._id}.removed((err, songRemoved) =>{
//                                 if (err) {
//                                     res.status(500).send({
//                                         message:'Error al eliminar cancion'
//                                     });
//                                 }else{
//                                     if (!songRemoved) {
//                                         res.status(404).send({
//                                             message:'La cancion no ha sido eliminada'
//                                         });
//                                     }else{
//                                         res.status(200).send({
//                                             artist: artistRemove
//                                         });
//                                     }
//                                 }
//                             }));
//                         }
//                     }
//                 });
//             }
//         }
//     })
// } 

function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = 'No subido';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[1];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdate) =>{
                if (!artistId) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar el usuario'
                    });
                }else{
                    res.status(200).send({artist: artistUpdate});
                }
            });
        }
        
    }
}

function getImageFile(req, res){
    var imageFile =  req.params.imageFile;
    var path_file = './uploads/artists/'+imageFile
    fs.exists(path_file, (exists)=> {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({
                message:'No existe la imagen'
            });
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};