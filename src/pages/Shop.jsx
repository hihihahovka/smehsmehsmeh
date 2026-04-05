import { useGameStore } from '../store/gameStore';

/*
 * =============================================
 *  МАГАЗИН УЛУЧШЕНИЙ
 *  Ответственный: Участник 4 (Магазин + Колода + Стата)
 * =============================================
 *
 *  TODO (Участник 4):
 *  - [ ] Визуальные карточки улучшений с ценой
 *  - [ ] Анимация покупки (confetti, glow)
 *  - [ ] Лок/анлок состояние
 *  - [ ] «Вы не можете себе это позволить» — модалка
 */

const UPGRADE_CATALOG = [
  { key: 'colorPalette', name: 'Цветовая палитра', cost: 50, desc: 'Убирает кислотные цвета' },
  { key: 'gridLayout',   name: 'Grid Layout',       cost: 80, desc: 'Нормальная сетка' },
  { key: 'normalFont',   name: 'Нормальный шрифт',  cost: 60, desc: 'Inter вместо Comic Sans' },
  { key: 'noAds',        name: 'Убрать рекламу',     cost: 120, desc: 'Реклама исчезает' },
  { key: 'autoPedals',   name: 'Автопедали',         cost: 90, desc: 'Не надо тапать при ожидании' },
  { key: 'memory',       name: 'Память',             cost: 100, desc: 'Восстановить имя и дом' },
  { key: 'liveSupport',  name: 'Живая поддержка',    cost: 500, desc: 'Чат с реальным человеком' },
  { key: 'mapChunks',    name: 'Кусок карты',        cost: 30, desc: 'Открыть часть тумана войны' },
];

export default function ShopPage() {
  const yandexRubles = useGameStore((s) => s.yandexRubles);
  const upgrades = useGameStore((s) => s.upgrades);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  const handleBuy = (key, cost) => {
    const ok = buyUpgrade(key, cost);
    if (!ok) {
      alert(yandexRubles < cost
        ? 'Недостаточно ЯР! Катайся больше.'
        : 'Уже куплено!');
    }
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '0.5rem' }}>🛒 Магазин улучшений</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Баланс: <strong style={{ color: 'var(--accent-secondary)' }}>{yandexRubles} ЯР</strong>
      </p>

      {UPGRADE_CATALOG.map((item) => {
        const owned = item.key === 'mapChunks'
          ? upgrades.mapChunks >= 10
          : upgrades[item.key];

        return (
          <div key={item.key} className="card" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            opacity: owned ? 0.5 : 1,
          }}>
            <div>
              <strong>{item.name}</strong>
              {item.key === 'mapChunks' && <span style={{ fontSize: '0.7rem' }}> ({upgrades.mapChunks}/10)</span>}
              <br/>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => handleBuy(item.key, item.cost)}
              disabled={owned}
              style={{ minWidth: '80px' }}
            >
              {owned ? '✓' : `${item.cost} ЯР`}
            </button>
          </div>
        );
      })}
    </div>
  );
}
