import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

let landmarkerInstance = null;
let initPromise = null;

export const initHandLandmarker = async () => {
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm"
      );
      landmarkerInstance = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      console.log("MediaPipe Model Loaded Globally!");
      return landmarkerInstance;
    } catch (e) {
      console.error("Error loading MediaPipe:", e);
      initPromise = null;
      return null;
    }
  })();
  return initPromise;
};

export const getHandLandmarker = () => landmarkerInstance;
