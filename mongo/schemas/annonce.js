const mongoose = require('mongoose');
const ShemaNames = require('../shemaNames');

const Schema = mongoose.Schema;


const schema = new Schema({
    date: { type: Date },
    name: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: ShemaNames.USER },
    group: { type: Schema.Types.ObjectId, ref: ShemaNames.GROUP },
    sport: { type: Schema.Types.ObjectId, ref: ShemaNames.SPORT },
    subscribers: [{ type: Schema.Types.ObjectId, ref: ShemaNames.USER }],
    address: { type: String },
    city: { type: String },
    places: { type: Number },
    position: [{ type: Number, }]
},
{
    timestamps: true
});

module.exports = {
    private: false,
    model: mongoose.model(ShemaNames.ANNONCE, schema),
  };
  