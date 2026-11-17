import { sendSignal } from "./signalingService";

const setupDataChannel = (channel, refs, callbacks) => {
  refs.channelRef.current = channel;

  channel.binaryType = "arraybuffer";
  channel.bufferedAmountLowThreshold = 512 * 1024;

  channel.onopen = () => {
    console.log("WebRTC DataChannel opened");

    callbacks.setChannelOpen(true);
    callbacks.setConnectionStatus("Connected");
  };

  channel.onclose = () => {
    callbacks.setChannelOpen(false);
    callbacks.setConnectionStatus("Disconnected");
  };

  channel.onerror = (error) => {
    console.error("DataChannel error:", error);

    callbacks.setConnectionStatus("Connection error");
  };

  channel.onmessage = callbacks.handleReceivedData;
};

// Create WebRTC peer connection
const createPeerConnection = (peerId, refs, callbacks) => {
  const peer = new RTCPeerConnection({
    // Local network candidates only. No STUN or TURN server.
    iceServers: [],
  });

  refs.peerRef.current = peer;

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      sendSignal(refs.socketRef.current, peerId, {
        type: "ice-candidate",
        candidate: event.candidate,
      });
    }
  };

  peer.ondatachannel = (event) => {
    console.log("Received DataChannel");
    setupDataChannel(event.channel, refs, callbacks);
  };

  peer.onconnectionstatechange = () => {
    console.log("WebRTC state:", peer.connectionState);

    if (
      peer.connectionState === "failed" ||
      peer.connectionState === "disconnected" ||
      peer.connectionState === "closed"
    ) {
      callbacks.setChannelOpen(false);

      callbacks.setConnectionStatus(
        peer.connectionState === "failed"
          ? "Connection failed"
          : "Disconnected",
      );
    }
  };

  return peer;
};

// Add ICE candidates that arrived before the remote description
const flushPendingCandidates = async (peer, pendingCandidatesRef) => {
  const candidates = pendingCandidatesRef.current;

  pendingCandidatesRef.current = [];

  for (const candidate of candidates) {
    try {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Could not add queued ICE candidate:", error);
    }
  }
};

export { setupDataChannel, createPeerConnection, flushPendingCandidates };
