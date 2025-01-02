const mongoose = require('mongoose');
const config = require('config')

const dbgr = require('debug')("development:mongoose");

mongoose.connect(`${config.get("MONGODB_URI")}/MapMeet`)
.then(function(){
    console.log("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;