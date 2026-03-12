const { setIo } = require('./io');

module.exports = (io) => {
  setIo(io);

  io.on('connection', (socket) => {
    console.log(`[SYS.NET] WebSocket Handshake Established | Node ID: ${socket.id}`);

    
    // RESTAURANT OWNER DASHBOARD UPLINK
    
    socket.on("JoinRestaurant", () => {
      socket.join("restaurant");
      console.log(`[SYS.NET] Node ${socket.id} joined secure room: [restaurant_dashboard]`);
    });

    // USER LIVE TRACKING UPLINK
  
    socket.on("JoinOrder", (orderId) => {
      if (!orderId) {
        return console.warn(`[SYS.WARN] Node ${socket.id} attempted to join empty order room.`);
      }
      
      // Force string conversion just in case the frontend sends a raw MongoDB ObjectId
      socket.join(String(orderId));
      console.log(`[SYS.NET] Node ${socket.id} joined tracking room: [Order_${orderId}]`);
    });

    socket.on('leave', (orderId) => {
      if (orderId) {
        socket.leave(String(orderId));
        console.log(`[SYS.NET] Node ${socket.id} left tracking room: [Order_${orderId}]`);
      }
    });

    // DISCONNECT PROTOCOL
    
    socket.on('disconnect', () => {
      console.log(`[SYS.NET] WebSocket Terminated | Node ID: ${socket.id}`);
    });
  });
};