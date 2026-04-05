import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import confetti from 'canvas-confetti';
import { Palette, Grid, Type, Ban, Car, Brain, Headphones, Map, CheckCircle2, XCircle } from 'lucide-react';
import './Shop.css';

/*
 * =============================================
 *  МАГАЗИН УЛУЧШЕНИЙ
 *  Ответственный: Участник 4 (Магазин + Колода + Стата)
 * =============================================
 */

const getIcon = (key) => {
  switch(key) {
    case 'colorPalette': return <Palette size={24} />;
    case 'gridLayout': return <Grid size={24} />;
    case 'normalFont': return <Type size={24} />;
    case 'noAds': return <Ban size={24} />;
    case 'autoPedals': return <Car size={24} />;
    case 'memory': return <Brain size={24} />;
    case 'liveSupport': return <Headphones size={24} />;
    case 'mapChunks': return <Map size={24} />;
    default: return <CheckCircle2 size={24} />;
  }
};

const UPGRADE_CATALOG = [
  { key: 'colorPalette', name: 'Цветовая палитра', cost: 50, desc: 'Убирает кислотные цвета и боль в глазах' },
  { key: 'gridLayout',   name: 'Grid Layout',       cost: 80, desc: 'Кнопки перестают прыгать по экрану' },
  { key: 'normalFont',   name: 'Нормальный шрифт',  cost: 60, desc: 'Прощай, Comic Sans, привет, Inter' },
  { key: 'noAds',        name: 'Убрать рекламу',     cost: 120, desc: 'Полноэкранные баннеры больше не появятся' },
  { key: 'autoPedals',   name: 'Автопедали',         cost: 90, desc: 'Автоматическое кручение педалей во время ожидания такси' },
  { key: 'memory',       name: 'Память',             cost: 100, desc: 'Восстановлю твое забытое имя (лечит амнезию)' },
  { key: 'liveSupport',  name: 'Живая поддержка',    cost: 500, desc: 'Разблокирует чат с реальным (наверное) человеком' },
  { key: 'mapChunks',    name: 'Кусок карты (x10)',  cost: 30, desc: 'Рассеять немного тумана войны', isStackable: true },
];

export default function ShopPage() {
  const yandexRubles = useGameStore((s) => s.yandexRubles);
  const upgrades = useGameStore((s) => s.upgrades);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const cureAmnesia = useGameStore((s) => s.cureAmnesia);

  const [shakeId, setShakeId] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleBuy = (e, item) => {
    // Check if user has enough money
    if (yandexRubles < item.cost) {
      setShakeId(item.key);
      setShowErrorModal(true);
      setTimeout(() => setShakeId(null), 500);
      return;
    }

    const ok = buyUpgrade(item.key, item.cost);
    if (ok) {
      // Special action for memory
      if (item.key === 'memory') {
        cureAmnesia();
      }

      // Fire confetti from the button position
      const rect = e.target.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y },
        colors: ['#2ed573', '#ff4757', '#ffa502', '#5352ed']
      });
    }
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div>
          <h2 style={{ margin: 0 }}>🛒 Магазин Улучшений</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
            Сделай это приложение чуточку менее отвратительным
          </p>
        </div>
        <div className="shop-balance">
          {yandexRubles} Я-Баллы
        </div>
      </div>

      <div className="shop-grid">
        {UPGRADE_CATALOG.map((item) => {
          const isStackable = item.key === 'mapChunks';
          const owned = isStackable
            ? upgrades.mapChunks >= 10
            : upgrades[item.key];
            
          const isShaking = shakeId === item.key;

          return (
            <div 
              key={item.key} 
              className={`shop-card ${owned ? 'owned' : ''} ${isShaking ? 'shake' : ''}`}
            >
              <div className="card-header">
                <div className="card-icon">
                  {getIcon(item.key)}
                </div>
              </div>
              
              <div className="card-info">
                <h3>{item.name} {isStackable && !owned ? `(${upgrades.mapChunks}/10)` : ''}</h3>
                <p>{item.desc}</p>
              </div>

              <button
                className={`card-buy-btn ${owned ? 'owned-btn' : ''}`}
                onClick={(e) => handleBuy(e, item)}
                disabled={owned}
              >
                {owned ? (
                  <>
                    <CheckCircle2 size={18} />
                    Куплено
                  </>
                ) : (
                  `${item.cost} Я-Баллы`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {showErrorModal && (
        <div className="modal-overlay" onClick={() => setShowErrorModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="modal-emoji">😿</span>
            <h3 className="modal-title">Недостаточно Я-Баллы!</h3>
            <p className="modal-text">
              Ты слишком беден для этого мира комфорта. <br/>
              Катайся больше, страдай больше!
            </p>
            <button 
              className="modal-close-btn"
              onClick={() => setShowErrorModal(false)}
            >
              Пойти зарабатывать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
