import { Hands, Results } from '@mediapipe/hands';
import { HandLandmarks, Point2D } from './types';

export type HandResultsCallback = (landmarks: HandLandmarks | null) => void;

export class HandTracker {
  private hands!: Hands;
  private videoElement: HTMLVideoElement;
  private callback: HandResultsCallback | null = null;
  private isRunning = false;
  private animationId: number | null = null;
  private canvasWidth = 640;
  private canvasHeight = 480;
  private initPromise: Promise<void> | null = null;

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;

    // Run initialization in a promise chain to prevent any synchronous exceptions from crashing the constructor
    this.initPromise = Promise.resolve().then(async () => {
      try {
        await this.initHands(false);
      } catch (err) {
        console.warn('Local MediaPipe files failed to load, trying CDN...', err);
        await this.initHands(true);
      }
    }).catch(err => {
      console.error('All MediaPipe initialization attempts failed:', err);
      throw err;
    });
  }

  private initHands(useCDN: boolean): Promise<void> {
    const basePath = useCDN 
      ? 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
      : '/mediapipe';

    this.hands = new Hands({
      locateFile: (file) => {
        return `${basePath}/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,  // Use Lite model for faster download and initialization
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults((results) => this.onResults(results));
    return this.hands.initialize();
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
      // Request camera access - ideal constraint is user-facing, fallback to raw video if it fails to prevent OverconstrainedError
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'user' }
          }
        });
      } catch (err) {
        console.warn('getUserMedia with facingMode constraint failed, falling back to raw video...', err);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

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