function signalingController(io, socket, devices) {
  // Forward WebRTC signaling messages to another device
  socket.on("signal", ({ to, data }) => {
    if (!devices.has(to)) {
      console.log("Target device not found");
      return;
    }

    io.to(to).emit("signal", {
      from: socket.id,
      data: data,
    });
  });
}

module.exports = signalingController;
