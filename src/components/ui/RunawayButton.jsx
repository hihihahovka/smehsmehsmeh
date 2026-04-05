import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RunawayButton({ level, onClick, children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const calculateTarget = useCallback(() => {
    if (level >= 2) return; // stays still
    
    // Attempt bounds keeping, though it's relative container so it's a bit wacky which is perfect for this app
    const moveX = (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 100);
    const moveY = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 80);

    setPos(prev => ({
      x: Math.max(-200, Math.min(200, prev.x + moveX)),
      y: Math.max(-200, Math.min(200, prev.y + moveY))
    }));
  }, [level]);

  const handleInteraction = () => {
    if (level === 0) calculateTarget();
    // On level 1, it maybe stops after a few tries? Or we just have it always runaway like 80% times.
    if (level === 1) {
      if (Math.random() < 0.7) calculateTarget();
    }
  };

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <motion.button
        className="runaway-button btn btn-primary"
        onMouseEnter={handleInteraction}
        onTouchStart={handleInteraction}
        onClick={onClick}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.2rem',
          zIndex: 50, // ensures it stays on top while running
        }}
        whileTap={{ scale: 0.9 }}
      >
        {children}
      </motion.button>
    </div>
  );
}
