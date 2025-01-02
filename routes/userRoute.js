const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, uploadpro } = require('../controllers/authControllers');
const upload = require('../config/multer-config');

router.get('/',function(req,res){
    res.render('register',{ loggedin:false });
})

router.post('/register',registerUser);

router.post('/uploadpro',upload.single("image"),uploadpro);

router.post('/login',loginUser);

router.get('/logout',logoutUser);

module.exports = router;