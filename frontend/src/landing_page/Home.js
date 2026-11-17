import React from "react";
import useHome from "../hooks/useHome";

import AppHeader from "./AppHeader";
import ConnectionStatus from "./ConnectionStatus";
import DeviceRegistration from "./DeviceRegistration";
import DeviceList from "./DeviceList";
import FileSender from "./FileSender";
import FileReceiver from "./FileReceiver";

const Home = () => {
  // Get application logic
  const {
    devices,
    deviceName,
    setDeviceName,
    mySocketId,
    serverConnected,

    connectionStatus,
    channelOpen,

    selectedFile,
    setSelectedFile,
    sendProgress,
    setSendProgress,

    receiveStatus,
    receivedFile,

    registerDevice,
    connectToDevice,
    handleSendFile,
    disconnectPeer,
  } = useHome();

  return (
    <div className="app">
      <AppHeader />

      <ConnectionStatus
        serverConnected={serverConnected}
        connectionStatus={connectionStatus}
        channelOpen={channelOpen}
        disconnectPeer={disconnectPeer}
      />

      <DeviceRegistration
        deviceName={deviceName}
        setDeviceName={setDeviceName}
        registerDevice={registerDevice}
        serverConnected={serverConnected}
      />

      <DeviceList
        devices={devices}
        mySocketId={mySocketId}
        serverConnected={serverConnected}
        connectToDevice={connectToDevice}
      />

      <FileSender
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        sendProgress={sendProgress}
        setSendProgress={setSendProgress}
        channelOpen={channelOpen}
        handleSendFile={handleSendFile}
      />

      <FileReceiver receiveStatus={receiveStatus} receivedFile={receivedFile} />
    </div>
  );
};

export default Home;
