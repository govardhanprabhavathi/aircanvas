# 🎈 Air Canvas

Air Canvas is a premium, interactive browser-based 3D drawing and gesture-control experience. By leveraging real-time computer vision and 3D physics rendering, users can draw shapes in the air using their webcam. Once closed, these drawings dynamically inflate into soft, glossy, 3D balloon-like objects that float inside a shared, infinite collaborative environment.

Built with a clean, minimalist aesthetic, Air Canvas supports seamless hand tracking, interactive object physics, and peer-to-peer multiplayer co-drawing.

---

## ✨ Core Features

*   **🎨 Infinite Canvas & Pan/Zoom**: Endlessly pan and zoom around the canvas to construct massive layouts of floating objects.
*   **🤝 Real-Time Multiplayer Co-Drawing**: Host or join a shared collaborative session using instant 6-character room codes powered by **PeerJS** for zero-latency peer-to-peer interaction.
*   **🤖 Local Hand Gesture Recognition**: Powered by **Google MediaPipe Hands**, all hand tracking is executed locally in-browser on the CPU/GPU using WebAssembly (WASM). No camera feed is ever uploaded to a server, ensuring absolute privacy.
*   **✨ Realistic Balloon Inflation & Physics**:
    *   2D drawn strokes are simplified and smoothed with Catmull-Rom splines, extruded, and inflated using custom vertex deformation.
    *   Floating objects exhibit a gentle, realistic bobbing and drifting motion.
    *   Balloons feature soft-body collision avoidance, pushing away from one another when they float too close or are grabbed.
*   **💥 Multi-Touch & Gesture Controls**: Interact naturally via pinching to grab, dragging to rotate, poking to squish (triggering bouncy jiggle animations via **GSAP**), and popping to delete.
*   **🖥️ Draggable & Expandable Camera Preview**: Reposition the camera overlay anywhere on screen by dragging, or double-click to reset it. Expand the preview with the toggle button to inspect tracking details.
*   **🖱️ Mouse & Touch Fallback**: No webcam? Switch seamlessly to **Mouse Draw Mode** to draw, pan, zoom, and interact with objects using mouse clicks, wheel scroll, or touch gestures.

---

## 🖐️ Gesture Control Schema

Air Canvas maps intuitive hand poses to actions with precise tracking thresholds:

| Hand Gesture | Visual Icon | Action Description |
| :--- | :---: | :--- |
| **Point** (Index extended) | ☝️ | Draws a continuous line in the air. Poke existing balloons to squish/jiggle them. |
| **Open Palm** (All open, hold) | 🖐️ / ✋ | Hold for **0.5s** to close your active drawing and inflate it into a 3D balloon. |
| **Pinch** (Thumb + Index) | 🤏 | Grab, drag, rotate, and reposition floating balloons in 3D space. |
| **Two Fingers** (Index + Middle) | ✌️ | Drag your hand to pan across the infinite canvas and move the 3D camera. |
| **Three Fingers** (Index + Middle + Ring) | 🖐️ | Move your hand **UP** to zoom in, and **DOWN** to zoom out. |
| **Four Fingers** (All except thumb) | ✋ | Hover your palm center over a balloon to delete (pop) it. |

---

## 🛠️ Tech Stack

Air Canvas is engineered as a modern frontend application utilizing:

*   **TypeScript**: Type-safe, modular code structure.
*   **Vite**: Extremely fast hot-module replacement (HMR) and production bundling.
*   **Three.js**: Renders the 3D canvas, perspective camera, lighting, shadows, and materials.
*   **Google MediaPipe Hands**: Real-time hand tracking and 21-landmark coordinate detection.
*   **GSAP (GreenSock)**: Smooth, elastic physics animations for balloon inflation, jiggling, settling, and popping.
*   **PeerJS (WebRTC)**: Peer-to-peer data channels for multiplayer room networking.

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16.0.0 or higher) installed.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Govardhan/AirCanvas.git
cd AirCanvas

# Install dependencies
npm install
```

### 3. Running Development Server
Start the local development server:
```bash
npm run dev
```
Once started, open `http://localhost:5173` in your browser.

### 4. Build and Production Preview
To compile the TypeScript code and package assets into a highly optimized production bundle:
```bash
# Build the production application
npm run build

# Preview the production build locally
npm run preview
```

---

## 💡 Tips for the Best Experience

1.  **Webcam & Lighting**: Maintain clean, front-facing lighting so MediaPipe can distinguish your hand skeleton from the background.
2.  **Distance**: Keep your hand approximately **1.5 to 3 feet** away from your webcam.
3.  **Clean Gestures**: Try to make gestures clear and deliberate. For example, curl other fingers completely when pointing to draw to avoid overlapping with pan/zoom gestures.
4.  **HTTPS Requirement**: When deploying to production or staging, standard browsers require an **HTTPS secure connection** to access user webcams.

---

## 🔒 Privacy First
All computer vision computations occur locally on your machine. Your webcam feed is never sent over the internet or used for data collection. 

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
