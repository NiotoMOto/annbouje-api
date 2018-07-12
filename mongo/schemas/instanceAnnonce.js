const mongoose = require('mongoose');
const ShemaNames = require('../shemaNames');

const Schema = mongoose.Schema;


const schema = new Schema({
    date: { type: Date },
    annonce: { type: Schema.Types.ObjectId, ref: ShemaNames.ANNONCES },
    subscribers: [{ type: Schema.Types.ObjectId, ref: ShemaNames.USER }],
    address: { type: String },
    city: { type: String },
    position: [{ type: Number, }]
},
{
    timestamps: true
});

module.exports = {
    private: false,
    model: mongoose.model(ShemaNames.INSTANCE_ANNONCE, schema),
  };
  