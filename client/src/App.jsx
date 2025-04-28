import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Box, Button, Container, Stack, TextField, Typography} from "@mui/material"

const App = () => {
  const [messages, setMessages] = useState([]);
const [message,setMessage] = useState('')
const [room,setRoom] = useState('')
const[socketid,setSocketId] = useState('')
const[roomName,setRoomName] = useState('')

  const socket = useMemo(()=>io("http://localhost:2000",{
    withCredentials:true,
  }),[])





  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName)
    setRoomName("")
  }
  useEffect(()=>{
  socket.on("connect",()=>{
    setSocketId(socket.id)
  socket.on("recieve-message",(data)=>{
    console.log("🚀 ~ socket.on ~ data:", data)
  setMessages((prev) => [...prev, data]);     

  });
  socket.on("welcome",(s)=>{
    console.log("🚀 ~ socket.on ~ s:", s)
    
  })


  return ()=>{
    socket.disconnect();
  }
  
})
  },[])
  
   const handleSubmit = (e) => {
     e.preventDefault();
     socket.emit("message", { message, room });
     setMessage("");
   };
 
  return (
    <>
      <Container maxWidth="sm">
        <Box sx={{ height: "200px" }}>
          {/* <Typography variant= "h1" component="div" gutterBottom>
        Welcome to Socket.IO
      </Typography> */}
          <Typography variant="h6" component="div" gutterBottom>
            {socketid}
          </Typography>

          <form action="" onSubmit={joinRoomHandler}>
            <h5>Join Room</h5>
            <TextField
              value={roomName}
              name="message"
              onChange={(e) => setRoomName(e.target.value)}
              id="outlined-basic"
              label="Room Name"
              variant="outlined"
            />{" "}
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </form>

          <form action="" onSubmit={handleSubmit}>
            <TextField
              value={message}
              name="message"
              onChange={(e) => setMessage(e.target.value)}
              id="outlined-basic"
              label="Message"
              variant="outlined"
            />
            <TextField
              value={room}
              name="room"
              onChange={(e) => setRoom(e.target.value)}
              id="outlined-basic"
              label="Room"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
          <Stack>
            {messages.map((m, i) => (
              <Typography key={i}>{m}</Typography>
            ))}
          </Stack>
        </Box>
      </Container>
    </>
  );
}

export default App