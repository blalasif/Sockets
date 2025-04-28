import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from "cookie-parser";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 again, not "*"
    credentials: true,
  })
);
//socket server
const server = new createServer(app);
// io instance
const secret_key = "sdfaaaaaaa";


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 👈 your frontend URL, NOT "*"
    methods: ["GET", "POST"],
    credentials: true,
  },
});


app.get("/login",(req,res)=>{
  const token = jwt.sign({ _id: "jlkfdaaaaaaaaaa" }, secret_key);
  res.cookie("token",token,{httpOnly:true,secure:true,sameSite:'none'}).json({
    message:"Login Success"
  })
})

const user = false
io.use((socket, next) => {
  cookieParser()(socket.request,socket.request.res,(err)=>{
    if(err) return next(err)
      const token = socket.request.cookies.token;
    if(!token) return next(new Error("Authentication Error"))
      const decoded = jwt.verify(token,secret_key)
    next()

  })
});
io.on("connection", (socket) => {
  console.log("🚀 ~ io.on ~ socket.id:", socket.id);
  // socket.emit("welcome","Welcome to our Chat-App")
  // socket.broadcast.emit("welcome",`${socket.id} joined the Server`)

  socket.on("message",({message,room})=>{
  // console.log("🚀 ~ socket.on ~ data:", data)
  io.to(room).emit("recieve-message", message);

  })

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`🚀 ~User Join the room ~ room ${room}`)
    
  });
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
