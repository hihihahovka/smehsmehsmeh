import { useGameStore } from '../store/gameStore';
import PraiseYandex from '../components/minigames/PraiseYandex';

/*
 * =============================================
 *  ЭКРАН СТАТИСТИКИ ДЕГРАДАЦИИ
 *  Ответственный: Участник 4 (Магазин + Колода + Стата)
 * =============================================
 *
 *  TODO (Участник 4):
 *  - [ ] Визуальные графики (прогресс Я-Баллы во времени)
 *  - [ ] Полный лог действий с фильтрами
 *  - [ ] «Шкала боли» — визуализация уровня деградации
 *  - [ ] Боготворение Яндекса (Повышение рейтинга)
 *  - [ ] Кнопка «Сбросить всё» (debug)
 */

export default function StatsPage() {
  const actionLog = useGameStore((s) => s.actionLog);
  const yandexRubles = useGameStore((s) => s.yandexRubles);
  const level = useGameStore((s) => s.level);
  const totalRides = useGameStore((s) => s.totalRides);
  const cancelCount = useGameStore((s) => s.cancelCount);
  const streak = useGameStore((s) => s.streak);
  const resetAll = useGameStore((s) => s.resetAll);

  return (
    <div className="page-container">
      <h2>📊 Статистика деградации</h2>

      {/* Сводка */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Я-Баллы</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{yandexRubles}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Уровень</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>{level}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Поездок</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{totalRides}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Отмен</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent)' }}>{cancelCount}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Стрик</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>🔥 {streak}</div>
        </div>
      </div>

      {/* Лог действий */}
      <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Лог действий</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {actionLog.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Пока пусто. Начни использовать аппу!
          </div>
        ) : (
          [...actionLog].reverse().map((entry) => (
            <div key={entry.id} className="card" style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
            }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {new Date(entry.timestamp).toLocaleTimeString('ru-RU')}
                </span>
                {' '}{entry.reason}
              </div>
              <div style={{
                fontWeight: 700,
                color: entry.delta >= 0 ? 'var(--accent-secondary)' : 'var(--accent)',
              }}>
                {entry.delta >= 0 ? '+' : ''}{entry.delta}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Боготворение Яндекса */}
      <PraiseYandex />

      {/* Debug */}
      <button
        className="btn btn-secondary"
        onClick={() => {
          if (confirm('Точно сбросить ВСЁ?')) resetAll();
        }}
        style={{ width: '100%', marginTop: '1rem', opacity: 0.5, fontSize: '0.7rem' }}
      >
        🗑️ Сбросить всё (debug)
      </button>
    </div>
  );
}
