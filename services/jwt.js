'use strict'
const jwt = require('jwt-simple'),
      moment = require('moment'),
      secret = 'clave_secreta_curso';

exports.createToken = (user)=>{
    var payLoad = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payLoad, secret);
}