const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { route } = require('./userRoute');
const isloggedin = require('../middleware/isloggedin');
const userModel = require('../models/user-model');
require('../auth')


router.get('/',function(req,res){
    res.render('login',{ loggedin:false });
})


router.get('/account', isloggedin, async function(req,res){
    let user = await userModel.findOne({email : req.user.email});
    console.log(user);
    res.render("profile", { user });
});
router.get('/auth/google',
    passport.authenticate('google',{ scope : ['email', 'profile']})
)

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/failure' }),
    async (req, res) => {
      
      const { user, token, isNewuser} = req.user; 
      
      res.cookie('token', token); 

    if(isNewuser){
        res.redirect('/upload');
    }
    else{
        res.render('index');
    }
    }
);
  
// router.get('/google/callback',
//     passport.authenticate('google',{
//         successRedirect: '/upload',
//         failureRedirect: '/failure'
//     }), (req,res)=>{
//         const { token } = req.user;
//         res.cookie("token",token);
//         console.log('hey wassup');
//     }
// )

router.get('/failure',(req,res)=>{
    res.send("something went wrong");
})

router.get('/home',(req,res)=>{
    res.render('index');
    
})
router.get('/upload', (req,res)=>{
    res.render('propic',{loggedin:false});
})

router.get('/logout',isloggedin,(req,res)=>{
    res.render('login',{ loggedin:false });
})

module.exports = router;