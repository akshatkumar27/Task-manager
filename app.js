const express = require('express');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors=require('cors')
const http = require('http');
dotenv.config();  
const mongoURI = process.env.MONGO_URI;
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json());  
app.use(cors());
app.use(bodyParser.json());


const uri=mongoURI;
mongoose.set('strictQuery', false);
mongoose.connect(uri,
    {
        useNewUrlParser:true, 
        useUnifiedTopology:true, 
    })
.then(()=>{
    console.log("mongoose connected");
})
.catch((err)=>{ 
    console.log(err);
})

 
const registerRoutes=require('./Route/Auth');
const task=require('./Route/taskRoute');
app.use('/auth',registerRoutes) 
app.use('/task',task)



app.use((req,res)=>{ 
    io.on('connection', (socket) => {
        console.log('a user connected');
      });
    res.send("Welcome to Task Manager Server");
  })

app.use((req,res,next)=>{
 const err=new Error("Not Found")
 err.status=404
})





// express error 
app.use(()=>{
res.status(err.status||500)
res.send({
    status:err.status || 500,
    message:'Not found'
})
})

module.exports=app;