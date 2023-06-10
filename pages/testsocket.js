// import { useEffect } from 'react'
// import io from 'Socket.IO-client'
// let socket

// const TestSocket = () => {
//   //useEffect(() => socketInitializer(), [])

//   useEffect(()=> {
//     socketInitializer()
//   },  []);

//   const socketInitializer = async () => {
//     await fetch('/api/socket/socket')
//     socket = io()

//     socket.on('connect', () => {
//       console.log('connected')
//     })
//   }

//   return null
// }

// export default TestSocket;

export default function TestSocket(){
  return (
    <div>Test Socket Default Code</div>
  )
}