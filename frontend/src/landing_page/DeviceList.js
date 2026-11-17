import React from "react";

const DeviceList = ({
  devices,
  mySocketId,
  serverConnected,
  connectToDevice,
}) => {
  return (
    <div className="devices-box">
      <h2>Available Devices</h2>

      {devices.length === 0 ? (
        <p>No devices registered yet.</p>
      ) : (
        <ul>
          {devices.map((device) => (
            <li key={device.id}>
              <span>
                {device.name}
                {device.id === mySocketId && " (This device)"}
              </span>

              {device.id !== mySocketId && (
                <button
                  onClick={() => connectToDevice(device.id)}
                  disabled={!serverConnected}
                >
                  Connect
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
