const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;


const schema = new Schema({
  lastName: { type: String },
  firstName: { type: String },
  username: { type: String },
  password: { type: String, bcrypt: true },
  googleId: { type: Number },
  facebookId: { type: Number }
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

module.exports = {
  private: false,
  model: mongoose.model('Users', schema)
};
