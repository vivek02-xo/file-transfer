import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  createPeerConnection,
  flushPendingCandidates,
} from "../services/webrtcService";
import { sendSignal } from "../services/signalingService";

function useSocketConnection(refs, callbacks) {
  const refsRef = useRef(refs);
  const callbacksRef = useRef(callbacks);

  // Keep the latest values without reconnecting the socket.
  refsRef.current = refs;
  callbacksRef.current = callbacks;
  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_URL);

    refs.socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to backend");

      callbacks.setServerConnected(true);
      callbacks.setMySocketId(socket.id);

      if (refs.registeredName.current) {
        socket.emit("register-device", refs.registeredName.current);
      }
    });

    // Handle backend disconnection
    socket.on("disconnect", () => {
      callbacks.setServerConnected(false);
      callbacks.setMySocketId("");
      callbacks.setDevices([]);

      refs.peerRef.current?.close();

      refs.peerRef.current = null;
      refs.channelRef.current = null;
      refs.targetRef.current = null;
      refs.pendingCandidatesRef.current = [];

      callbacks.setConnectionStatus("Server disconnected");
      callbacks.setChannelOpen(false);
    });

    // Receive updated device list
    socket.on("devices-updated", (deviceList) => {
      callbacks.setDevices(deviceList);
    });

    // Receive WebRTC signaling messages
    socket.on("signal", async ({ from, data }) => {
      try {
        if (data.type === "offer") {
          console.log("Received WebRTC offer");

          refs.targetRef.current = from;

          const peer = createPeerConnection(from, refs, callbacks);

          await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));

          await flushPendingCandidates(peer, refs.pendingCandidatesRef);

          const answer = await peer.createAnswer();

          await peer.setLocalDescription(answer);

          sendSignal(socket, from, {
            type: "answer",
            sdp: peer.localDescription,
          });

          callbacks.setConnectionStatus("Connecting...");
        } else if (data.type === "answer") {
          console.log("Received WebRTC answer");

          const peer = refs.peerRef.current;

          if (!peer) return;

          await peer.setRemoteDescription(new RTCSessionDescription(data.sdp));

          await flushPendingCandidates(peer, refs.pendingCandidatesRef);
        } else if (data.type === "ice-candidate") {
          const peer = refs.peerRef.current;

          if (!peer || !peer.remoteDescription) {
            refs.pendingCandidatesRef.current.push(data.candidate);
          } else {
            await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        }
      } catch (error) {
        console.error("Signaling error:", error);
        callbacks.setConnectionStatus("Connection error");
      }
    });

    // Cleanup when the component unmounts
    return () => {
      socket.disconnect();
      refs.peerRef.current?.close();
      refs.socketRef.current = null;
    };
  }, [refs, callbacks]);
}

export default useSocketConnection;
