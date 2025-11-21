
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    passwordHash: String,
    verified:{
        type:Boolean,
        default:false
    },
    IsAdmin: {
    type: Boolean,
    default: false // Por defecto, ningún usuario es administrador.
  }
});

module.exports = mongoose.model('User', userSchema);
        