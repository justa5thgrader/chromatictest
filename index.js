// Ultraviolet backend server
const express = require('express');
const cors = require('cors');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const bare = require('@tomphttp/bare-server-node');
const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Create bare server
const bareServer = bare.createServer('/bare/');

// Configure Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uv')));
app.use(cors());

// Serve Ultraviolet files
app.use('/uv/', express.static(uvPath));

// Handle requests
app.use((req, res) => {
  // Handle bare requests
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
    return;
  }

  // Handle HTTP upgrades
  app.handle(req, res);
});

// Handle upgrades
server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
    return;
  }
  socket.end();
});

// Start the server
const server = app.listen(PORT, HOST, () => {
  console.log(`Ultraviolet server running on http://${HOST}:${PORT}`);
});
