import { useState, useRef } from "react";

function useFileTransferState() {
  // File transfer
  // stores the file selected by user.
  const [selectedFile, setSelectedFile] = useState(null);

  // stores the percentage of file transfer progress.
  const [sendProgress, setSendProgress] = useState(0);

  // stores status about receiving file.
  const [receiveStatus, setReceiveStatus] = useState("");

  // stores info about received file.
  const [receivedFile, setReceivedFile] = useState(null);

  //   ref
  // stores info about file currently being received
  const incomingTransferRef = useRef(null);

  return {
    selectedFile,
    setSelectedFile,
    sendProgress,
    setSendProgress,
    receiveStatus,
    setReceiveStatus,
    receivedFile,
    setReceivedFile,
    incomingTransferRef,
  };
}

export default useFileTransferState;
