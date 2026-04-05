import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function D20Roll({ onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);

    // Simulate 3 seconds of rolling
    setTimeout(() => {
      const finalRoll = Math.floor(Math.random() * 20) + 1;
      setResult(finalRoll);
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
        {rolling ? 'Бросаем кубики святого рандома...' : (result ? `Рандом выбрал: ${result}` : 'Бросить d20 на удачу (Обязательно)')}
      </button>

      <AnimatePresence>
        {rolling && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 1, scale: 1.5, rotate: 720 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "tween", duration: 3, ease: "easeInOut" }}
            style={{
              marginTop: '2rem',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon shape simulating 3D outline
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '900',
              color: 'white',
              boxShadow: '0 0 20px var(--accent)'
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
            >
              🎲
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {result === 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#ff3333', color: 'white', padding: '1rem', width: '100%', textAlign: 'center', marginTop: '1rem', borderRadius: '4px' }}
        >
          <h2 style={{ margin: 0 }}>КРИТИЧЕСКИЙ ПРОВАЛ! (Выпало 1)</h2>
          <p style={{ margin: 0, marginTop: '0.5rem' }}>Езжай на автобусе нищеброд.</p>
        </motion.div>
      )}

      {result !== null && result > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: 'var(--accent-secondary)', padding: '1rem', textAlign: 'center' }}
        >
          <p>Бросок успешен. Боги такси смилостивились.</p>
        </motion.div>
      )}
    </div>
  );
}
