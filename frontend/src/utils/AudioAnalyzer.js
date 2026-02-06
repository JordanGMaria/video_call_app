export class AudioAnalyzer {
  constructor(stream, onLevelChange) {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.onLevelChange = onLevelChange;
    this.isActive = false;

    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);

    this.checkLevel();
  }

  checkLevel() {
    if (!this.isActive) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    const average = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
    const level = Math.min(100, (average / 128) * 100);
    const isSpeaking = level > 15;

    this.onLevelChange(isSpeaking, level);
    requestAnimationFrame(() => this.checkLevel());
  }

  start() {
    this.isActive = true;
    this.checkLevel();
  }

  stop() {
    this.isActive = false;

    if (this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}
