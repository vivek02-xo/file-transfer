import { useState, useRef } from "react";

function useConnectionState() {
  // WebRTC connection
  // This stores the connection status.
  const [connectionStatus, setConnectionStatus] = useState("Not connected");

  // tells file transfer is possible or not.
  const [channelOpen, setChannelOpen] = useState(false);

  // References

  // stores the webrtc peer connection object
  const peerRef = useRef(null);

  // stores the webrtc datachannel
  const channelRef = useRef(null);

  // stores id of the device we want to connect
  const targetRef = useRef(null);

  // temporarily stores connection info that arrives too early
  const pendingCandidatesRef = useRef([]);

  return {
    connectionStatus,
    setConnectionStatus,
    channelOpen,
    setChannelOpen,
    peerRef,
    channelRef,
    targetRef,
    pendingCandidatesRef,
  };
}

export default useConnectionState;
