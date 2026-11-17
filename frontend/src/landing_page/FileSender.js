import React from "react";

const FileSender = ({
  selectedFile,
  setSelectedFile,
  sendProgress,
  setSendProgress,
  channelOpen,
  handleSendFile,
}) => {
  return (
    <div className="register-box">
      <h2>Send a File</h2>

      <input
        type="file"
        onChange={(e) => {
          setSelectedFile(e.target.files?.[0] || null);
          setSendProgress(0);
        }}
        disabled={!channelOpen}
      />

      {selectedFile && <p>Selected: {selectedFile.name}</p>}

      <button onClick={handleSendFile} disabled={!channelOpen || !selectedFile}>
        Send File
      </button>

      {sendProgress > 0 && <p>Sending: {sendProgress}%</p>}
    </div>
  );
};

export default FileSender;
