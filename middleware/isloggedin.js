const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async function (req, res, next){
    if(!req.cookies.token){
        return res.redirect('/');
    }
    try{
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_SECRET);
        let user = await userModel.findOne({email: decoded.email});
        req.user = user;
        next();
    } catch{
        res.send("something is not working");
    }
}