import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

/*
 * =============================================
 *  ПОДДЕРЖКА
 *  Ответственный: Участник 3 (Мини-игры + Поддержка)
 * =============================================
 *
 *  TODO (Участник 3):
 *  - [ ] GPT-бот: «бесконечная печать» на низких уровнях
 *  - [ ] Улучшенный GPT: нормальные ответы после 5 поездок
 *  - [ ] Живой чат: ур.3+
 *  - [ ] Звонок: ур.4+ (аудио/видео заглушка)
 *  - [ ] Пассивно-агрессивные push-уведомления
 */

const BOT_RESPONSES = [
  'Мы ценим ваш вопрос. Пожалуйста, напишите подробнее.',
  'Ваш запрос очень важен для нас. Подождите.',
  'Обрабатываю... Обрабатываю... Обрабатываю...',
  'К сожалению, я не понимаю. Попробуйте другими словами.',
  'Вы пробовали выключить и включить телефон?',
  'Ваш вопрос передан специалисту. Ожидайте от 1 до 999 дней.',
];

export default function SupportPage() {
  const level = useGameStore((s) => s.level);
  const totalRides = useGameStore((s) => s.totalRides);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setIsTyping(true);

    // Симуляция ответа бота (зависит от уровня)
    let typingDelay = 2000 + Math.random() * 3000;
    if (level <= 1) {
      typingDelay = 15000 + Math.random() * 10000; // Почти бесконечная печать
    } else if (level === 2) {
      typingDelay = 3000; // терпимо
    } else {
      typingDelay = 1000; // быстро
    }

    setTimeout(() => {
      let botText = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      if (level >= 3) {
        botText = `[Живой оператор Олег]: ${botText}`;
      } else if (level === 2) {
        botText = `[Умный AI]: ${botText}`;
      } else {
        botText = `[Тупой Бот]: ${botText}`;
      }

      setMessages((m) => [...m, { role: 'bot', text: botText }]);
      setIsTyping(false);
    }, typingDelay);
  };

  return (
    <div className="page-container">
      <h2>💬 Поддержка</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
        {level < 3
          ? `🤖 GPT-бот (уровень ${level}). Живой чат — с уровня 3.`
          : '🧑 Живой чат разблокирован!'}
        {totalRides < 5 && ` Поездок: ${totalRides}/5 до улучшенного бота.`}
      </p>

      {/* Чат */}
      <div style={{
        height: '350px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '0.5rem',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--border-radius)',
            maxWidth: '80%',
            fontSize: '0.85rem',
          }}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div style={{
            alignSelf: 'flex-start',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            fontStyle: 'italic',
          }}>
            Бот печатает...
          </div>
        )}
      </div>

      {/* Ввод */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="input-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Напишите вопрос..."
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          →
        </button>
      </div>
    </div>
  );
}
