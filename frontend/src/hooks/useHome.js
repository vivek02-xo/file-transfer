import { useCallback } from "react";
import useDeviceState from "./useDeviceState";
import useConnectionState from "./useConnectionState";
import useFileTransferState from "./useFileTransferState";

import useSocketConnection from "./useSocketConnection";
import useDeviceConnection from "./useDeviceConnection";

import { handleReceivedData, sendFile } from "../services/fileTransferService";

function useHome() {
  // 1. Device state
  const deviceState = useDeviceState();

  // 2. Connection state
  const connectionState = useConnectionState();

  // 3. File transfer state
  const fileState = useFileTransferState();

  // 4. Collect references
  const refs = {
    socketRef: deviceState.socketRef,
    registeredName: deviceState.registeredName,

    peerRef: connectionState.peerRef,
    channelRef: connectionState.channelRef,
    targetRef: connectionState.targetRef,
    pendingCandidatesRef: connectionState.pendingCandidatesRef,

    incomingTransferRef: fileState.incomingTransferRef,
  };

  // 5. Collect callbacks
  const handleReceivedDataCallback = useCallback(
    (event) => {
      handleReceivedData(
        event,
        { incomingTransferRef: fileState.incomingTransferRef },
        {
          setReceivedFile: fileState.setReceivedFile,
          setReceiveStatus: fileState.setReceiveStatus,
        },
      );
    },
    [
      fileState.incomingTransferRef,
      fileState.setReceivedFile,
      fileState.setReceiveStatus,
    ],
  );

  const callbacks = {
    setDevices: deviceState.setDevices,
    setMySocketId: deviceState.setMySocketId,
    setServerConnected: deviceState.setServerConnected,

    setConnectionStatus: connectionState.setConnectionStatus,
    setChannelOpen: connectionState.setChannelOpen,

    setSendProgress: fileState.setSendProgress,

    handleReceivedData: handleReceivedDataCallback,
  };

  // 6. Socket connection and signaling
  useSocketConnection(refs, callbacks);

  // 7. Connect to another device
  const { connectToDevice } = useDeviceConnection(refs, {
    ...callbacks,
    mySocketId: deviceState.mySocketId,
  });

  // 8. Register this device
  const registerDevice = () => {
    const name = deviceState.deviceName.trim();

    if (!name) {
      alert("Please enter your device name");
      return;
    }

    if (!refs.socketRef.current?.connected) {
      alert("Backend is not connected");
      return;
    }

    refs.registeredName.current = name;
    refs.socketRef.current.emit("register-device", name);
  };

  // 9. Send file
  const handleSendFile = async () => {
    await sendFile(refs.channelRef.current, fileState.selectedFile, {
      setSendProgress: fileState.setSendProgress,
      onError: (message) => alert(message),
    });
  };

  // 10. Disconnect peer
  const disconnectPeer = () => {
    refs.peerRef.current?.close();

    refs.peerRef.current = null;
    refs.channelRef.current = null;
    refs.targetRef.current = null;
    refs.pendingCandidatesRef.current = [];

    connectionState.setChannelOpen(false);
    connectionState.setConnectionStatus("Not connected");
    fileState.setSendProgress(0);
  };

  // 11. Return everything needed by the UI
  return {
    ...deviceState,
    ...connectionState,
    ...fileState,

    registerDevice,
    connectToDevice,
    handleSendFile,
    disconnectPeer,
  };
}

export default useHome;
