const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const cors = require('cors');
const userRoutes= require('./routes/userRegister');

const server = http.createServer(app);

server.listen('3000',()=>{
    console.log('Server listening to port 3000');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors);
app.set('view engine','ejs');
app.set('views','./views');

app.set(express.static('public'));
app.use('/users',userRoutes);
const io = require('socket.io')(server);

io.on('connection',(socket)=>
{
    console.log(io);
    console.log('Connected to Socket server');
    socket.on('close',function(){
        console.log('Disconnected from the socket server');
    });
});

