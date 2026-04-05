import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { useRideStore } from "../store/rideStore";
import PokemonMap from '../components/minigames/PokemonMap';
import DriverRoulette from '../components/roulette/DriverRoulette';
import BossFight from '../components/minigames/BossFight';
import PedalTapper from '../components/minigames/PedalTapper';

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
  const toAddress = useRideStore((s) => s.toAddress);
  const fromSVO = useRideStore((s) => s.fromSheremetyevo);
  const addRubles = useGameStore((s) => s.addRubles);
  const completeRide = useGameStore((s) => s.completeRide);
  const resetRide = useRideStore((s) => s.resetRide);

  const [tapCount, setTapCount] = useState(0);
  const [driver, setDriver] = useState(null);
  const [showFight, setShowFight] = useState(false);
  const [tripPhase, setTripPhase] = useState(0);

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
        <DriverRoulette onResult={(d) => {
          setDriver(d);
          setTripPhase(1);
        }} />
      )}

      {tripPhase === 1 && (
        <PokemonMap address={address} toAddress={toAddress} phase="waiting" onArrival={() => setTripPhase(2)} />
      )}

      {tripPhase === 2 && (
        <div className="card" style={{ marginTop: '1rem', background: 'var(--bg-secondary)', border: '2px solid var(--accent)' }}>
          <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>🚕 Водитель {driver.name} приехал по адресу {address}!</p>
          <button className="btn btn-primary" onClick={() => setTripPhase(3)} style={{ width: '100%', fontSize: '1.3rem', padding: '1rem' }}>
            Сесть в машину
          </button>
        </div>
      )}

      {tripPhase === 3 && (
        <>
          <div style={{ marginTop: '1rem' }}>
            <PedalTapper onTap={handleTap} tapCount={tapCount} />
          </div>

          {/* Интерактивная карта симуляции */}
          <PokemonMap address={address} toAddress={toAddress} phase="riding" onArrival={() => setTripPhase(4)} />
        </>
      )}

      {tripPhase === 4 && !showFight && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '1.5rem', margin: '2rem 0' }}>🚗 Водитель {driver.name} довёз вас до места назначения: {toAddress}!</p>
          <button className="btn btn-primary" onClick={() => setShowFight(true)} style={{ width: '100%' }}>
            Выйти из машины... или нет? 👊
          </button>
        </div>
      )}

      {showFight && (
        <BossFight driver={driver} onFinish={() => handleFinish(driver)} />
      )}
    </div>
  );
}
