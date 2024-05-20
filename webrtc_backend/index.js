const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const userRoutes= require('./routes/userRegister');
const messageRoutes= require('./routes/messageRoutes');

let messageModel = require('./model/MessageModel');

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
app.use('/message',messageRoutes);
app.use(function(err,req,res,next){
  console.err('Middleware to handle exception',err);
  res.status(500).json({error:"Internal Server Error"})
});
const io = require('socket.io')(server);
server.prependListener("request", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
});
io.on('connection',(socket)=>
{
    console.log(io);
    const id = socket?.handshake?.auth?.token;
    socket.emit('user_online',{id:id});
    socket.on('new message',(e)=>{
        socket.emit('new message',e);
    });
    socket.on('delete message',async (e)=>{
        var deletedId = await messageModel.findByIdAndUpdate({_id:e._id},{$set:{isdeleted:true}});
        socket.emit('message deleted',e._id);
    })
    console.log('Connected to Socket server');
    socket.on('close',function(){
        console.log('Disconnected from the socket server');
    });
});
