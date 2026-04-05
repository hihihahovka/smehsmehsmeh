import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

/*
 * Участник 4: Боготворение Яндекса
 * Пользователь должен ввести фразу символ в символ.
 * Каждая ошибка сбрасывает ввод. Успешный ввод повышает "Рейтинг лояльности".
 */

const TARGET_PHRASE = "Яндекс — солнце моей жизни, а Яндекс Плюс — воздух, которым я дышу.";

export default function PraiseYandex() {
  const [input, setInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    // TODO: логика строгого совпадения
    const val = e.target.value;
    setInput(val);
  };

  return (
    <div className="card praise-yandex" style={{ marginTop: '1rem', border: '2px solid var(--accent)' }}>
      <h3 style={{ color: 'var(--accent)' }}>Боготворение Яндекса</h3>
      <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Докажи свою преданность. Введи текст символ в символ:
        <br/>
        <strong style={{ color: 'var(--text-primary)' }}>{TARGET_PHRASE}</strong>
      </p>
      
      <textarea 
        value={input}
        onChange={handleChange}
        placeholder="Начни печатать..."
        style={{ width: '100%', height: '80px', fontFamily: 'Courier New, monospace' }}
      />
      {errorMsg && <p style={{ color: 'red', marginTop: '0.5rem' }}>{errorMsg}</p>}
    </div>
  );
}
