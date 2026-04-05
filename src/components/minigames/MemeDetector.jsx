import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useRideStore } from '../../store/rideStore';

export default function MemeDetector() {
  const applyMemeDiscount = useRideStore((s) => s.applyMemeDiscount);
  const memeDiscount = useRideStore((s) => s.memeDiscount);
  
  const [isActive, setIsActive] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [statusText, setStatusText] = useState('Покажите жест "67"! (две руки вверх/вниз в разные стороны)');
  const [showVideoError, setShowVideoError] = useState(false);
  
  const videoRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    let handLandmarker;
    let stream;
    let lastVideoTime = -1;
    const historyL = [];
    const historyR = [];
    let isActiveRef = isActive;

    const initializeMediaPipe = async () => {
      try {
        setIsInitializing(true);
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        
        if (isActiveRef && videoRef.current) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          videoRef.current.play(); // force play
          videoRef.current.onloadeddata = () => {
             predictWebcam();
          };
        }
        setIsInitializing(false);
      } catch (err) {
        console.error("Camera access failed", err);
        setShowVideoError(true);
        setIsInitializing(false);
      }
    };

    const predictWebcam = async () => {
      if (!handLandmarker || !videoRef.current || !isActiveRef) return;
      
      let startTimeMs = performance.now();
      if (lastVideoTime !== videoRef.current.currentTime) {
        lastVideoTime = videoRef.current.currentTime;
        let results;
        try {
            results = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
        } catch(e) {
            // Error processing frame
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }
        
        if (results && results.landmarks && results.landmarks.length >= 2) {
          const wrist1 = results.landmarks[0][0]; // landmark 0 is wrist
          const wrist2 = results.landmarks[1][0];
          
          historyL.push(wrist1.y);
          historyR.push(wrist2.y);
          
          if (historyL.length > 20) historyL.shift();
          if (historyR.length > 20) historyR.shift();
          
          if (historyL.length >= 10 && historyR.length >= 10) {
            const dyL = historyL[historyL.length - 1] - historyL[historyL.length - 10];
            const dyR = historyR[historyR.length - 1] - historyR[historyR.length - 10];
            
            // Y values are 0 to 1, where 0 is top of screen and 1 is bottom.
            // If they move in opposite directions significantly:
            if (dyL * dyR < 0 && Math.abs(dyL) > 0.15 && Math.abs(dyR) > 0.15) {
              applyMemeDiscount(67);
              setIsActive(false); // Disable camera when done
              return; // Stop loop
            }
          }
        } else {
            // Reset history if hands lost
            historyL.length = 0;
            historyR.length = 0;
        }
      }
      
      if (isActiveRef) {
          requestRef.current = requestAnimationFrame(predictWebcam);
      }
    };

    if (isActive) {
      isActiveRef = true;
      initializeMediaPipe();
    } else {
      isActiveRef = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }

    return () => {
      isActiveRef = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, applyMemeDiscount]);

  if (memeDiscount > 0) {
    return (
      <div className="card" style={{ marginTop: '1rem', background: '#3ac267', color: 'black', textAlign: 'center' }}>
        <h3>Мем 67 успешно найден!</h3>
        <p style={{ fontWeight: 'bold' }}>Скидка применена: -{memeDiscount} руб.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '1rem', textAlign: 'center' }}>
      {!isActive ? (
        <>
          <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Скрытая скидка</p>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsActive(true)}
            style={{ width: '100%', border: '2px dashed var(--accent)' }}
          >
            Потерять честь и достоинство
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <h4>{statusText}</h4>
          {isInitializing ? (
            <p>Загрузка нейросети и камеры...</p>
          ) : showVideoError ? (
            <p style={{ color: 'red' }}>Ошибка доступа к камере.</p>
          ) : null}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px', height: '225px', backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden' }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <button 
            className="btn" 
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid gray' }}
            onClick={() => setIsActive(false)}
          >
            Отмена
          </button>
        </div>
      )}
    </div>
  );
}
