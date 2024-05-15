const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const userRoutes= require('./routes/userRegister');

const server = http.Server(app);

server.listen(3000,()=>{
    console.log('Server listening to port 3000');
});

const url = 'mongodb://localhost:27017/webrtc_application';
mongoose.connect(url).then(()=>{
    console.log('Connected to mongo DB');
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.set('view engine','ejs');
app.set('views','./views');

app.set(express.static('public'));
app.use('/users',userRoutes);
app.use(function(err,req,res,next){
  console.err('Middleware to handle exception',err);
  res.status(500).json({error:"Internal Server Error"})
});
const io = require('socket.io')(server);

io.on('connection',(socket)=>
{
    console.log(io);
    console.log('Connected to Socket server');
    socket.on('close',function(){
        console.log('Disconnected from the socket server');
    });
});

