import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import confetti from 'canvas-confetti';

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
  const [activeTab, setActiveTab] = useState('deck'); // 'deck' | 'achievements'

  const hasFirstContact = driverCards.length >= 1;
  const hasFleet = driverCards.length >= 5;
  const hasObsessed = driverCards.length >= 10;
  const hasLegendary = driverCards.some((c) => c.rarity === 'legendary');
  const hasMusician = driverCards.some((c) => c.music && c.music >= 50);

  const achievements = [
    { id: 'first_contact', name: 'Первичный Контакт', desc: 'Собрать 1 карточку водителя', done: hasFirstContact },
    { id: 'fleet', name: 'Таксопарк', desc: 'Собрать 5 карточек', done: hasFleet },
    { id: 'obsessed', name: 'Одержимый', desc: 'Собрать 10 карточек', done: hasObsessed },
    { id: 'legendary', name: 'Золотая Лихорадка', desc: 'Собрать 1 легендарку!', done: hasLegendary },
    { id: 'musician', name: 'Меломан', desc: 'Поездка с водителем-музыкантом (>50 муз.)', done: hasMusician },
  ];

  const handleAchievementHover = (done) => {
    if (done) {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 }, colors: ['#ff9800', '#ffd700'] });
    }
  };

  return (
    <div className="page-container">
      <h2>🃏 Карточки и Регалии</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'deck' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('deck')}
          style={{ flex: 1 }}
        >
          Моя Колода
        </button>
        <button 
          className={`btn ${activeTab === 'achievements' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('achievements')}
          style={{ flex: 1 }}
        >
          Ачивки
        </button>
      </div>

      {activeTab === 'deck' && (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Собрано: {driverCards.length}
          </p>
          {driverCards.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '2rem' }}>🏜️</p>
              <p>Пока пусто. Закажи поездку, чтобы получить карточку!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {driverCards.map((card, i) => (
                <div key={card.id || i} className="card" style={{
                  borderColor: RARITY_COLORS[card.rarity] || '#ccc',
                  borderWidth: '2px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem' }}>🚗</div>
                  <strong>{card.name}</strong>
                  <div style={{
                    fontSize: '0.7rem',
                    color: RARITY_COLORS[card.rarity] || '#ccc',
                    fontWeight: 700,
                  }}>
                    {RARITY_LABELS[card.rarity] || 'Неизвестно'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    ⚡{card.speed || 0} 🤫{card.silence || 0} 🎵{card.music || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'achievements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className="card"
              onMouseEnter={() => handleAchievementHover(ach.done)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: ach.done ? '#ff9800' : 'var(--border-color)',
                backgroundColor: ach.done ? 'rgba(255, 152, 0, 0.1)' : 'var(--bg-secondary)',
                opacity: ach.done ? 1 : 0.6,
                transition: 'all 0.3s ease'
              }}
            >
              <div>
                <h4 style={{ color: ach.done ? '#ff9800' : 'var(--text-primary)', margin: 0 }}>
                  {ach.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {ach.desc}
                </div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>
                {ach.done ? '🏆' : '🔒'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
