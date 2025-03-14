const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("draw", (data) => {
    console.log("Drawing");
    socket.broadcast.emit("draw", data);
  });

  socket.on("clear", (data) => {
    console.log("Clearing canvas");
    socket.broadcast.emit("clear", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("WebSocket server running on port 3001");
});
