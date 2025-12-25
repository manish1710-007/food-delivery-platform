const { setIo } = require('./io');

module.exports = (io) => {
  setIo(io);

  io.on('connection', socket => {
    console.log('socket connected', socket.id);

    socket.on('join', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined ${room}`);
    });

    socket.on('leave', (room) => {
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
};
