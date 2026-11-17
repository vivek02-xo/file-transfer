function deviceController(io, socket, devices) {
  console.log("Connected device:", socket.id);

  // Send existing devices to the newly connected device
  socket.emit("devices-updated", Array.from(devices.values()));

  // when user click register button frontend sends this event
  socket.on("register-device", (deviceName) => {
    // creating device object
    const device = {
      id: socket.id,
      name: String(deviceName).trim().slice(0, 40) || "Unknown Device",
    };

    // store new info in map
    devices.set(socket.id, device);

    console.log("Device registered:", device.name);

    io.emit("devices-updated", Array.from(devices.values()));
  });

  // Disconnect device
  socket.on("disconnect", () => {
    console.log("Device disconnected:", socket.id);

    devices.delete(socket.id);

    io.emit("devices-updated", Array.from(devices.values()));
  });
}

module.exports = deviceController;
