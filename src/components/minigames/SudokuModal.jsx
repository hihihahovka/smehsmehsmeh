import { useState, useEffect } from 'react';
import { getSudoku } from 'sudoku-gen';

export default function SudokuModal({ cancelCount, onSolve, onGiveUp }) {
  const [board, setBoard] = useState(null);
  const [initialBoard, setInitialBoard] = useState(null);
  const [solution, setSolution] = useState(null);

  useEffect(() => {
    // Сложность
    let diff = 'easy';
    if (cancelCount >= 2) diff = 'medium';
    if (cancelCount >= 4) diff = 'hard';
    if (cancelCount >= 6) diff = 'expert';

    const rawSudoku = getSudoku(diff);

    const b = rawSudoku.puzzle.split('').map(c => c === '-' ? '' : c);
    const s = rawSudoku.solution.split('');

    setInitialBoard([...b]);
    setBoard([...b]);
    setSolution(s);
  }, [cancelCount]);

  const handleChange = (index, value) => {
    if (!/^[1-9]?$/.test(value)) return;
    const newBoard = [...board];
    newBoard[index] = value;
    setBoard(newBoard);

    // check win
    if (newBoard.join('') === solution.join('')) {
      onSolve();
    }
  };

  if (!board) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '90%', padding: '2rem' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Отмена заказа стоит ЯР!</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          Докажи, что ты в своём уме. Реши судоку. Успешно решишь — получишь +30 ЯР. Сдашься — заплатишь штраф -20 ЯР.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '2px', background: 'var(--accent)', padding: '2px', marginBottom: '1.5rem' }}>
          {board.map((cell, i) => {
            const isInitial = initialBoard[i] !== '';
            // Borders for 3x3
            const borderRight = (i % 9 === 2 || i % 9 === 5) ? '2px solid var(--accent)' : 'none';
            const borderBottom = (Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5) ? '2px solid var(--accent)' : 'none';

            return (
              <input
                key={i}
                type="text"
                value={cell}
                readOnly={isInitial}
                onChange={(e) => handleChange(i, e.target.value)}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  textAlign: 'center',
                  fontSize: '1.2rem',
                  fontWeight: isInitial ? 'bold' : 'normal',
                  color: isInitial ? '#fff' : 'var(--accent)',
                  background: isInitial ? '#333' : '#111',
                  border: 'none',
                  borderRight,
                  borderBottom,
                  outline: 'none'
                }}
              />
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onGiveUp} style={{ flex: 1, borderColor: '#ff4444', color: '#ff4444' }}>
            Сдаюсь (−20 ЯР)
          </button>
        </div>
      </div>
    </div>
  );
}
