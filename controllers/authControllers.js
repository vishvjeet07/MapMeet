const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateToken');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

module.exports.registerUser = async function (req,res) {
    try{
        let { username, email, password} = req.body;
        let user = await userModel.findOne({email: email});
        if(user) return res.status(401).send("you already have an account");

        bcrypt.genSalt(10,function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                if(err) return res.send(err.message);
                else{
                    let newuser = await userModel.create({
                        email,
                        password:hash,
                        username,
                    });
                    const token = generateToken(newuser);
                    res.cookie("token",token);
                    res.render('propic');
                }
            });
        });
    } catch(err){
        res.send(err.messege);
    }
}

module.exports.loginUser = async function(req,res){
    let {email, password } = req.body;
    let user = await userModel.findOne({email: email});
    if(!user) return res.send("invalid email or password");
    
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
            let token = generateToken(user);
            res.cookie("token",token);
            res.render('index');
        }
        else{
            res.send("invalid email or password");
        }
    })
}
module.exports.uploadpro = async function (req, res) {
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET); // Verify the JWT
        let email = decoded.email; // Extract email from the decoded token
        
        // Find and update the user with the uploaded profile image
        let user = await userModel.findOneAndUpdate(
            { email: email }, 
            { image: req.file.buffer },
            { new: true } // Return the updated user document
        );
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        req.user = user; // Attach the updated user object to req.user
        
        res.render('index');
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while uploading the profile picture");
    }
};

module.exports.logoutUser = function(req,res){
    console.log(req.user);
    res.cookie("token","");
    res.render('login',{ loggedin:false });
}