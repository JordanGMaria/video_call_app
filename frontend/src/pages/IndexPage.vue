<template>
  <q-page class="q-pa-md video-call-page" style="height: 100dvh; display: flex; flex-direction: column">
    <div class="q-mb-md" style="animation: slideUp 0.6s ease-out">
      <div class="text-caption text-weight-bold text-grey-7 text-uppercase q-mb-xs" style="letter-spacing: 0.18em">
        WebRTC
      </div>
      <div class="row items-center justify-between">
        <div>
          <h1 class="text-h4 text-weight-bold q-my-sm header-title">Video Call</h1>
          <p class="text-body2 text-grey-7 q-my-none">Connect in a private room with audio and video.</p>
        </div>
        <div class="row items-center q-gutter-md">
          <ThemeToggle />
          <q-badge
            :color="isInRoom ? 'positive' : 'grey-5'"
            :label="isInRoom ? `Connected (${participantsCount})` : 'Disconnected'"
          >
            <q-icon name="fiber_manual_record" size="10px" class="q-mr-xs" />
          </q-badge>
        </div>
      </div>
    </div>

    <q-card
      flat
      bordered
      class="q-mb-md controls-card"
      style="border-radius: 12px; animation: slideUp 0.6s ease-out 0.1s both"
    >
      <q-card-section class="row q-gutter-sm items-center">
        <q-btn
          v-if="!isInRoom"
          label="Join room"
          @click="startCall"
          unelevated
          size="md"
          class="q-px-lg text-weight-bold join-btn"
        />
        <q-btn
          v-else
          label="Hang up"
          @click="endCall"
          unelevated
          size="md"
          class="q-px-lg text-weight-bold hang-up-btn"
        />

        <q-btn
          :label="isMuted ? 'Unmute' : 'Mute'"
          @click="toggleMute"
          :disable="!isInRoom"
          unelevated
          size="md"
          class="q-px-lg"
          :icon="isMuted ? 'mic_off' : 'mic'"
        />
        <q-btn
          :label="isCameraOff ? 'Camera On' : 'Camera Off'"
          @click="toggleCamera"
          :disable="!isInRoom"
          unelevated
          size="md"
          class="q-px-lg"
          :icon="isCameraOff ? 'videocam_off' : 'videocam'"
        />
      </q-card-section>
    </q-card>

    <div v-if="pinnedPeerId" class="column q-gutter-md" style="flex: 1; overflow: hidden">
      <q-card
        flat
        class="video-card pinned-card"
        :class="{
          'speaking-border':
            pinnedPeerId === 'local' ? isLocalSpeaking : remotePeers.find((p) => p.id === pinnedPeerId)?.speaking,
        }"
      >
        <div class="video-header">
          <span class="text-weight-bold">
            {{ pinnedPeerId === "local" ? "You (pinned)" : "Remote (pinned)" }}
          </span>
          <q-btn
            v-if="participantsCount > 1"
            flat
            round
            dense
            icon="push_pin"
            @click="unpinVideo"
            size="sm"
            color="white"
          >
            <q-tooltip>Unpin</q-tooltip>
          </q-btn>
        </div>
        <video
          :ref="pinnedPeerId === 'local' ? 'localVideo' : (el) => setVideoRef(el, pinnedPeerId)"
          autoplay
          :muted="pinnedPeerId === 'local'"
          playsinline
          class="video-element"
        ></video>
      </q-card>

      <div class="row q-gutter-sm" style="flex-shrink: 0; overflow-x: auto; padding: 8px 0">
        <q-card
          v-if="pinnedPeerId !== 'local'"
          flat
          class="thumbnail-card"
          :class="{ 'speaking-border': isLocalSpeaking }"
          @click="pinVideo('local')"
        >
          <div
            class="text-caption text-weight-bold"
            style="
              position: absolute;
              top: 4px;
              left: 4px;
              z-index: 10;
              color: white;
              background: rgba(0, 0, 0, 0.6);
              padding: 2px 6px;
              border-radius: 4px;
            "
          >
            You
          </div>
          <video
            ref="localVideo"
            autoplay
            muted
            playsinline
            style="width: 100%; height: 100%; object-fit: cover"
          ></video>
        </q-card>

        <q-card
          v-for="peer in remotePeers.filter((p) => p.id !== pinnedPeerId)"
          :key="peer.id"
          flat
          class="thumbnail-card"
          :class="{ 'speaking-border': peer.speaking }"
          @click="pinVideo(peer.id)"
        >
          <div
            class="text-caption text-weight-bold"
            style="
              position: absolute;
              top: 4px;
              left: 4px;
              z-index: 10;
              color: white;
              background: rgba(0, 0, 0, 0.6);
              padding: 2px 6px;
              border-radius: 4px;
            "
          >
            Remote
          </div>
          <video
            :ref="(el) => setVideoRef(el, peer.id)"
            autoplay
            playsinline
            style="width: 100%; height: 100%; object-fit: cover"
          ></video>
        </q-card>
      </div>
    </div>

    <div v-else class="row q-gutter-md videos-grid" style="flex: 1; overflow: hidden" :class="gridClass">
      <q-card flat class="video-card" :class="{ 'speaking-border': isLocalSpeaking }">
        <div class="video-header">
          <span class="text-weight-bold">You</span>
          <q-btn
            v-if="participantsCount > 1"
            flat
            round
            dense
            icon="push_pin"
            @click="pinVideo('local')"
            size="sm"
            color="white"
          >
            <q-tooltip>Pin</q-tooltip>
          </q-btn>
        </div>
        <video ref="localVideo" autoplay muted playsinline class="video-element"></video>
      </q-card>

      <q-card
        v-for="peer in remotePeers"
        :key="peer.id"
        flat
        class="video-card"
        :class="{ 'speaking-border': peer.speaking }"
      >
        <div class="video-header">
          <span class="text-weight-bold">Remote</span>
          <q-btn
            v-if="participantsCount > 1"
            flat
            round
            dense
            icon="push_pin"
            @click="pinVideo(peer.id)"
            size="sm"
            color="white"
          >
            <q-tooltip>Pin</q-tooltip>
          </q-btn>
        </div>
        <video :ref="(el) => setVideoRef(el, peer.id)" autoplay playsinline class="video-element"></video>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, nextTick, watch, inject, onUnmounted } from "vue";
import { createPeerConnection } from "src/utils/webrtc";
import { AudioAnalyzer } from "src/utils/AudioAnalyzer";
import { useQuasar } from "quasar";
import ThemeToggle from "src/components/ThemeToggle.vue";

const $q = useQuasar();
const socket = inject("socket");

const localVideo = ref(null);
const remotePeers = ref([]);
const isInRoom = ref(false);
const isMuted = ref(false);
const isCameraOff = ref(false);
const isLocalSpeaking = ref(false);
const pinnedPeerId = ref(null);

let localStream;
let localAnalyzer;
const peers = new Map();
const videoRefs = new Map();

const participantsCount = computed(() => remotePeers.value.length + 1);

const gridClass = computed(() => {
  const count = participantsCount.value;
  if (count <= 2) return "grid-2";
  if (count <= 4) return "grid-4";
  if (count <= 6) return "grid-6";
  return "grid-10";
});

function setVideoRef(el, peerId) {
  if (el) {
    videoRefs.set(peerId, el);
  }
}

function removePeer(peerId) {
  const peer = peers.get(peerId);
  if (peer) {
    peer.pc.close();
    if (peer.analyzer) peer.analyzer.stop();
    peers.delete(peerId);
  }
  remotePeers.value = remotePeers.value.filter((p) => p.id !== peerId);

  if (pinnedPeerId.value === peerId) {
    pinnedPeerId.value = null;
  }
}

function pinVideo(peerId) {
  pinnedPeerId.value = peerId;
}

function unpinVideo() {
  pinnedPeerId.value = null;
}

function toggleMute() {
  if (!localStream) return;
  const audioTracks = localStream.getAudioTracks();
  audioTracks.forEach((track) => {
    track.enabled = !track.enabled;
  });
  isMuted.value = audioTracks.length ? !audioTracks[0].enabled : false;
}

function toggleCamera() {
  if (!localStream) return;
  const videoTracks = localStream.getVideoTracks();
  videoTracks.forEach((track) => {
    track.enabled = !track.enabled;
  });
  isCameraOff.value = videoTracks.length ? !videoTracks[0].enabled : false;
}

async function createPeerConnectionForPeer(peerId, createOffer) {
  if (!localStream) return;
  const result = await createPeerConnection(socket, peerId, localStream);
  const pc = result.pc;

  pc.ontrack = (event) => {
    console.log("[INFO] Receiving track from:", peerId);
    const stream = event.streams[0];

    const existing = remotePeers.value.find((rp) => rp.id === peerId);
    if (!existing) {
      remotePeers.value.push({
        id: peerId,
        stream,
        speaking: false,
      });
    } else {
      existing.stream = stream;
    }

    peers.get(peerId).stream = stream;

    nextTick(() => {
      const videoEl = videoRefs.get(peerId);
      if (videoEl) {
        videoEl.srcObject = stream;
      }

      if (!peers.get(peerId).analyzer) {
        const analyzer = new AudioAnalyzer(stream, (isSpeaking) => {
          const p = remotePeers.value.find((rp) => rp.id === peerId);
          if (p) p.speaking = isSpeaking;
        });
        analyzer.start();
        peers.get(peerId).analyzer = analyzer;
      }
    });
  };

  peers.set(peerId, { pc, stream: null, analyzer: null });

  if (createOffer) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("offer", {
      offer,
      target: peerId,
    });
  }
}

async function startCall() {
  if (remotePeers.value.length >= 10) {
    $q.notify({
      type: "negative",
      message: "Room is full! Maximum 10 people.",
      position: "top",
    });
    return;
  }

  try {
    const result = await createPeerConnection(socket, null, null);
    localStream = result.stream;
    localVideo.value.srcObject = localStream;
    isInRoom.value = true;

    socket.on("peers", handlePeers);
    socket.on("peer-joined", handlePeerJoined);
    socket.on("peer-left", handlePeerLeft);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("candidate", handleCandidate);

    socket.emit("join", {
      roomId: "room-1",
    });

    localAnalyzer = new AudioAnalyzer(localStream, (isSpeaking) => {
      isLocalSpeaking.value = isSpeaking;
    });
    localAnalyzer.start();

    $q.notify({
      type: "positive",
      message: "Connected to room!",
      position: "top",
    });
  } catch (error) {
    console.error("[ERROR] Failed to start call:", error);
    $q.notify({
      type: "negative",
      message: "Error accessing camera/microphone",
      position: "top",
    });
  }
}

function endCall() {
  socket.off("peers", handlePeers);
  socket.off("peer-joined", handlePeerJoined);
  socket.off("peer-left", handlePeerLeft);
  socket.off("offer", handleOffer);
  socket.off("answer", handleAnswer);
  socket.off("candidate", handleCandidate);

  peers.forEach((peer) => {
    peer.pc.close();
    if (peer.analyzer) peer.analyzer.stop();
  });
  peers.clear();
  remotePeers.value = [];

  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
  }
  if (localAnalyzer) {
    localAnalyzer.stop();
    localAnalyzer = null;
  }

  if (localVideo.value) localVideo.value.srcObject = null;

  isInRoom.value = false;
  isMuted.value = false;
  isCameraOff.value = false;
  isLocalSpeaking.value = false;
  pinnedPeerId.value = null;
  videoRefs.clear();

  $q.notify({
    type: "info",
    message: "Disconnected from room",
    position: "top",
  });
}

async function handlePeers(data) {
  console.log("[INFO] Existing peers:", data.peers);
  for (const peer of data.peers) {
    await createPeerConnectionForPeer(peer.id, true);
  }
}

async function handlePeerJoined(data) {
  console.log("[INFO] New peer joined:", data.peerId);
  if (!peers.has(data.peerId)) {
    await createPeerConnectionForPeer(data.peerId, false);
  }
}

function handlePeerLeft(data) {
  console.log("[INFO] Peer left:", data.peerId);
  removePeer(data.peerId);
}

async function handleOffer(data) {
  const peer = peers.get(data.from);
  if (!peer) return;

  await peer.pc.setRemoteDescription(data.offer);
  const answer = await peer.pc.createAnswer();
  await peer.pc.setLocalDescription(answer);

  socket.emit("answer", {
    answer,
    target: data.from,
  });
}

async function handleAnswer(data) {
  const peer = peers.get(data.from);
  if (peer) {
    await peer.pc.setRemoteDescription(data.answer);
  }
}

async function handleCandidate(data) {
  const peer = peers.get(data.from);
  if (peer) {
    await peer.pc.addIceCandidate(data.candidate);
  }
}

watch(pinnedPeerId, async () => {
  await nextTick();

  if (localVideo.value && localStream) {
    localVideo.value.srcObject = localStream;
  }

  remotePeers.value.forEach((peer) => {
    const videoEl = videoRefs.get(peer.id);
    if (videoEl && peer.stream) {
      videoEl.srcObject = peer.stream;
    }
  });
});

onUnmounted(() => {
  if (isInRoom.value) {
    endCall();
  }
});
</script>

<style scoped lang="scss">
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes speakingPulse {
  0% {
    border-color: #22c55e;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    border-color: #4ade80;
    box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
  }
  100% {
    border-color: #22c55e;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.video-call-page {
  background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%) !important;
}

.body--dark .video-call-page {
  background: linear-gradient(135deg, #0f172a 0%, #1a2332 100%) !important;
}

.header-title {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: slideUp 0.6s ease-out;
}

.controls-card {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.6s ease-out 0.1s both;
}

.body--dark .controls-card {
  background: rgba(30, 41, 59, 0.9) !important;
  border: 1px solid rgba(100, 116, 139, 0.3) !important;
}

.join-btn {
  background: linear-gradient(135deg, #22c55e, #4ade80) !important;
  color: white !important;
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.body--dark .join-btn {
  background: linear-gradient(135deg, #16a34a, #22c55e) !important;
}

.hang-up-btn {
  background: linear-gradient(135deg, #ef4444, #f87171) !important;
  color: white !important;
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.body--dark .hang-up-btn {
  background: linear-gradient(135deg, #dc2626, #ef4444) !important;
}

.video-card {
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  background: #000 !important;
  border: 3px solid rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease-out;
  display: flex;
  flex-direction: column;
  min-height: 0;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}

.body--dark .video-card {
  background: #000 !important;
  border-color: rgba(100, 116, 139, 0.3) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
}

.speaking-border {
  border: 3px solid #22c55e !important;
  animation: speakingPulse 1.5s ease-in-out infinite;
}

.body--dark .speaking-border {
  border: 3px solid #22c55e !important;
}

.pinned-card {
  flex: 1;
  min-height: 0;
}

.video-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
}

.body--dark .video-header {
  background: rgba(0, 0, 0, 0.8);
  color: #cbd5e1;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fadeIn 0.4s ease-out;
}

.videos-grid {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.thumbnail-card {
  width: 140px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  border: 3px solid rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.body--dark .thumbnail-card {
  border-color: rgba(100, 116, 139, 0.3);
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  height: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.grid-6 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  height: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.grid-10 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  height: 100%;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.text-grey-7 {
  color: #475569 !important;
}

.body--dark .text-grey-7 {
  color: #cbd5e1 !important;
}
</style>
