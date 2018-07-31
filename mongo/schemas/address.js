const mongoose = require('mongoose');
const ShemaNames = require('../shemaNames');
const Schema = mongoose.Schema;

const schema = new Schema({
  postalCode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  country: { type: String },
  locality: { type: String },
  streetNumber: { type: String },
  route: { type: String },
  placeId: { type: String }
});

module.exports = {
    private: false,
    model: mongoose.model(ShemaNames.ADDRESS, schema),
  };
  