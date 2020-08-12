const express = require('express')
const app = express()
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, '..', 'html')))

http.listen(9999)

const presses = new Map()

io.on('connection', socket => {
  console.log('Connection!')
  socket.on('pressed', msg => {
    if (!msg || !msg.gameid) {
      return
    }
    if (presses.has(msg.gameid)) {
      socket.emit('failed')
      return
    }
    presses.set(msg.gameid, true)
    setTimeout(() => {
      presses.delete(msg.gameid)
    }, 10000)
    socket.emit('fastest')
  })
})
