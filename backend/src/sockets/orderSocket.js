const { setIo } = require('./io');

module.exports = (io) => {
  setIo(io);

  io.on('connection', socket => {
    console.log('socket connected', socket.id);

    socket.on('join', (orderId) => {
      socket.join(orderId);
      console.log(`Joined order room: ${orderId}`);
    });

    socket.on('leave', (orderId) => {
      socket.leave(orderId);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
};
