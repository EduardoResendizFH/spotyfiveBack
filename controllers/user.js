'use strict'
const User = require('../models/user'),
      bcrypt = require('bcrypt-nodejs'),
      jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probanco la accion del controlador'
    });
}

function saveUser(req, res){
    let user = new User();

    let params = req.body;
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null'

    if(params.password){
        //Encriptar la contraseña
        bcrypt.hash(params.password, null, null, (err, hash)=>{
            user.password = hash;

            if (user.name != null && user.surname != null && user.email != null) {
                //Guardar el usuario
                user.save((err, userStored) =>{
                    if (err) {
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if (!userStored) {
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message:'Rellena todos los campos'})
            }
        })

    }else{
        res.status(200).send({
            message:'Introduce la contraseña'
        });
    }
}

function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) =>{
        if (err) {
            res.status(500).send({
                message:'Hay un error en la peticion'
            });
        }else{
            if (!user) {
                res.status(400).send({message: 'El usuario no existe'});
            }else{
                //Comprobar la password
                bcrypt.compare(password, user.password, (err, check)=>{   
                    if (check) {
                        if (params.gethash) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({
                            message:'El usuario no se logueo'
                        });
                    }

                });
            }
        }
    })
}

function updateUser(req, res){
    var userId = req.params.id,
        update = req.body;

    if (userId != req.user.sub) {
      return res.status(500).send({
          message: 'NO tienes permiso para actualizar eeste usuario'
      })  
    }

    User.findByIdAndUpdate(userId, update,  (err, userUpdated) =>{
        if (err) {
            res.status(500).send({
                message:'Error al actualizar el usuario'
            });
        }else{
            if (!userUpdated) {
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                })
            }else{
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImage(req, res){
    // var userId = req.params.id;
    // var file_name = 'No subido...';

    //     if (req.files) {
    //         let file_path = req.files.image.path;
    //         console.log(file_path);
    //     }else{
    //         res.status(200).send({message: 'No has subido ninguna imagen ......'})
    //     }
            res.status(200).send({message: 'Hola desde el controller ......'})
            console.log(req.files);

}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
};