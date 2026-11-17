// Send signaling info through Socket.IO to backend
const sendSignal = (socket, to, data) => {
  socket?.emit("signal", { to, data });
};

export { sendSignal };
