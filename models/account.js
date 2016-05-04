var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = new Schema({
  username: String,
  password: String,
  email: String,
  createDate: Date,
  modifiedDate: Date

});

module.exports = mongoose.model('Account', Account, 'Account');
