require("dotenv").config();
const express = require("express");
// protocal for web communication (hypertext transfer protocal)
const http = require("http");
// controls which websites are allowed to access responses from your server.
const cors = require("cors");

// socket.io Server for communicate in real time.
const { Server } = require("socket.io");

const homeRoute = require("./routes/homeRoute");
const socketHandler = require("./sockets/socketHandler");

const app = express();

// creating http server.
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

// It allows to understand incomming JSON req bodies.
app.use(express.json({ limit: "10kb" }));

app.use("/", homeRoute);

// we atteched http server to socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

// Stores devices information
const devices = new Map();

socketHandler(io, devices);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
