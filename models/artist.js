'use strict'
const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    description: String,
    file:String,
    album: {
        type: Schema.ObjectId,
        ref:'Album'
    }
});

module.exports = mongoose.model('Artist', SongSchema);