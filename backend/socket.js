const express=require("express");
const bodyparser=require("body-parser");
var cors = require('cors')
const { MongoClient } = require('mongodb');
const app=express();
app.use(cors());
app.use(bodyparser.json());
const http = require("http");
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})
io.on('connection', socket => {
    console.log("connected")

    socket.on('allotdriver', async data => {
        console.log(data)
        socket.emit('getallotedriver', data);
      
       
      
       
        
    })

})

 server.listen(8000,()=>{
    console.log("listening 8000");
 })