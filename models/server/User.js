var mongoose = require("mongoose");
var crypto = require("crypto");

var User = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false }
})

var hashPassword = function(value) {
  var md5sum;
  md5sum = crypto.createHash('md5');
  md5sum.update(value);
  return md5sum.digest('hex');
}

User.pre("save", function(next) {
  if (!this.isModified('password'))
    return next();
  this.password = hashPassword(this.password);
  return next();
})

User.static("hashPassword", hashPassword)

User.static("available", function(email, username, callback) {
  this.findOne({ username: username }, callback);
})

User.static("findOneByUsernamePassword", function(username, password, callback) {
  var pattern = {
    username: username,
    password: this.hashPassword(password)
  }
  this.findOne(pattern).exec(callback);
})

module.exports = mongoose.model("User", User);