const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const userRoutes= require('./routes/userRegister');
const messageRoutes= require('./routes/messageRoutes');
const cookie= require('cookie-parser')
const session = require('express-session');

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
app.use(cookie());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
}))
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
    const id = socket?.handshake?.auth?.token;
    console.log('user_id',id);
    socket.emit('user__online',{id:id});
    socket.on('new message',(e)=>{
        socket.broadcast.emit('new message',e);
    });
    socket.on('delete message',async (e)=>{
        var deletedId = await messageModel.findByIdAndUpdate({_id:e._id},{$set:{isdeleted:true}});
        socket.emit('message deleted',e._id);
    });
    socket.on('edit Message',async(e)=>{
        await messageModel.findByIdAndUpdate({_id:e._id},{$set:{message:e.message}});
        const newMessage = await messageModel.findById({_id:e._id});
        socket.broadcast.emit('message updated',newMessage);
    });
    socket.on('reject call',(e)=>{
        console.log(e);
        socket.broadcast.emit('reject the call',{...e});
    })
    socket.on('user_join',(e)=>{
        const {from,roomId,to}=e;
        socket.broadcast.emit('user__request',{...e,id:socket.id});
        socket.join(roomId);  
    });
    socket.on('user__request__accept',(e)=>{
        socket.broadcast.emit('user__request__accept',{...e,id:socket.id});
        socket.join(e.roomId); 
    });

    socket.on('user call',(e)=>{
        console.log(e);
        const {to,offer}=e;
        socket.to(to).emit('incoming call',{from:socket.id,offer:offer});
    })
    socket.on('call accept',(e)=>{
        const {to,answer}=e;
        io.to(to).emit('call accept',{from:socket.id,answer:answer});

    });
    socket.on('negotiation',(e)=>{
        const {offer,to}=e;
        io.to(to).emit('negotiation',{from:socket.id,offer:offer});

    });
    
    socket.on('negotiation completed',(e)=>{
        const {to,answer}=e;
        io.to(to).emit('negotiation completed',{from:socket.id,answer});

    });

    socket.on('disconnect call',(e)=>{
        io.to(e.to).emit('disconnect call',{from :socket.id})
    })
    console.log('Connected to Socket server');
    socket.on('close',function(){
        console.log('Disconnected from the socket server');
    });
});

