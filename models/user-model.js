const { name } = require('ejs');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  image: Buffer,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local'; // Password required for local registration
    },
  },
  authProvider: {
    type: String,
    required: true,
    enum: ['local', 'google', 'facebook'], // Limit to predefined options
    default: 'local', // Default for normal registration
  },
});


module.exports = mongoose.model("users",userSchema);
