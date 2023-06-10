// import { Server } from "socket.io";

// const SocketHandler = (req, res) => {
//     if (res.socket.server.io) {
//       console.log('Socket is already running')
//     } else {
//       console.log('Socket is initializing')
//       const io = new Server(res.socket.server)
//       res.socket.server.io = io

//       //on input-change
//       io.on('connection', socket => {
//         socket.on('input-change', msg => {
//           socket.broadcast.emit('update-input', msg)
//         })
//       });


//     }
//     res.end()
//   }
//   //https://codedamn.com/news/nextjs/how-to-use-socket-io
//   export default SocketHandler