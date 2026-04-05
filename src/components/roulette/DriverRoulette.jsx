import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRideStore } from '../../store/rideStore';

/*
 * =============================================
 *  РУЛЕТКА ВОДИТЕЛЕЙ (CS:GO стиль)
 *  Ответственный: Участник 2
 * =============================================
 */

const DRIVER_DB = [
  { name: 'Олег (Молчаливый)', rarity: 'common', speed: 5, silence: 10, multiplier: 1.0, color: '#b0c3d9' },
  { name: 'Ашот на Приоре', rarity: 'common', speed: 10, silence: 2, multiplier: 0.9, color: '#b0c3d9' },
  { name: 'Дед Михалыч', rarity: 'rare', speed: 3, silence: 1, multiplier: 0.8, color: '#5e98d9' },
  { name: 'Мамкин Гощик', rarity: 'rare', speed: 10, silence: 1, multiplier: 1.2, color: '#5e98d9' },
  { name: 'Бизнесмен (для души)', rarity: 'epic', speed: 6, silence: 8, multiplier: 1.5, color: '#d32ce6' },
  { name: 'ГТА-водитель', rarity: 'legendary', speed: 10, silence: 0, multiplier: 2.0, color: '#eb4b4b' },
  { name: 'Призрак', rarity: 'mythic', speed: 100, silence: 10, multiplier: 3.0, color: '#e4ae39' },
];

function generateStrip() {
  const strip = [];
  for (let i = 0; i < 60; i++) {
    // Weighted random
    const r = Math.random();
    let tier = 'common';
    if (r > 0.6) tier = 'rare';
    if (r > 0.85) tier = 'epic';
    if (r > 0.95) tier = 'legendary';
    if (r > 0.99) tier = 'mythic';
    
    const candidates = DRIVER_DB.filter(d => d.rarity === tier);
    const driver = candidates[Math.floor(Math.random() * candidates.length)];
    strip.push({ ...driver, id: `${i}-${Date.now()}` });
  }
  return strip;
}

export default function DriverRoulette({ onResult }) {
  const [strip, setStrip] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState(null);
  
  useEffect(() => {
    setStrip(generateStrip());
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setFinished(false);

    // We will land around index 45
    const targetIndex = 40 + Math.floor(Math.random() * 5);
    const targetDriver = strip[targetIndex];

    setWinner(targetDriver);

    // Save timeout to finish
    setTimeout(() => {
      setFinished(true);
      onResult?.(targetDriver);
      // Play web audio if specific driver here later
    }, 5500);
  };

  if (finished) {
    return (
      <div className="card" style={{ textAlign: 'center', borderColor: winner?.color, boxShadow: `0 0 20px ${winner?.color}` }}>
        <h3 style={{ color: winner?.color }}>Выпал водитель: {winner?.name}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Редкость: {winner?.rarity}</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Таксист спавнится на карте...</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
      <p style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold' }}>Генерация водителя...</p>
      
      <div style={{ position: 'relative', width: '100%', height: '120px', background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Selector tick marker */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: '#fff', zIndex: 10, transform: 'translateX(-50%)' }} />
        
        {strip.length > 0 && (
          <motion.div
            style={{ display: 'flex', height: '100%' }}
            animate={spinning ? { x: - (42.5 * 100) + 'px' } : { x: 0 }} // approx calculation
            transition={{ type: "tween", ease: [0.1, 0.7, 0.1, 1], duration: 5 }}
          >
            {strip.map((driver, i) => (
              <div 
                key={driver.id} 
                style={{ 
                  minWidth: '100px', 
                  height: '100%', 
                  background: '#222', 
                  border: `2px solid ${driver.color}`, 
                  marginRight: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexDirection: 'column',
                  padding: '0.5rem'
                }}
              >
                <div style={{ fontSize: '0.7rem', color: '#ccc', textAlign: 'center' }}>{driver.name}</div>
                <div style={{ fontSize: '0.6rem', color: driver.color, marginTop: '0.5rem' }}>{driver.rarity}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {!spinning && (
        <button className="btn btn-primary" onClick={spin} style={{ width: '100%', marginTop: '1rem' }}>
          Крутить рулетку водителей
        </button>
      )}
    </div>
  );
}
