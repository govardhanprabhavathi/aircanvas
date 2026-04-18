# Air Canvas

A premium, browser-based gesture drawing experience where you draw shapes in the air using hand gestures via your webcam. Completed drawings inflate into soft, 3D balloon-like objects that float in a shared, infinite scene.

Designed with a sleek, minimalist white aesthetic and powered by robust machine learning for seamless interaction.

## Features

- **Infinite Canvas** - Pan and zoom endlessly to build massive scenes of floating objects.
- **Gesture-Based Drawing** - Point your index finger to draw 2D lines in the air.
- **3D Balloon Inflation** - Hold an open palm to instantly transform your 2D lines into puffy, floating 3D objects.
- **Interactive Physics** - Grab, move, rotate, and poke your balloon creations.
- **Real-Time Hand Tracking** - Powered by Google's MediaPipe for responsive, low-latency hand detection.
- **Draggable Camera Preview** - Move the camera preview anywhere on the screen.
- **Minimalist Aesthetics** - A clean, premium white interface featuring beautiful calligraphy typography and sleek black track lines.

## How It Works

1. **Draw**: Extend your index finger (keep other fingers curled) to draw.
2. **Inflate**: Hold an open palm for 0.5 seconds to close and inflate your drawing into 3D.
3. **Interact**: Pinch to grab and rotate objects, or poke with your finger to squish them.
4. **Pan**: Hold up two fingers (index + middle) to seamlessly drag the infinite canvas.
5. **Zoom**: Hold up three fingers (index, middle, ring) and move your hand up to zoom in, and down to zoom out.
6. **Clear**: Click the "Clear All" button or swipe to remove objects.

## Gesture Controls

| Gesture | Action |
|---------|--------|
| **Point** (Index finger) | Draw a line in the air |
| **Open Palm** (Hold) | Close the current shape and inflate to 3D |
| **Pinch** (Thumb + Index) | Grab, move, and rotate 3D objects |
| **Two Fingers** (Index + Middle) | Pan and drag the infinite canvas |
| **Three Fingers** (Index, Middle, Ring) | Move hand UP to zoom IN, DOWN to zoom OUT |
| **Swipe** | Remove an individual object |

## Installation

```bash
# Clone the repository
git clone https://github.com/Govardhan/AirCanvas.git
cd AirCanvas

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser to the local URL shown in the terminal (usually `http://localhost:5173`).

## Requirements

- Modern browser with WebGL support (Chrome, Firefox, Edge, Safari)
- Webcam access
- Good lighting for accurate hand tracking
- HTTPS connection (required for camera access when hosted online)

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D rendering and scene management
- **MediaPipe Hands** - Real-time computer vision hand tracking

## Tips for Best Results

- Use good lighting so your hand is clearly visible to the webcam.
- Keep your hand about 1-2 feet from the camera.
- Point with *just* your index finger extended for drawing to avoid gesture overlap.
- Draw slowly and steadily for smoother lines.

## Credits

Designed by [Govardhan](#)

### Open Source Libraries

This project is built with these amazing open source libraries:

| Library | Description | License |
|---------|-------------|---------|
| [Three.js](https://threejs.org/) | 3D graphics library for WebGL rendering | MIT |
| [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html) | Google's real-time hand tracking solution | Apache 2.0 |
| [Vite](https://vitejs.dev/) | Next-generation frontend build tool | MIT |
| [TypeScript](https://www.typescriptlang.org/) | Typed superset of JavaScript | Apache 2.0 |

## License

MIT
