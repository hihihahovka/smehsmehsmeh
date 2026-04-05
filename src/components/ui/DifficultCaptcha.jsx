/*
 * =============================================
 *  КАПЧА ИЗ 2003 ГОДА
 *  Ответственный: Участник 1 (Онбординг)
 * =============================================
 *
 *  TODO:
 *  - [ ] Canvas с рандомным текстом (5-6 символов)
 *  - [ ] Искажение: rotate, skew, шум, зачёркивания
 *  - [ ] 3 попытки, потом «Может, ты робот?»
 *  - [ ] +10 ЯР за прохождение с первой попытки
 */

import { useEffect, useRef, useState, useCallback } from 'react';

// ─────────────────────────────────────────────────────
//  Constants & Helpers
// ─────────────────────────────────────────────────────

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
const AWFUL_COLORS = ['#ff0000', '#ff00ff', '#00ff00', '#ffff00', '#00ffff', '#ff6600'];
const AWFUL_FONTS = [
  'bold 28px "Comic Sans MS", cursive',
  'bold 30px Impact, sans-serif',
  'bold 26px "Times New Roman", serif',
  'bold 32px "Courier New", monospace',
];
const MAX_ATTEMPTS = 3;
const ROBOT_MESSAGES = [
  'Может, ты робот? 🤖',
  'Серьёзно? Даже робот справился бы быстрее.',
  'Наш алгоритм считает тебя Skynet.',
  'Попробуй ещё раз. Или нет.',
  'ОШИБКА 404: ЧЕЛОВЕК НЕ НАЙДЕН',
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCode(len) {
  const l = len ?? randomInt(5, 6);
  return Array.from({ length: l }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

function drawCaptcha(canvas, code) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Страшный фон
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffcc';
  ctx.fillRect(0, 0, W, H);

  // Фоновый шум — случайные пиксели
  for (let i = 0; i < 800; i++) {
    ctx.fillStyle = `rgba(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)},0.4)`;
    ctx.fillRect(randomInt(0, W), randomInt(0, H), randomInt(1, 3), randomInt(1, 3));
  }

  // Зачёркивающие кривые линии
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(randomInt(0, W), randomInt(0, H));
    ctx.bezierCurveTo(
      randomInt(0, W), randomInt(0, H),
      randomInt(0, W), randomInt(0, H),
      randomInt(0, W), randomInt(0, H),
    );
    ctx.strokeStyle = AWFUL_COLORS[randomInt(0, AWFUL_COLORS.length - 1)];
    ctx.lineWidth = randomInt(1, 3);
    ctx.stroke();
  }

  // Рисуем каждый символ с random-трансформациями
  const charW = W / (code.length + 1);
  for (let i = 0; i < code.length; i++) {
    ctx.save();
    const x = charW * (i + 0.7);
    const y = H / 2 + randomInt(-8, 8);
    ctx.translate(x, y);
    ctx.rotate(((Math.random() - 0.5) * Math.PI) / 3); // ±30°
    ctx.transform(1, Math.random() * 0.4 - 0.2, Math.random() * 0.4 - 0.2, 1, 0, 0);
    ctx.font = AWFUL_FONTS[randomInt(0, AWFUL_FONTS.length - 1)];
    ctx.fillStyle = AWFUL_COLORS[randomInt(0, AWFUL_COLORS.length - 1)];
    ctx.shadowColor = AWFUL_COLORS[randomInt(0, AWFUL_COLORS.length - 1)];
    ctx.shadowBlur = randomInt(2, 6);
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }

  // Сетка поверх для дополнительного ужаса
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 12) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 12) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
}

export default function DifficultCaptcha({ onPass }) {
  const canvasRef = useRef(null);
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [failed, setFailed] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [robotMsg, setRobotMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const generateNew = useCallback(() => {
    const newCode = generateCode();
    setCode(newCode);
    setInput('');
    return newCode;
  }, []);

  // Первая генерация
  useEffect(() => {
    generateNew();
  }, [generateNew]);

  // Рисуем капчу при смене кода
  useEffect(() => {
    if (!code || !canvasRef.current) return;
    drawCaptcha(canvasRef.current, code);
  }, [code]);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === code.toLowerCase()) {
      setSuccess(true);
      setTimeout(() => onPass?.(), 800);
    } else {
      triggerShake();
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      if (newAttempts <= 0) {
        setFailed(true);
        setRobotMsg(ROBOT_MESSAGES[randomInt(0, ROBOT_MESSAGES.length - 1)]);
      } else {
        generateNew();
      }
    }
  };

  const handleReset = () => {
    setFailed(false);
    setAttemptsLeft(MAX_ATTEMPTS);
    generateNew();
  };

  const handleRefresh = () => {
    generateNew();
  };

  // ── Экран «может, ты робот?» ──
  if (failed) {
    return (
      <div className="card" style={styles.failBox}>
        <div style={styles.robotEmoji}>🤖</div>
        <p style={styles.robotText}>{robotMsg}</p>
        <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1rem' }}>
          Исчерпано все {MAX_ATTEMPTS} попытки
        </p>
        <button className="btn btn-primary" style={styles.retryBtn} onClick={handleReset}>
          Попробовать снова
        </button>
      </div>
    );
  }

  // ── Экран успеха ──
  if (success) {
    return (
      <div className="card" style={{ ...styles.failBox, borderColor: '#00ff41' }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <p style={{ color: '#00ff41', fontWeight: 'bold', marginTop: '0.5rem' }}>
          Человек подтверждён!
        </p>
      </div>
    );
  }

  // ── Основная капча ──
  return (
    <div
      className="card"
      style={{
        ...styles.box,
        animation: shaking ? 'captcha-shake 0.5s ease' : 'none',
      }}
    >
      <style>{`
        @keyframes captcha-shake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-10px) rotate(-1deg); }
          30%      { transform: translateX(10px) rotate(1deg); }
          45%      { transform: translateX(-8px); }
          60%      { transform: translateX(8px); }
          75%      { transform: translateX(-5px); }
          90%      { transform: translateX(5px); }
        }
      `}</style>

      <p style={styles.title}> ПОДТВЕРДИТЕ, ЧТО ВЫ ЧЕЛОВЕК</p>
      <p style={styles.subtitle}>Введите символы с картинки</p>

      {/* Canvas-капча */}
      <div style={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={280}
          height={90}
          style={styles.canvas}
        />
        <button
          type="button"
          onClick={handleRefresh}
          style={styles.refreshBtn}
          title="Обновить капчу"
        >
          🔄
        </button>
      </div>

      {/* Попытки */}
      <div style={styles.attemptsRow}>
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.attemptDot,
              background: i < attemptsLeft ? '#ff3300' : '#333',
            }}
          />
        ))}
        <span style={styles.attemptsLabel}>
          {attemptsLeft} попытк{attemptsLeft === 1 ? 'а' : 'и'} осталось
        </span>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите код..."
          maxLength={8}
          autoComplete="off"
          spellCheck={false}
          style={styles.input}
        />
        <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
          Проверить
        </button>
      </form>

      <p style={styles.hint}>
        Регистр не важен. Нажмите 🔄 чтобы получить новую капчу.
      </p>
    </div>
  );
}

// ───────────────────────────────────────────────
//  Inline styles (изолированы от global.css)
// ───────────────────────────────────────────────

const styles = {
  box: {
    textAlign: 'center',
    maxWidth: 360,
    margin: '0 auto',
    border: '3px solid #ff3300',
    background: 'rgba(26,0,0,0.85)',
    padding: '1.25rem',
  },
  title: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.6rem',
    color: '#ff3300',
    letterSpacing: 1,
    marginBottom: '0.4rem',
    textShadow: '0 0 8px #ff3300',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#ffff00',
    marginBottom: '0.75rem',
  },
  canvasWrap: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: '0.75rem',
  },
  canvas: {
    display: 'block',
    border: '3px inset #888',
    boxShadow: '2px 2px 0 #000',
    imageRendering: 'pixelated',
  },
  refreshBtn: {
    position: 'absolute',
    top: -12,
    right: -12,
    background: '#333',
    border: '2px solid #666',
    borderRadius: '50%',
    width: 28,
    height: 28,
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attemptsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '0.75rem',
  },
  attemptDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid #666',
    transition: 'background 0.3s',
  },
  attemptsLabel: {
    fontSize: '0.7rem',
    color: '#aaa',
    marginLeft: 4,
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    marginBottom: '0.5rem',
  },
  input: {
    background: '#ffffcc',
    color: '#000',
    border: '3px inset #888',
    padding: '0.5rem 0.75rem',
    fontFamily: '"Courier New", monospace',
    fontSize: '1.1rem',
    letterSpacing: 4,
    width: 160,
    textAlign: 'center',
    outline: 'none',
  },
  submitBtn: {
    fontSize: '0.8rem',
    padding: '0.5rem 0.75rem',
    background: '#ff3300',
    border: '2px solid #cc0000',
  },
  hint: {
    fontSize: '0.65rem',
    color: '#666',
    fontStyle: 'italic',
  },
  // Fail screen
  failBox: {
    textAlign: 'center',
    border: '3px solid #ff3300',
    padding: '2rem 1rem',
    maxWidth: 360,
    margin: '0 auto',
  },
  robotEmoji: {
    fontSize: '4rem',
    marginBottom: '0.75rem',
    animation: 'spin 2s linear infinite',
  },
  robotText: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.65rem',
    color: '#ff3300',
    marginBottom: '0.5rem',
    lineHeight: 1.8,
    textShadow: '0 0 10px #ff3300',
  },
  retryBtn: {
    background: '#ff3300',
    borderRadius: 0,
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.6rem',
  },
};
