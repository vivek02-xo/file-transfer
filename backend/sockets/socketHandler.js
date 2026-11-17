const deviceController = require("../controllers/deviceController");
const signalingController = require("../controllers/signalingController");

function socketHandler(io, devices) {
  io.on("connection", (socket) => {
    deviceController(io, socket, devices);

    signalingController(io, socket, devices);
  });
}

module.exports = socketHandler;
