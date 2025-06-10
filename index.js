const express = require('express');
const cors = require('cors');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3000;

// Create bare server
const bareServer = createBareServer('/bare/');

// Set up HTTP server
const server = http.createServer();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Serve Ultraviolet files
app.use('/uv/', express.static(uvPath));

// Handle requests
server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
    return;
  }
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
server.listen(PORT, () => {
  console.log(`Ultraviolet server running on port ${PORT}`);
});
