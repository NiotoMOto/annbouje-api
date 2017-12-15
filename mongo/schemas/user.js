const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const mailer = require('../../services/mail');
const ShemaNames = require('../shemaNames');

const Schema = mongoose.Schema;


const schema = new Schema({
  lastName: { type: String },
  firstName: { type: String },
  username: { type: String },
  email: { type: String },
  image: { type: String},
  password: { type: String, bcrypt: true },
  googleId: { type: Number },
  facebookId: { type: Number },
  sports: [ { type: Schema.Types.ObjectId, ref: ShemaNames.SPORT } ]
});

schema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password);
  }
  next();
});

schema.methods.verifyPassword = function(password, cb){
  cb(bcrypt.compareSync(password, this.password));
};

schema.post('save', function(doc) {
  mailer.sendMail(doc)
});

module.exports = {
  private: false,
  model: mongoose.model(ShemaNames.USER, schema)
};
