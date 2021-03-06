/**
 *  Use Web Audio API to generate tones for
 *  DTMF beeps in reaction to keypad press, a ring and a busy tone.
*/

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToneService {

  public freq1 = 0;
  public freq2 = 0;
  public ringfreq1 = 440;
  public ringfreq2 = 480;
  public busyfreq1 = 480;
  public busyfreq2 = 620;
  private AudioContext: AudioContext;
  private status = 0;
  private osc1;
  private osc2;
  private gainNode;
  private LFOSource;
  private LFOBuffer;
  private dtmfFrequencies = {
    '1': {f1: 697, f2: 1209},
    '2': {f1: 697, f2: 1336},
    '3': {f1: 697, f2: 1477},
    '4': {f1: 770, f2: 1209},
    '5': {f1: 770, f2: 1336},
    '6': {f1: 770, f2: 1477},
    '7': {f1: 852, f2: 1209},
    '8': {f1: 852, f2: 1336},
    '9': {f1: 852, f2: 1477},
    '*': {f1: 941, f2: 1209},
    '0': {f1: 941, f2: 1336},
    '#': {f1: 941, f2: 1477}
  };

  constructor() {
      this.AudioContext = new AudioContext();
      this.status = 0;
      this.setup();
  }

  setup(t = '') {
    this.osc1 = this.AudioContext.createOscillator();
    this.osc2 = this.AudioContext.createOscillator();

    if (t === 'busy') {
      this.osc1.frequency.value = this.busyfreq1;
      this.osc2.frequency.value = this.busyfreq2;
    } else if (t === 'ring') {
      this.osc1.frequency.value = this.ringfreq1;
      this.osc2.frequency.value = this.ringfreq2;
    } else {
      this.osc1.frequency.value = this.freq1;
      this.osc2.frequency.value = this.freq2;
    }

    this.gainNode = this.AudioContext.createGain();
    this.gainNode.gain.value = 0.25;

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.AudioContext.destination);
  }

  stop() {
    if (this.status === 1) {
      this.osc1.stop(0);
      this.osc2.stop(0);
      this.status = 0;
    }
  }

  genericStart() {
    if (this.status === 0) {
      this.osc1.start(0);
      this.osc2.start(0);
      this.status = 1;
    }
  }

  start(keyPressed) {
    if (this.status === 0) {
        const frequencyPair = this.dtmfFrequencies[keyPressed];
        this.freq1 = frequencyPair.f1;
        this.freq2 = frequencyPair.f2;
        this.setup();
        this.gainNode.gain.value = 0.05;
        this.genericStart();

    } else {
        this.stop();
    }

    setTimeout(() => this.stop(), 100);
  }


/** Create a 6 audio second buffer with values of .025 for the
 *  first two seconds. This is used as a LFO to modulate gain on
 *  the Ringer. (Standard N. America ring)
 */
  createRingerLFO() {
    const channels = 1;
    const sampleRate = this.AudioContext.sampleRate;
    const frameCount = sampleRate * 6;
    const arrayBuffer = this.AudioContext.createBuffer(channels, frameCount, sampleRate);
    const bufferData = arrayBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        if (i / sampleRate > 0 && i / sampleRate < 2.0) {
            bufferData[i] = 0.25;
        }
    }
    this.LFOBuffer = arrayBuffer;
  }

  createBusyLFO() {
    const channels = 1;
    const sampleRate = this.AudioContext.sampleRate;
    const frameCount = sampleRate;
    const arrayBuffer = this.AudioContext.createBuffer(channels, frameCount, sampleRate);
    const bufferData = arrayBuffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        if ((i / sampleRate > 0 && i / sampleRate < 0.5)) {
            bufferData[i] = 0.25;
        }
    }
    this.LFOBuffer = arrayBuffer;
  }

  startRinging() {
    if (this.status === 0) {
        this.setup('ring');
        this.genericStart();
        this.createRingerLFO();
        this.gainNode.gain.value = 0;
        this.LFOSource = this.AudioContext.createBufferSource();
        this.LFOSource.buffer = this.LFOBuffer;
        this.LFOSource.loop = true;
        this.LFOSource.start(0);
        this.LFOSource.connect(this.gainNode.gain);
        this.status = 1;
    }
  }

  stopRinging() {
      if ( typeof this.LFOSource !== 'undefined' ) {
        this.LFOSource.stop();
      }
      this.stop();
      this.status = 0;
  }

  startBusyTone() {
    if (this.status === 0) {
        this.setup('busy');
        this.genericStart();
        this.createBusyLFO();
        this.gainNode.gain.value = 0;
        this.LFOSource = this.AudioContext.createBufferSource();
        this.LFOSource.buffer = this.LFOBuffer;
        this.LFOSource.loop = true;
        this.LFOSource.start(0);
        this.LFOSource.connect(this.gainNode.gain);
        this.status = 1;
    }
  }

  stopBusyTone() {
      if ( typeof this.LFOSource !== 'undefined' ) {
        this.LFOSource.stop();
      }
      this.stop();
      this.status = 0;
  }

  stopAll() {
    this.stopBusyTone();
    this.stopRinging();
  }
}
