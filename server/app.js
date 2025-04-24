import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors'
const app = express();
app.use(cors())
//socket server
const server = new createServer(app);
// io instance
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['GET','POST'],
        credentials:true
    }
});

io.on("connection", (socket) => {
  console.log("🚀 ~ io.on ~ socket.id:", socket.id);
  // socket.emit("welcome","Welcome to our Chat-App")
  // socket.broadcast.emit("welcome",`${socket.id} joined the Server`)

  socket.on("message",({message,room})=>{
  // console.log("🚀 ~ socket.on ~ data:", data)
  io.to(room).emit("recieve-message", message);

  })
  socket.on("disconnect",()=>{
    console.log("User Disconnected",socket.id)
  })
});

const port = 2000;

app.get("/", (req, res) => {
  console.log("GET / route was hit");

  res.send("Hello app");
});

server.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
