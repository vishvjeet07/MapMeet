const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2').Strategy;
const userModel = require('./models/user-model');
const { generateToken } = require('./utils/generateToken');

require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try{
      const email = profile.emails[0].value;
      let isNewuser = false;
      let user = await userModel.findOne({email});
      if(!user){
          user = await userModel.create({
          email: email,
          username: profile.displayName,
          authProvider:'google'
        });
          console.log('New user created:', user);
          isNewuser = true;
        } else {
          console.log('User already exists:', user);
        }
        const token = generateToken(user);
        done(null,{user, token, isNewuser});
    } catch(error){
      console.error('Error during authentication:', error);
      done(error,null);
    }
    }
));

passport.serializeUser(function(user,done){
    done(null,user)
});

passport.deserializeUser(function(user,done){
  done(null,user)
})