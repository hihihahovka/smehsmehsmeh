import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import './PrayDetector.css';

export default function PrayDetector({ onSuccess, onCancel }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handLandmarkerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    async function initModel() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm"
      );
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      setIsLoaded(true);
    }
    initModel();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (handLandmarkerRef.current) handLandmarkerRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || success) return;

    let lastVideoTime = -1;

    const detect = async () => {
      if (success) return; // Stop if already succeeded

      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          const results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.landmarks && results.landmarks.length === 2) {
            // We have exactly two hands
            const hand1 = results.landmarks[0];
            const hand2 = results.landmarks[1];
            
            // Draw points
            ctx.fillStyle = "#ff3300";
            for(let pt of [...hand1, ...hand2]) {
               ctx.beginPath();
               ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 4, 0, 2 * Math.PI);
               ctx.fill();
            }

            // Check if hands are in prayer pose:
            // Compare wrists (point 0) distance and index finger tip (point 8) distance
            const wristDist = Math.hypot(hand1[0].x - hand2[0].x, hand1[0].y - hand2[0].y);
            const indexDist = Math.hypot(hand1[8].x - hand2[8].x, hand1[8].y - hand2[8].y);

            // If hands are close together
            if (wristDist < 0.15 && indexDist < 0.15) {
              setSuccess(true);
              
              // Play Hallelujah sound!
              try {
                const audio = new Audio('https://www.myinstants.com/media/sounds/hallelujah.mp3');
                audio.play();
              } catch(e) {}

              setTimeout(() => {
                onSuccess();
              }, 2000); // 2 second delay to show green glow
            }
          }
        }
      }
      if (!success) {
        animationRef.current = requestAnimationFrame(detect);
      }
    };

    detect();

  }, [isLoaded, success, onSuccess]);

  return (
    <div className="pray-detector-overlay">
      <div className={`pray-detector-modal ${success ? 'success' : ''}`}>
        <h3>Молитва Яндексу 🙏</h3>
        <p>Сложите ладони вместе перед камерой.</p>
        
        <div className="webcam-container">
          {!isLoaded && <div className="loading-vision">Грузим нейросеть... Пожалуйста, подождите.</div>}
          <Webcam
            ref={webcamRef}
            audio={false}
            className="video-feed"
            mirrored={true}
          />
          <canvas ref={canvasRef} className="landmarks-canvas" />
        </div>

        {success && <div className="blessed-msg">✨ ВЫ БЛАГОСЛОВЛЕНЫ! ✨</div>}

        {!success && (
          <button className="btn btn-secondary" onClick={onCancel} style={{ marginTop: '1rem', width: '100%' }}>
            Я атеист (Отмена)
          </button>
        )}
      </div>
    </div>
  );
}
