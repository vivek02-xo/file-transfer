import { useState, useRef } from "react";

function useDeviceState() {
  // Device information
  // // list of registered devices
  const [devices, setDevices] = useState([]);

  // user entered name
  const [deviceName, setDeviceName] = useState("");

  // socket.id of my device
  const [mySocketId, setMySocketId] = useState("");

  // connected to backend or not
  const [serverConnected, setServerConnected] = useState(false);

  // Ref
  // stores the socket.io connection between your frontend and backend
  const socketRef = useRef(null);

  // stores device name
  const registeredName = useRef("");

  return {
    devices,
    setDevices,
    deviceName,
    setDeviceName,
    mySocketId,
    setMySocketId,
    serverConnected,
    setServerConnected,
    socketRef,
    registeredName,
  };
}

export default useDeviceState;
