import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useRideStore } from '../store/rideStore';
import SquadSelector from '../components/ui/SquadSelector';

/*
 * =============================================
 *  СТРАНИЦА ЗАКАЗА
 *  Ответственный: Участник 2 (Рулетки + заказ)
 * =============================================
 *
 *  TODO (Участник 2):
 *  - [ ] AddressSlider (координаты, ур.0)
 *  - [ ] CompassHint (холодно-тепло, ур.1)
 *  - [ ] Обычная строка поиска (ур.3+)
 *  - [ ] Рулетка адреса (банк московских улиц)
 *  - [ ] Шанс 15% — Шереметьево
 *  - [ ] DriverRoulette (барабан CS:GO)
 *  - [ ] PriceRoulette
 *  - [ ] d20 бросок перед подтверждением
 */

const MOCK_STREETS = [
  'ул. Тверская', 'ул. Арбат', 'Ленинградский пр-т', 'ул. Мясницкая',
  'Кутузовский пр-т', 'ул. Большая Ордынка', 'Садовое кольцо',
  'Новый Арбат', 'ул. Покровка', 'Бульварное кольцо',
];

export default function OrderPage() {
  const level = useGameStore((s) => s.level);
  const navigate = useNavigate();
  const startWaiting = useRideStore((s) => s.startWaiting);

  const [lat, setLat] = useState(55.75);
  const [lon, setLon] = useState(37.62);
  const [showFailedBanner, setShowFailedBanner] = useState(false);

  const handleOrder = () => {
    // Временная симуляция броска d20
    const d20Roll = Math.floor(Math.random() * 20) + 1;
    if (d20Roll === 1) {
      setShowFailedBanner(true);
      return;
    }
    
    // 15% шанс Шереметьево
    const fromSVO = Math.random() < 0.15;
    const address = fromSVO
      ? 'Шереметьево (SVO)'
      : `${MOCK_STREETS[Math.floor(Math.random() * MOCK_STREETS.length)]}, д. ${Math.floor(Math.random() * 200) + 1}`;

    useRideStore.getState().setAddress(address, fromSVO);
    startWaiting();
    navigate('/waiting');
  };

  return (
    <div className="page-container">
      <h2 style={{ marginBottom: '1rem' }}>Куда едем?</h2>

      {/* Ввод адреса зависит от уровня */}
      {level <= 1 ? (
        <div className="card">
          <h3>Широта</h3>
          <input type="range" min="-90" max="90" step="0.01" value={lat}
            onChange={(e) => setLat(Number(e.target.value))}
            style={{ width: '100%' }} />
          <div style={{ textAlign: 'center', color: 'var(--accent-secondary)' }}>{lat.toFixed(2)}</div>

          <h3>Долгота</h3>
          <input type="range" min="-180" max="180" step="0.01" value={lon}
            onChange={(e) => setLon(Number(e.target.value))}
            style={{ width: '100%' }} />
          <div style={{ textAlign: 'center', color: 'var(--accent-secondary)' }}>{lon.toFixed(2)}</div>

          {level === 1 && (
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              🧭 Вы примерно в {Math.abs(lat - 55.75).toFixed(0) * 111} км от Москвы
            </p>
          )}
        </div>
      ) : (
        <div className="card">
          <input type="text" className="input-field" placeholder="Введите адрес..." />
        </div>
      )}

      {/* TODO: Антискидка на первый заказ */}
      <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-secondary)', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Антискидка (Первый заказ)</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          [TODO: Вместо 500 рублей, первый заказ стоит 10 000 рублей. (Участник 2)]
        </p>
      </div>

      {/* TODO: Поездка из Нидерландов (VPN) */}
      <div className="card" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>VPN Детектор</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          [TODO: Если включен VPN (или 5% шанс), поездка начинается из Нидерландов. (Участник 2)]
        </p>
      </div>

      {/* Режим ВМЕСТЕ (Отряд для файта) */}
      <SquadSelector />

      {showFailedBanner && (
        <div className="card" style={{ background: '#ff3333', color: 'white', textAlign: 'center', marginTop: '1rem' }}>
          <h2>Критическая неудача! (Выпало 1)</h2>
          <p>Езжай на автобусе нищеброд</p>
        </div>
      )}

      {/* TODO: Рулетка водителей + настоящий визуальный d20 */}
      <button
        className="btn btn-primary"
        onClick={handleOrder}
        disabled={showFailedBanner}
        style={{ width: '100%', marginTop: '1rem', opacity: showFailedBanner ? 0.5 : 1 }}
      >
        Заказать (Бросить d20)
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => navigate('/')}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        Назад
      </button>
    </div>
  );
}
