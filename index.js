const express = require('express');
const cors = require('cors');
const bare = require('@tomphttp/bare-server-node');
const { UVRequest, UVResponse } = require('@titaniumnetwork-dev/ultraviolet/dist/uv');
const { UVServer } = require('@titaniumnetwork-dev/ultraviolet/dist/uv/server');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Create Bare server for Ultraviolet
const bareServer = bare.createBareServer('/bare/');

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Main Ultraviolet middleware
const uvServer = new UVServer({
  bare: bareServer,
  request: UVRequest,
  response: UVResponse
});
app.use((req, res) => uvServer.handleRequest(req, res));

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Ultraviolet server running on port ${PORT}`);
});

// Attach bare server to the HTTP server
bareServer.attach(server);
