'use strict'

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: { type:Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', SongSchema);