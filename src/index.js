const path = require('path')
const http = require('http')
const express= require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')

const app = express()
const server=http.createServer(app)
const io = socketio(server)

const port=process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))
let count=0
io.on('connection', (socket)=>{
    console.log('new websocket connection')
    socket.emit('message',{
        text: 'Welcome',
        createdAt: new Date().getTime()
    })
    socket.emit('message',generateMessage('Welcome'))
    socket.broadcast.emit('message',generateMessage(' A new user has joined'))
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        if (filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }
        io.emit('message',generateMessage(message))
        callback()
    })
    socket.on('sendLocation',(coords,callback)=>{ 
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect',()=>{ //this is confusing , according to the lecturer
        io.emit('message',generateMessage('a user has left' ))
    })
})

server.listen(port,()=>{
    console.log(`ser is up on ${port}!`)
})