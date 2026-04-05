import { useState, useEffect, useRef } from 'react';

export default function BalanceGame({ onComplete }) {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [inZoneTime, setInZoneTime] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  
  const containerRef = useRef(null);
  const targetTime = 5; // Удержать 5 секунд

  // Для десктопа - движение мышью
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Переводим в координаты от -1 до 1 относительно центра
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setPosX(x * 100);
      setPosY(y * 100);
    }
  };

  useEffect(() => {
    // Поддержка гироскопа/акселерометра
    const handleOrientation = (e) => {
      if (e.beta !== null && e.gamma !== null) {
        // gamma: left to right (-90 to 90)
        // beta: front to back (-180 to 180)
        let x = e.gamma * 2; 
        let y = (e.beta - 45) * 2; // offset for natural holding angle
        
        // ограничение
        x = Math.max(-100, Math.min(100, x));
        y = Math.max(-100, Math.min(100, y));
        
        setPosX(x);
        setPosY(y);
      } else {
        setIsSupported(false);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useEffect(() => {
    // Проверка, находится ли шарик в центре (зона ~20px)
    const dist = Math.sqrt(posX * posX + posY * posY);
    let timer;
    
    if (dist < 20) {
      timer = setInterval(() => {
        setInZoneTime(prev => {
          if (prev + 0.1 >= targetTime) {
            onComplete?.();
            return targetTime;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      // Быстро сбрасываем прогресс, если вышел за пределы
      timer = setInterval(() => {
        setInZoneTime(prev => Math.max(0, prev - 0.2));
      }, 100);
    }

    return () => clearInterval(timer);
  }, [posX, posY, onComplete]);

  return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Алкотестер (Похмелье)</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Ты поймал "Отмену". Мир шатается, удержи фокус в центре {targetTime} секунд, чтобы протрезветь!
        {!isSupported && " (Двигай курсором)"}
      </p>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          width: '200px',
          height: '200px',
          background: '#222',
          margin: '0 auto',
          borderRadius: '50%',
          position: 'relative',
          border: '4px solid #555',
          overflow: 'hidden'
        }}
      >
        {/* Таргет зона */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px dashed var(--accent)',
          background: 'rgba(0, 255, 0, 0.1)'
        }} />

        {/* Шарик */}
        <div style={{
          position: 'absolute',
          top: `calc(50% + ${posY}%)`,
          left: `calc(50% + ${posX}%)`,
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--text-primary)',
          boxShadow: '0 0 10px #fff',
          transition: 'top 0.1s, left 0.1s'
        }} />
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <p>Прогресс: {(inZoneTime).toFixed(1)} / {targetTime} сек</p>
        <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden', marginTop: '0.5rem' }}>
          <div style={{ width: `${(inZoneTime / targetTime) * 100}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.1s' }} />
        </div>
      </div>
    </div>
  );
}
