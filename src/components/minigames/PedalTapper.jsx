import { useState, useEffect } from 'react';

export default function PedalTapper({ onTap, tapCount }) {
  const [pulse, setPulse] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [totalTaps, setTotalTaps] = useState(0);
  const [goodTaps, setGoodTaps] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 200); // Pulse window
    }, 600); // ~100 BPM

    return () => clearInterval(interval);
  }, []);

  const handleTap = () => {
    setTotalTaps(t => t + 1);
    if (pulse) {
      setGoodTaps(g => g + 1);
      onTap();
    }
  };

  useEffect(() => {
    if (totalTaps > 0) {
      setAccuracy(Math.round((goodTaps / totalTaps) * 100));
    }
  }, [totalTaps, goodTaps]);

  return (
    <div className="card" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem' }}>
      <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Тапай хомяка в ритм, чтобы ехать быстрее!
      </p>

      <div 
        onClick={handleTap}
        style={{
          width: '120px',
          height: '120px',
          margin: '0 auto',
          borderRadius: '50%',
          background: pulse ? 'var(--accent)' : '#444',
          transition: 'background 0.1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: pulse ? '0 0 20px var(--accent)' : 'none',
          transform: pulse ? 'scale(1.1)' : 'scale(1)',
          overflow: 'hidden',
          border: '4px solid #fff'
        }}
      >
        <img 
          src="/minigames/hamster.png" 
          alt="Hamster" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Счёт: {tapCount}
      </p>

      <p style={{ fontSize: '0.9rem', color: accuracy > 50 ? '#00ff00' : '#ff4444' }}>
        Точность: {accuracy}% {accuracy < 50 && '(Водитель делает крюк!)'}
      </p>
    </div>
  );
}
