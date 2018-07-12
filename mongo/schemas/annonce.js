const mongoose = require('mongoose');
const ShemaNames = require('../shemaNames');

const Schema = mongoose.Schema;


const schema = new Schema({
    name: { type: String }, 
    creator: { type: Schema.Types.ObjectId, ref: ShemaNames.USER },
    admins: [{ type: Schema.Types.ObjectId, ref: ShemaNames.USER }],
    users: [{ type: Schema.Types.ObjectId, ref: ShemaNames.USER }],
    sport: { type: Schema.Types.ObjectId, ref: ShemaNames.SPORT },
    defaultPlace: { type: String }
},
{
    timestamps: true
});

module.exports = {
    private: false,
    model: mongoose.model(ShemaNames.ANNONCES, schema),
  };
  