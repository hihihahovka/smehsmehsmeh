import { useGameStore } from '../store/gameStore';

/*
 * =============================================
 *  КОЛОДА ВОДИТЕЛЕЙ (Гвинт-режим)
 *  Ответственный: Участник 4 (Магазин + Колода + Стата)
 * =============================================
 *
 *  TODO (Участник 4):
 *  - [ ] Визуальные карточки с рамкой по редкости
 *  - [ ] Анимация flip при получении новой
 *  - [ ] Фильтры по редкости
 *  - [ ] Счётчик коллекции
 */

const RARITY_COLORS = {
  common: '#9e9e9e',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

const RARITY_LABELS = {
  common: 'Обычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
};

export default function CardDeckPage() {
  const driverCards = useGameStore((s) => s.driverCards);

  return (
    <div className="page-container">
      <h2>🃏 Моя колода</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Карточек: {driverCards.length}
      </p>

      {driverCards.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2rem' }}>🏜️</p>
          <p>Пока пусто. Закажи поездку, чтобы получить карточку!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {driverCards.map((card) => (
            <div key={card.id} className="card" style={{
              borderColor: RARITY_COLORS[card.rarity],
              borderWidth: '2px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem' }}>🚗</div>
              <strong>{card.name}</strong>
              <div style={{
                fontSize: '0.7rem',
                color: RARITY_COLORS[card.rarity],
                fontWeight: 700,
              }}>
                {RARITY_LABELS[card.rarity]}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                ⚡{card.speed} 🤫{card.silence}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
