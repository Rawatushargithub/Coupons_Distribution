import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js'; // Your Express app

// Create an HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow all origins for simplicity
  },
});

// Socket.IO connection

try {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
} catch (error) {
  console.log(error.message)
}

// Export the server and io for use in controllers
export { server, io };
