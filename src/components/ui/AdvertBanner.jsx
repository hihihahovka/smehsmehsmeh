import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export default function AdvertBanner() {
  const level = useGameStore((s) => s.level);
  const yandexRubles = useGameStore((s) => s.yandexRubles);
  const addRubles = useGameStore((s) => s.addRubles);
  
  const [isVisible, setIsVisible] = useState(level <= 1);
  const [timeLeft, setTimeLeft] = useState(level === 0 ? 15 : 0);

  useEffect(() => {
    setIsVisible(level <= 1);
    setTimeLeft(level === 0 ? 15 : 0);
  }, [level]);

  useEffect(() => {
    if (timeLeft > 0 && isVisible) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isVisible]);

  const handleClose = () => {
    if (level === 0 && timeLeft > 0) return; // Forced wait
    setIsVisible(false);
  };

  const handleBribe = () => {
    if (yandexRubles >= 100) {
      addRubles(-100, 'Откуп от рекламы');
      setIsVisible(false);
    } else {
      alert('Не хватает Я-Баллы для взятки!');
    }
  };

  if (!isVisible || level >= 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
        className="card"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #ff0000, #ff00ff, #00ffff)',
          backgroundSize: '400% 400%',
          minHeight: level === 0 ? '300px' : '150px',
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden',
          border: '4px dashed yellow',
          animation: 'gradientBG 3s ease infinite, shake 0.5s infinite',
        }}
      >
        {/* Flashy text */}
        <motion.h2 
          animate={{ x: [-5, 5, -5] }} 
          transition={{ repeat: Infinity, duration: 0.1 }}
          style={{ textShadow: '0 0 10px white, 0 0 20px yellow', fontWeight: '900', fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}
        >
          МЕГАСКИДКА! МИНУС 500% НА ВСЁ!
        </motion.h2>

        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '4px' }}>
          Купи курс «Как стать мидлом за 3 дня», и мы вернем тебе 0 рублей!
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button 
            className="btn btn-primary"
            onClick={handleClose}
            disabled={level === 0 && timeLeft > 0}
            style={{ 
              background: (level === 0 && timeLeft > 0) ? '#555' : 'var(--accent)',
              opacity: (level === 0 && timeLeft > 0) ? 0.5 : 1,
              transform: (level === 0 && timeLeft > 0) ? 'none' : 'scale(1.1)',
            }}
          >
            {(level === 0 && timeLeft > 0) ? `Закрыть (${timeLeft} сек)` : 'Сбросить это дерьмо'}
          </button>

          {level === 0 && (
            <button 
              className="btn btn-secondary" 
              onClick={handleBribe}
              style={{ fontSize: '0.8rem', background: '#222', border: '1px solid var(--accent)' }}
            >
              Откупиться (100 Я-Баллы)
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
