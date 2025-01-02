const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const isloggedin = require('./middleware/isloggedin');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');
const cors = require('cors');

require('dotenv').config();
require('./auth');

const db = require('./config/mongoose-connection');

const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(session({secret:'cats'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());
app.use('/register',userRoute);

io.on("connection", function(socket){
    socket.on("send-location",function(data){
        io.emit("recieve-location",{
            id: socket.id, 
            ...data,
            userId: userRoute.id
        });
    })

    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    })
})


app.use('/users',userRoute);
app.use('/',authRoute);
app.get('/profile/:id',(req,res)=>{
    const userId = req.params.id;
    res.send(userId);
})
// app.get('/auth/google',
//     passport.authenticate('google',{ scope : ['email', 'profile']})
// )


// app.get('/google/callback',
//     passport.authenticate('google',{
//         successRedirect: '/home',
//         failureRedirect: '/auth/failure'
//     })
// )

// app.get('/',function(req,res){
//     res.render('login');
// })

// app.get('/home', isloggedin, (req,res)=>{
//     res.render('index');
// })

// app.get('/auth/failure',(req,res)=>{
//     res.send("something went wrong");
// })

server.listen(3000,()=>{
    console.log("server in running");
});