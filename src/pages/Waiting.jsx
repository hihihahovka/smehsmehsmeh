import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useRideStore } from '../store/rideStore';
import PokemonMap from '../components/minigames/PokemonMap';
import DriverRoulette from '../components/roulette/DriverRoulette';

/*
 * =============================================
 *  ЭКРАН ОЖИДАНИЯ + МИНИ-ИГРЫ
 *  Ответственный: Участник 3 (Мини-игры + CV)
 * =============================================
 *
 *  TODO (Участник 3):
 *  - [ ] PedalTapper — ритмичные тапы (BPM + score)
 *  - [ ] PokemonRouting — таксист едет за покемонами вместо радара маньяка
 *  - [ ] SudokuModal — для отмены поездки
 *  - [ ] GestureCapture — CV жест «67» (MediaPipe Hands)
 *  - [ ] BalanceGame — акселерометр для «похмелья»
 *  - [ ] Обратный таймер прибытия такси
 */

export default function WaitingPage() {
  const navigate = useNavigate();
  const address = useRideStore((s) => s.address);
  const fromSVO = useRideStore((s) => s.fromSheremetyevo);
  const addRubles = useGameStore((s) => s.addRubles);
  const completeRide = useGameStore((s) => s.completeRide);
  const resetRide = useRideStore((s) => s.resetRide);

  const [timeLeft, setTimeLeft] = useState(15); // 15 сек для демо
  const [tapCount, setTapCount] = useState(0);
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (!driver || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, driver]);

  const handleTap = () => {
    setTapCount((t) => t + 1);
  };

  const handleFinish = (completedDriver) => {
    // Завершение поездки
    completeRide(completedDriver);
    addRubles(50, 'Поездка завершена');
    addRubles(tapCount > 5 ? 10 : 0, `Педали: ${tapCount} тапов`);
    resetRide();
    navigate('/');
  };

  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h2>Ищем машину...</h2>

      <div className="card" style={{ marginTop: '1rem' }}>
        <p>📍 {address}</p>
        {fromSVO && (
          <p style={{ color: 'var(--accent)', fontWeight: 700 }}>
            ✈️ Вы едете из Шереметьево! +200% к цене
          </p>
        )}
      </div>

      {!driver && (
        <DriverRoulette onResult={(d) => setDriver(d)} />
      )}

      {driver && timeLeft > 0 ? (
        <>
          <div style={{ fontSize: '3rem', fontWeight: 700, margin: '2rem 0', color: 'var(--accent)' }}>
            0:{timeLeft.toString().padStart(2, '0')}
          </div>

          {/* Мини-игра: тапай! */}
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Крути педали! Тапай, чтобы Водитель {driver?.name} ехал быстрее
            </p>
            <button
              className="btn btn-primary"
              onClick={handleTap}
              style={{ fontSize: '1.5rem', padding: '1rem 2rem', width: '100%' }}
            >
              🚴 ТАПАЙ! ({tapCount})
            </button>
          </div>

          {/* Сбор покемонов */}
          <PokemonMap onAllCaught={() => {}} />
        </>
      ) : driver && timeLeft <= 0 ? (
        <div>
          <p style={{ fontSize: '1.5rem', margin: '2rem 0' }}>🚗 Водитель {driver.name} приехал!</p>
          <button className="btn btn-primary" onClick={() => handleFinish(driver)} style={{ width: '100%' }}>
            Завершить поездку (+50 ЯР)
          </button>
        </div>
      ) : null}
    </div>
  );
}
