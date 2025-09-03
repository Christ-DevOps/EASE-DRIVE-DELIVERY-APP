// Utils/socketManager.js
const socketIO = require('socket.io');

let io;

// Initialize Socket.IO
exports.initialize = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  
  // Handle connections
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // Join room based on user type and ID
    socket.on('join_restaurant', (restaurantId) => {
      socket.join(`restaurant_${restaurantId}`);
      console.log(`Socket ${socket.id} joined restaurant_${restaurantId}`);
    });
    
    socket.on('join_delivery', (agentId) => {
      socket.join(`delivery_${agentId}`);
      console.log(`Socket ${socket.id} joined delivery_${agentId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  return io;
};

// Emit event to a specific restaurant
exports.emitToRestaurant = (restaurantId, event, data) => {
  if (io) {
    io.to(`restaurant_${restaurantId}`).emit(event, data);
  }
};

// Emit event to a specific delivery agent
exports.emitToDeliveryAgent = (agentId, event, data) => {
  if (io) {
    io.to(`delivery_${agentId}`).emit(event, data);
  }
};

// Get IO instance
exports.getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};