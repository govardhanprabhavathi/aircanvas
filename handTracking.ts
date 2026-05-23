import { Hands, Results } from '@mediapipe/hands';
import { HandLandmarks, Point2D } from './types';

export type HandResultsCallback = (landmarks: HandLandmarks | null) => void;

export class HandTracker {
  private hands: Hands;
  private videoElement: HTMLVideoElement;
  private callback: HandResultsCallback | null = null;
  private isRunning = false;
  private animationId: number | null = null;
  private canvasWidth = 640;
  private canvasHeight = 480;
  private initPromise: Promise<void> | null = null;

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;

    this.hands = new Hands({
      locateFile: (file) => {
        return `/mediapipe/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,  // Use Lite model for faster download and initialization
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults((results) => this.onResults(results));

    // Pre-initialize MediaPipe hands in background immediately to save startup time
    this.initPromise = this.hands.initialize().catch(err => {
      console.error('Failed to pre-initialize MediaPipe Hands:', err);
    });
  }

  setCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  private onResults(results: Results): void {
    if (!this.callback) return;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Use the first detected hand (could enhance to prefer right hand)
      const landmarks = results.multiHandLandmarks[0];
      const worldLandmarks = results.multiHandWorldLandmarks?.[0];

      // Convert normalized coordinates to canvas coordinates
      const convertedLandmarks: Point2D[] = landmarks.map((lm) => ({
        x: (1 - lm.x) * this.canvasWidth,  // Mirror horizontally
        y: lm.y * this.canvasHeight
      }));

      const convertedWorldLandmarks = worldLandmarks?.map((lm) => ({
        x: -lm.x,  // Mirror
        y: -lm.y,
        z: lm.z
      }));

      this.callback({
        landmarks: convertedLandmarks,
        worldLandmarks: convertedWorldLandmarks
      });
    } else {
      this.callback(null);
    }
  }

  async start(callback: HandResultsCallback): Promise<void> {
    this.callback = callback;

    if (this.isRunning) return;

    try {
      // Request camera access - relaxed constraints for better device compatibility
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user'
        }
      });

      this.videoElement.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        if (this.videoElement.readyState >= 1) {
          resolve();
        } else {
          this.videoElement.onloadedmetadata = () => {
            resolve();
          };
        }
      });
      
      // Start playback without blocking on the promise
      this.videoElement.play().catch(e => console.warn('Video play warning:', e));

      // Wait for MediaPipe to finish initializing if it hasn't already
      if (!this.initPromise) {
        this.initPromise = this.hands.initialize();
      }
      await this.initPromise;

      this.isRunning = true;

      // Use direct requestAnimationFrame for lower latency
      const processFrame = async () => {
        if (!this.isRunning) return;

        if (this.videoElement.readyState >= 2) {
          await this.hands.send({ image: this.videoElement });
        }

        this.animationId = requestAnimationFrame(processFrame);
      };

      processFrame();
    } catch (error) {
      console.error('Failed to start hand tracking:', error);
      throw error;
    }
  }

  stop(): void {
    this.isRunning = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    const stream = this.videoElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  isActive(): boolean {
    return this.isRunning;
  }
}