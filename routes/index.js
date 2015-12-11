'use strict';

module.exports = (app, io) => {
  app.get('/', genId);

  function genId(req, res) {
    let id = Date.now();
    res.redirect('/' + id);
  }

  io.on('connection', socket => {
    socket.on('move', data => {
      socket.broadcast.emit('move', data);
    });
  });
};
