const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// socket logic
require("./src/sockets/socketHandler")(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});