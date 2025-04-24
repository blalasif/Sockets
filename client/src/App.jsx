import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Button, Container, TextField, Typography} from "@mui/material"

const App = () => {
const [message,setMessage] = useState('')
const [room,setRoom] = useState('')
const[socketid,setSocketId] = useState('')

  const socket = useMemo(()=>io("http://localhost:2000"),[])


  useEffect(()=>{
  socket.on("connect",()=>{
    setSocketId(socket.id)
  socket.on("recieve-message",(data)=>{
    console.log("🚀 ~ socket.on ~ data:", data)
    

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
    
    <Container maxWidth="sm" >
      {/* <Typography variant= "h1" component="div" gutterBottom>
        Welcome to Socket.IO
      </Typography> */}
      <Typography variant= "h6" component="div" gutterBottom>
        {socketid}
      </Typography>

      <form action="" onSubmit={handleSubmit}>
        <TextField value={message} name='message' onChange={e=>setMessage(e.target.value)} id='outlined-basic' label="Message" variant="outlined"/>
        <TextField value={room} name='room' onChange={e=>setRoom(e.target.value)} id='outlined-basic' label="Room" variant="outlined"/>
        <Button type='submit' variant='contained' color='primary'>Send</Button>
      </form>

    </Container>
    
    
    </>

  )
}

export default App