/*
 * =============================================
 *  CV ЖЕСТ «67» для скидки
 *  Ответственный: Участник 3 (CV / мини-игры)
 * =============================================
 *
 *  TODO:
 *  - [ ] getUserMedia для камеры
 *  - [ ] MediaPipe Hands или готовая CV-модель
 *  - [ ] Распознавание жеста «67» (6 пальцев + 7 пальцев?)
 *  - [ ] Визуальная обратная связь (рамка, прогресс)
 *  - [ ] +67 Я-Баллы при успехе (разово)
 */

export default function GestureCapture({ onSuccess, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center' }}>
        <h3>Покажи «67» 🤟</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Покажите два жеста в камеру: «6» и «7»
        </p>

        <div style={{
          width: '100%', height: '250px',
          background: '#111', borderRadius: 'var(--border-radius)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '1rem 0',
        }}>
          📷 [TODO: Видео с камеры + CV — Участник 3]
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={onSuccess} style={{ flex: 1 }}>
            Заглушка: Распознано!
          </button>
          <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
