import React from "react";

const FileReceiver = ({ receiveStatus, receivedFile }) => {
  return (
    <div className="devices-box">
      <h2>Received Files</h2>

      <p>{receiveStatus || "No file received yet."}</p>

      {receivedFile && (
        <div>
          <p>File: {receivedFile.name}</p>

          <a href={receivedFile.url} download={receivedFile.name}>
            Download Received File
          </a>
        </div>
      )}
    </div>
  );
};

export default FileReceiver;
