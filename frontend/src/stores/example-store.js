import { defineStore, acceptHMRUpdate } from "pinia";

// Store de exemplo - você pode criar stores específicas para videochamada
// Por exemplo: useCallStore, useUserStore, etc.

export const useCounterStore = defineStore("counter", {
  state: () => ({
    counter: 0,
  }),

  getters: {
    doubleCount: (state) => state.counter * 2,
  },

  actions: {
    increment() {
      this.counter++;
    },
  },
});

// Exemplo de store para videochamada (comentado)
/*
export const useCallStore = defineStore('call', {
  state: () => ({
    isInCall: false,
    localStream: null,
    remoteStream: null,
    roomId: null,
    participants: [],
  }),

  getters: {
    participantCount: (state) => state.participants.length,
  },

  actions: {
    joinCall(roomId) {
      this.roomId = roomId;
      this.isInCall = true;
    },
    
    leaveCall() {
      this.isInCall = false;
      this.roomId = null;
      this.participants = [];
    },
    
    setLocalStream(stream) {
      this.localStream = stream;
    },
    
    setRemoteStream(stream) {
      this.remoteStream = stream;
    },
    
    addParticipant(participant) {
      this.participants.push(participant);
    },
    
    removeParticipant(participantId) {
      this.participants = this.participants.filter(p => p.id !== participantId);
    },
  },
});
*/

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot));
}
