import {
  createPeerConnection,
  setupDataChannel,
} from "../services/webrtcService";

import { sendSignal } from "../services/signalingService";

function useDeviceConnection(refs, callbacks) {
  const connectToDevice = async (deviceId) => {
    // Check backend connection
    if (!refs.socketRef.current?.connected) {
      alert("Backend is not connected");
      return;
    }

    // Prevent connecting to this same device
    if (deviceId === callbacks.mySocketId) return;

    try {
      // Close previous WebRTC connection
      refs.peerRef.current?.close();

      // Reset references
      refs.peerRef.current = null;
      refs.channelRef.current = null;
      refs.pendingCandidatesRef.current = [];
      refs.targetRef.current = deviceId;

      // Reset UI states
      callbacks.setChannelOpen(false);
      callbacks.setConnectionStatus("Connecting...");
      callbacks.setSendProgress(0);

      // Create a new WebRTC peer connection
      const peer = createPeerConnection(deviceId, refs, callbacks);

      // Create DataChannel on the initiating device
      const channel = peer.createDataChannel("file-transfer");

      // Configure DataChannel
      setupDataChannel(channel, refs, callbacks);

      // Create WebRTC offer
      const offer = await peer.createOffer();

      // Set local description
      await peer.setLocalDescription(offer);

      // Send offer to the other device
      sendSignal(refs.socketRef.current, deviceId, {
        type: "offer",
        sdp: peer.localDescription,
      });

      console.log("Offer sent to:", deviceId);
    } catch (error) {
      console.error("Connection error:", error);
      callbacks.setConnectionStatus("Connection failed");
    }
  };

  return { connectToDevice };
}

export default useDeviceConnection;
