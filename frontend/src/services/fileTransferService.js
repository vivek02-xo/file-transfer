const CHUNK_SIZE = 16 * 1024;

// Receive file information and file chunks
const handleReceivedData = (event, refs, callbacks) => {
  if (typeof event.data === "string") {
    let message;

    try {
      message = JSON.parse(event.data);
    } catch {
      console.error("Invalid transfer message");
      return;
    }

    if (message.type === "file-meta") {
      refs.incomingTransferRef.current = {
        name: message.name,
        size: message.size,
        mimeType: message.mimeType,
        chunks: [],
        received: 0,
      };

      callbacks.setReceivedFile(null);
      callbacks.setReceiveStatus(`Receiving ${message.name}...`);
    }

    if (message.type === "file-end") {
      const transfer = refs.incomingTransferRef.current;

      if (!transfer) return;

      const blob = new Blob(transfer.chunks, {
        type: transfer.mimeType || "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);

      callbacks.setReceivedFile({
        name: transfer.name,
        size: transfer.size,
        url,
      });

      callbacks.setReceiveStatus("File received successfully!");

      refs.incomingTransferRef.current = null;
    }
  } else {
    const transfer = refs.incomingTransferRef.current;

    if (!transfer) return;

    transfer.chunks.push(event.data);
    transfer.received += event.data.byteLength;

    const progress = transfer.size
      ? Math.round((transfer.received / transfer.size) * 100)
      : 0;

    callbacks.setReceiveStatus(`Receiving ${transfer.name}: ${progress}%`);
  }
};

// Wait until the DataChannel buffer has space
const waitForLowBuffer = (channel) => {
  if (channel.bufferedAmount <= 512 * 1024) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    channel.onbufferedamountlow = () => {
      channel.onbufferedamountlow = null;
      resolve();
    };
  });
};

// Send the selected file in chunks
const sendFile = async (channel, selectedFile, callbacks) => {
  if (!selectedFile) {
    callbacks.onError("Please select a file");
    return;
  }

  if (!channel || channel.readyState !== "open") {
    callbacks.onError("Connect to another device first");
    return;
  }

  try {
    callbacks.setSendProgress(0);

    // Send file metadata
    channel.send(
      JSON.stringify({
        type: "file-meta",
        name: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.type,
      }),
    );

    // Send file in chunks
    let offset = 0;

    while (offset < selectedFile.size) {
      await waitForLowBuffer(channel);

      const chunk = selectedFile.slice(offset, offset + CHUNK_SIZE);

      const buffer = await chunk.arrayBuffer();

      channel.send(buffer);

      offset += buffer.byteLength;

      const progress = Math.round((offset / selectedFile.size) * 100);

      callbacks.setSendProgress(progress);
    }

    // Notify receiver that transfer is complete
    channel.send(
      JSON.stringify({
        type: "file-end",
      }),
    );

    callbacks.setSendProgress(100);

    console.log("File sent successfully");
  } catch (error) {
    console.error("File sending error:", error);
    callbacks.onError("File transfer failed");
  }
};

export { handleReceivedData, waitForLowBuffer, sendFile };
