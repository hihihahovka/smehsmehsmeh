import { useState, useRef, useCallback } from 'react';
import './RunawayButton.css';

/*
 * =============================================
 *  УБЕГАЮЩАЯ КНОПКА «ЗАКАЗАТЬ»
 *  Ответственный: Участник 2
 * =============================================
 *
 *  Логика:
 *  - На уровне 0: кнопка убегает от курсора/пальца
 *  - На уровне 1: убегает первые 2 секунды
 *  - На уровне 2+: стоит на месте
 *
 *  TODO:
 *  - [ ] CSS transform + transition при наведении
 *  - [ ] Touch-events для мобило
 *  - [ ] Визуальный эффект «поймал!»
 */

export default function RunawayButton({ level, onClick, children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (level >= 2) return; // не убегает

    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 200;
    setPos({ x: offsetX, y: offsetY });
  }, [level]);

  return (
    <button
      ref={buttonRef}
      className="runaway-button btn btn-primary"
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {children}
    </button>
  );
}
