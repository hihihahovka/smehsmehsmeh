import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function D20Roll({ onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [displayNum, setDisplayNum] = useState(20);

  useEffect(() => {
    let interval;
    if (rolling) {
      interval = setInterval(() => {
        setDisplayNum(Math.floor(Math.random() * 20) + 1);
      }, 50); // fast number switching
    }
    return () => clearInterval(interval);
  }, [rolling]);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);

    // Simulate 3 seconds of rolling
    setTimeout(() => {
      const finalRoll = Math.floor(Math.random() * 20) + 1;
      setResult(finalRoll);
      setDisplayNum(finalRoll); // lock the number
      setRolling(false);
      onRollComplete?.(finalRoll);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
      <button 
        className="btn btn-secondary" 
        onClick={handleRoll} 
        disabled={rolling || result !== null}
        style={{ width: '100%', padding: '1rem', background: '#333', border: '2px solid var(--accent)' }}
      >
        {rolling ? 'Бросаем кубики святого рандома...' : (result ? `Результат d20: ${result}` : 'Бросить d20 на удачу (Обязательно)')}
      </button>

      <AnimatePresence>
        {(rolling || result !== null) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ 
              opacity: 1, 
              scale: result ? 1.2 : 1.5, 
              rotate: rolling ? 720 : 0 
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "tween", duration: rolling ? 3 : 0.5, ease: "easeInOut" }}
            style={{
              marginTop: '2rem',
              width: '80px',
              height: '80px',
              background: result === 1 
                ? 'linear-gradient(135deg, #ff0000, #990000)'
                : 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon shape simulating 3D outline
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '900',
              color: 'white',
              boxShadow: result === 1 ? '0 0 20px #ff0000' : '0 0 20px var(--accent)',
              textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            <motion.span
              animate={rolling ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
              transition={{ repeat: rolling ? Infinity : 0, duration: 0.1 }}
            >
              {displayNum}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* We removed the discount UI from here because we will manage it in Order.jsx! The cube should just be the cube. */}
    </div>
  );
}
