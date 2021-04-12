const mongoose = require('mongoose'),
      app = require('./app'),
      port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/spotyFive',
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:true
},

(err, res) =>{
    if(err){
        throw err;
    }else{
        console.log("*************** CONECTADO A LA BD ******************************");
        app.listen(port, ()=>{
            console.log('SERVIDOR DE SPOTYFIVE ESCUCHADO en el puerto http://localhost:  ' + port);
        })
    }
})