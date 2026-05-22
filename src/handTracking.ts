import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { HandLandmarks, Point2D } from './types';

export type HandResultsCallback = (landmarks: HandLandmarks | null) => void;

export class HandTracker {
  private hands: Hands;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement;
  private callback: HandResultsCallback | null = null;
  private isRunning = false;
  private canvasWidth = 640;
  private canvasHeight = 480;

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;

    this.hands = new Hands({
      locateFile: (file) => {
        return `/mediapipe/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,  // Better accuracy model (less jitter)
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults((results) => this.onResults(results));
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
      // Initialize MediaPipe hands first (downloads WASM and models)
      await this.hands.initialize();

      this.isRunning = true;

      this.camera = new Camera(this.videoElement, {
        onFrame: async () => {
          if (!this.isRunning) return;
          await this.hands.send({ image: this.videoElement });
        },
        width: 640,
        height: 480,
        facingMode: 'user'
      });

      await this.camera.start();
    } catch (error) {
      console.error('Failed to start hand tracking:', error);
      this.isRunning = false;
      throw error;
    }
  }

  stop(): void {
    this.isRunning = false;

    if (this.camera) {
      this.camera.stop();
      this.camera = null;
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