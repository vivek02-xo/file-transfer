import React from "react";

const DeviceRegistration = ({
  deviceName,
  setDeviceName,
  registerDevice,
  serverConnected,
}) => {
  return (
    <div className="register-box">
      <h2>Register your device</h2>

      <input
        type="text"
        placeholder="Enter device name"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />

      <button onClick={registerDevice} disabled={!serverConnected}>
        Register Device
      </button>
    </div>
  );
};

export default DeviceRegistration;
