const requireDir = require('require-dir');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/database');
module.exports = requireDir('./schemas/');
