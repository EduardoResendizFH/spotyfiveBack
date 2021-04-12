const express = require('express'),
      bodyParser = require('body-parser'),
      user_routes = require('./routes/user'),
      artist_routes = require('./routes/artist'),
      albums_routes = require('./routes/album'),
      song_routes = require('./routes/song'),
      app = express();  

const cors = require('cors');

//Cargar Rutas
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

//Configurar cabecera de http
app.use((req, res, next ) =>{
    res.header('Access-Control-Allow_Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//rutas base

app.get('/pruebas', (req, res)=>{
    res.status(200).send({
        message: 'Bienvenido al curso'
    })
});

app.use('/api', user_routes);  
app.use('/api', artist_routes);
app.use('/api', albums_routes);
app.use('/api', song_routes);

module.exports = app;


