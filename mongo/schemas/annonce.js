const mongoose = require('mongoose');
const ShemaNames = require('../shemaNames');

const Schema = mongoose.Schema;


const schema = new Schema({
    date: { type: Date },
    name: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: ShemaNames.USER },
    group: { type: Schema.Types.ObjectId, ref: ShemaNames.GROUP },
    sport: { type: Schema.Types.ObjectId, ref: ShemaNames.SPORT },
    address: { type: Schema.Types.ObjectId, ref: ShemaNames.ADDRESS },
    subscribers: [{ type: Schema.Types.ObjectId, ref: ShemaNames.USER }],
    address: { type: String },
    city: { type: String },
    places: { type: Number },
    position: [{ type: Number, }]
},
{
    timestamps: true
});

schema.methods.subscribe = function (userId) {
    console.log('subscribers', this._id )
    this.subscribers.push(userId);
    return this.save();
}

module.exports = {
    private: false,
    model: mongoose.model(ShemaNames.ANNONCE, schema),
  };
  