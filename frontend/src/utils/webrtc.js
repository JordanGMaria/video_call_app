export async function createPeerConnection(socket, targetPeerId, localStream) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  let stream = localStream;

  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  }

  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      if (targetPeerId) {
        socket.emit("candidate", {
          candidate: event.candidate,
          target: targetPeerId,
        });
      }
    }
  };

  return { pc, stream };
}
