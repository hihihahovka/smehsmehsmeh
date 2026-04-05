/*
 * =============================================
 *  СУДОКУ для отмены поездки
 *  Ответственный: Участник 3 (Мини-игры)
 * =============================================
 *
 *  TODO:
 *  - [ ] Генератор судоку по сложности (кол-во подсказок)
 *  - [ ] UI: сетка 9×9, ввод с клавиатуры
 *  - [ ] Валидация решения
 *  - [ ] Таймер (опционально)
 *  - [ ] +30 Я-Баллы за решение, −20 за сдачу
 *
 *  Сложность зависит от cancelCount:
 *  0-1: 35 подсказок (лёгкая)
 *  2-3: 28 подсказок (средняя)
 *  4-5: 22 подсказки (сложная)
 *  6+:  17 подсказок (эксперт)
 */

export default function SudokuModal({ cancelCount, onSolve, onGiveUp, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '90%' }}>
        <h3>Решите судоку для отмены</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          Отмен: {cancelCount} | Сложность: {cancelCount <= 1 ? 'Лёгкая' : cancelCount <= 3 ? 'Средняя' : cancelCount <= 5 ? 'Сложная' : 'Эксперт'}
        </p>

        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          [TODO: Сетка судоку — Участник 3]
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={onSolve} style={{ flex: 1 }}>
            Решено (+30 Я-Баллы)
          </button>
          <button className="btn btn-secondary" onClick={onGiveUp} style={{ flex: 1 }}>
            Сдаюсь (−20 Я-Баллы)
          </button>
        </div>
      </div>
    </div>
  );
}
