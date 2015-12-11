'use strict';

const express = require('express');
const config = require('config');
// const redis = require('redis');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./config')(app);

const port = process.env.PORT || config.port;
// const client = redis.createClient();

http.listen(port, () => {
  console.log('app start on port ' + config.port);
});

app.use('/:id', express.static(__dirname + '/www'));
require('./routes')(app, io);

app.use((req, res) => {
  res.sendStatus(404);
});
