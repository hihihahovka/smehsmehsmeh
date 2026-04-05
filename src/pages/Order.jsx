import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useRideStore } from '../store/rideStore';
import SquadSelector from '../components/ui/SquadSelector';
import D20Roll from '../components/ui/D20Roll';
import MemeDetector from '../components/minigames/MemeDetector';

import MOCK_STREETS from '../data/streets.json';

export default function OrderPage() {
  const level = useGameStore((s) => s.level);
  const totalRides = useGameStore((s) => s.totalRides);
  const navigate = useNavigate();
  const startWaiting = useRideStore((s) => s.startWaiting);

  const [fromIndex, setFromIndex] = useState(0);
  const [destIndex, setDestIndex] = useState(MOCK_STREETS.length > 1 ? 1 : 0);
  const [showFailedBanner, setShowFailedBanner] = useState(false);
  const [d20Result, setD20Result] = useState(null);

  const isAntiDiscount = totalRides === 0;
  
  // Predictably annoying fixed "random" 5% chance if we want it constant, or simulate once on mount
  const [isVpn, setIsVpn] = useState(() => Math.random() < 0.05);

  const handleD20Complete = (rollResult) => {
    if (rollResult === 1) {
      setShowFailedBanner(true);
      return;
    }
    
    setD20Result(rollResult);
    
    // 15% шанс Шереметьево
    const fromSVO = Math.random() < 0.15;
    
    let fromAddress = '';
    if (isVpn) {
      fromAddress = 'Амстердам, Нидерланды (Поездка займёт 4 дня)';
    } else if (fromSVO) {
      fromAddress = 'Шереметьево (SVO)';
    } else {
      fromAddress = MOCK_STREETS[fromIndex];
    }

    const toAddress = MOCK_STREETS[destIndex];

    // Базовый расчет цены
    const dist = Math.abs(fromIndex - destIndex);
    let basePrice = 300 + Math.floor(dist * 20);
    if (fromSVO) basePrice *= 3;
    if (isVpn) basePrice *= 50;

    useRideStore.getState().setAddress(fromAddress, fromSVO);
    useRideStore.getState().setToAddress?.(toAddress);
    useRideStore.getState().setPrice(basePrice);
    startWaiting();
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '1rem' }}>Куда едем?</h2>

      {/* Ввод адреса слайдерами (самый "удобный" способ из всех) */}
      <div className="card">
        <h3>Откуда (Адрес)</h3>
        <input type="range" min="0" max={MOCK_STREETS.length - 1} step="1" value={fromIndex}
          onChange={(e) => setFromIndex(Number(e.target.value))}
          style={{ width: '100%' }} />
        <div style={{ textAlign: 'center', color: 'var(--accent-secondary)' }}>{MOCK_STREETS[fromIndex]}</div>

        {level === 1 && (
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            🧭 Эта улица находится где-то в Москве. Или не в Москве. Мы не знаем.
          </p>
        )}

        <h3 style={{ marginTop: '1.5rem' }}>Куда (Адрес)</h3>
        <input type="range" min="0" max={MOCK_STREETS.length - 1} step="1" value={destIndex}
          onChange={(e) => setDestIndex(Number(e.target.value))}
          style={{ width: '100%' }} />
        <div style={{ textAlign: 'center', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>
          {MOCK_STREETS[destIndex]}
        </div>
      </div>

      {/* Антискидка */}
      {isAntiDiscount && (
        <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Антискидка (Первый заказ)</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Ваша первая поездка стоит <strong style={{color: 'red', textDecoration: 'line-through'}}>500 ₽</strong> <strong style={{fontSize: '1.2rem', color: 'var(--accent)'}}>10 000 ₽</strong>!
          </p>
        </div>
      )}

      {/* VPN Детектор */}
      {isVpn && (
        <div className="card" style={{ marginTop: '1rem', textAlign: 'center', borderColor: '#00ffff', boxShadow: '0 0 10px #00ffff' }}>
          <p style={{ color: '#00ffff', fontWeight: 'bold' }}>Скрытый VPN обнаружен</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Ваша локация определена как: <strong>Амстердам, Нидерланды</strong>. Мы выстроим маршрут оттуда. Цена составит 4000€.
          </p>
        </div>
      )}

      {/* Режим ВМЕСТЕ (Отряд для файта) */}
      <SquadSelector />

      <MemeDetector />

      {!showFailedBanner && (
        <D20Roll onRollComplete={handleD20Complete} />
      )}

      {/* D20 Бросок Результат (Скидка / Анти-скидка) */}
      {d20Result !== null && d20Result > 1 && (
        <>
          <div 
            className="card" 
            style={{ 
              marginTop: '1rem', 
              textAlign: 'center', 
              background: d20Result >= 10 ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
              borderColor: d20Result >= 10 ? '#00ff00' : '#ff0000'
            }}
          >
            <p style={{ color: d20Result >= 10 ? '#00ff00' : '#ff3333', fontWeight: 'bold' }}>
              Результат: {d20Result}
            </p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              {d20Result >= 10 
                ? `Отлично! Выкинуто ${d20Result}. Боги такси дарят вам скидку ${d20Result}%. Цена снижена.` 
                : `Ой-ёй. Выпало ${d20Result}. Боги негодуют! Вам назначена 'Анти-скидка' +${(20 - d20Result) * 10}%. Цена поездки выросла!`}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/waiting')}
            style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', fontSize: '1.2rem', background: '#00aa00', borderColor: '#00ff00' }}
          >
            Принять судьбу (Ожидать такси)
          </button>
        </>
      )}

      {showFailedBanner && (
        <div className="card" style={{ background: '#ff3333', color: 'white', textAlign: 'center', marginTop: '1rem', animation: 'shake 0.5s' }}>
          <h2>Критическая неудача! (Выпало 1)</h2>
          <p>Езжай на автобусе нищеброд</p>
        </div>
      )}

      <button
        className="btn btn-secondary"
        onClick={() => navigate('/')}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        Назад / Сбежать
      </button>
    </div>
  );
}
