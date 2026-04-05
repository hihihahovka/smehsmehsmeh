/*
 * =============================================
 *  РУЛЕТКА ВОДИТЕЛЕЙ (CS:GO стиль)
 *  Ответственный: Участник 2 (Рулетки)
 * =============================================
 *
 *  TODO:
 *  - [ ] Горизонтальный барабан с карточками
 *  - [ ] Анимация замедления (easeOutCubic)
 *  - [ ] Звуки tick-tick-tick при прокрутке
 *  - [ ] Подсветка результата (glow по редкости)
 *  - [ ] Callback onResult(driverCard)
 *
 *  Водители:
 *  - Common: Стандарт (×1.0)
 *  - Rare: Молчан (×3.0, тишина)
 *  - Epic: Дед на Жигулях (×0.5, шансон)
 *  - Legendary: ГТА-водитель (×random)
 *  - Mythic: Призрак (невидим)
 */

export default function DriverRoulette({ onResult }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <p style={{ fontSize: '2rem' }}>🎰</p>
      <p>[TODO: Барабан рулетки — Участник 2]</p>
      <button
        className="btn btn-primary"
        onClick={() => onResult?.({
          name: 'Тестовый Водитель',
          rarity: 'common',
          speed: 5,
          silence: 5,
          priceMultiplier: 1.0,
        })}
      >
        Крутить (заглушка)
      </button>
    </div>
  );
}
