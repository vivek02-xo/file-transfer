import React from "react";

const ConnectionStatus = ({
  serverConnected,
  connectionStatus,
  channelOpen,
  disconnectPeer,
}) => {
  return (
    <>
      <p className={serverConnected ? "online" : "offline"}>
        {serverConnected
          ? "Connected to local server"
          : "Connecting to server..."}
      </p>

      <div className="devices-box">
        <h2>Device Connection</h2>

        <p>
          Status: <strong>{connectionStatus}</strong>
        </p>

        {channelOpen && <button onClick={disconnectPeer}>Disconnect</button>}
      </div>
    </>
  );
};

export default ConnectionStatus;
