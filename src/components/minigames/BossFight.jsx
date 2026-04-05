import { useState, useEffect } from 'react';
import { useGameStore, GENDERS } from '../../store/gameStore';
import { useRideStore } from '../../store/rideStore';

// Маппинг редкости водителя к его статам (соответствует рулетке CS:GO)
const DRIVER_STATS = {
  consumer:   { diceType: 20, baseStat: 10, title: 'Ширпотреб (Опасный)' },
  milspec:    { diceType: 12, baseStat: 8, title: 'Армейское (Терпимо)' },
  restricted: { diceType: 10, baseStat: 5, title: 'Запрещенное' },
  classified: { diceType: 8, baseStat: 3, title: 'Засекреченное' },
  covert:     { diceType: 6, baseStat: 2, title: 'Тайное' },
  gold:       { diceType: 4, baseStat: 1, title: 'Редчайшее (Безобидный)' },
};

export default function BossFight({ driver, onFinish }) {
  const userGender = useGameStore((s) => s.userGender);
  const userName = useGameStore((s) => s.userName);
  const wipeRubles = useGameStore((s) => s.wipeRubles);
  const applyCombatMultiplier = useRideStore((s) => s.applyCombatMultiplier);

  const [step, setStep] = useState('intro'); // intro -> rolling -> result
  const [playerRoll, setPlayerRoll] = useState(0);
  const [driverRoll, setDriverRoll] = useState(0);
  const [visualPlayerRoll, setVisualPlayerRoll] = useState('?');
  const [visualDriverRoll, setVisualDriverRoll] = useState('?');
  const [outcome, setOutcome] = useState(null);

  // Получаем статы классов
  const playerClass = GENDERS[userGender] || GENDERS.none;
  const dStats = DRIVER_STATS[driver.rarity] || DRIVER_STATS.consumer;

  // Функция броска
  const rollDice = (max) => Math.floor(Math.random() * max) + 1;

  const handleFight = () => {
    setStep('rolling');
    
    // Анимация крутящихся цифр
    const rollInterval = setInterval(() => {
      setVisualPlayerRoll(rollDice(playerClass.diceType));
      setVisualDriverRoll(rollDice(dStats.diceType));
    }, 100);

    // Анимация броска кубиков 2 секунды
    setTimeout(() => {
      clearInterval(rollInterval);
      const pRoll = rollDice(playerClass.diceType);
      const dRoll = rollDice(dStats.diceType);

      setPlayerRoll(pRoll);
      setDriverRoll(dRoll);

      // Определение исхода
      const pTotal = pRoll + playerClass.baseStat;
      const dTotal = dRoll + dStats.baseStat;

      let resultOutcome = '';

      if (pRoll === 1) {
        resultOutcome = 'CRIT_FAIL';
        wipeRubles('Критическая неудача в бою с водителем');
        applyCombatMultiplier(3);
      } else if (pRoll === playerClass.diceType) {
        resultOutcome = 'CRIT_SUCCESS';
        applyCombatMultiplier(0.7);
      } else if (pTotal >= dTotal + 5) {
        resultOutcome = 'BIG_WIN';
        applyCombatMultiplier(0.7); // Доп скидка
      } else if (pTotal >= dTotal) {
        resultOutcome = 'WIN';
        // Цена без изменений
        applyCombatMultiplier(1);
      } else {
        resultOutcome = 'LOSE';
        applyCombatMultiplier(1.5); // Платим больше
      }

      setOutcome(resultOutcome);
      setStep('result');
    }, 2000); // Увеличил задержку для эффекта
  };

  const getResultText = () => {
    switch(outcome) {
      case 'CRIT_FAIL': return 'КРИТИЧЕСКИЙ ПРОВАЛ! Водитель забрал все твои Я.Рубли и заставил платить х3!';
      case 'CRIT_SUCCESS': return 'КРИТИЧЕСКИЙ УСПЕХ! Водитель в шоке (скидка 30%)';
      case 'BIG_WIN': return 'БЕЗОГОВОРОЧНАЯ ПОБЕДА! Водитель уважает силу (скидка 30%)';
      case 'WIN': return 'ПОБЕДА! Ты отстоял свою честь (цена без изменений)';
      case 'LOSE': return 'ПОРАЖЕНИЕ. Водитель оказался крепче (ты платишь на 50% больше)';
      default: return '';
    }
  };

  const getResultColor = () => {
    switch(outcome) {
      case 'CRIT_FAIL': return '#ff0000';
      case 'LOSE': return '#ff4444';
      case 'CRIT_SUCCESS':
      case 'BIG_WIN': return '#00ff00';
      case 'WIN': return '#aaaaaa';
      default: return '#fff';
    }
  };

  return (
    <div className="card boss-fight-card" style={{ padding: '2rem', textAlign: 'center', marginTop: '1rem', border: '2px solid var(--accent)' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Финальная битва</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Ты доехал до конца, но водитель не хочет так просто отпускать тебя. Бросай кубики!
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {/* ИГРОК */}
        <div style={{ width: '45%' }}>
          <h3>{userName}</h3>
          <div style={{ fontSize: '3rem', margin: '1rem 0' }}>{playerClass.emoji}</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Класс: {playerClass.name}</p>
          <div style={{ background: '#222', padding: '0.5rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <p>Кубик: <strong>d{playerClass.diceType}</strong></p>
            <p>База: <strong>+{playerClass.baseStat}</strong></p>
          </div>
        </div>

        <div style={{ alignSelf: 'center', fontSize: '2rem', fontWeight: 'bold' }}>VS</div>

        {/* ВОДИТЕЛЬ */}
        <div style={{ width: '45%' }}>
          <h3>Водитель {driver.name}</h3>
          <img src={driver.image} alt="Driver" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: `2px solid var(--accent)`, filter: `hue-rotate(${driver.hue || 0}deg)`, margin: '1rem 0' }} />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Угроза: {dStats.title}</p>
          <div style={{ background: '#222', padding: '0.5rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <p>Кубик: <strong>d{dStats.diceType}</strong></p>
            <p>База: <strong>+{dStats.baseStat}</strong></p>
          </div>
        </div>
      </div>

      {step === 'intro' && (
        <button className="btn btn-primary" onClick={handleFight} style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
          🎲 В БОЙ!
        </button>
      )}

      {step === 'rolling' && (
        <div style={{ margin: '2rem 0' }}>
          <div style={{ fontSize: '1.5rem', color: '#ffb700', marginBottom: '1rem', animation: 'pulse 0.5s infinite' }}>
            🎲 Крутим кубики... 🎲
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '3rem' }}>
            <div className="rolling-dice" style={{ color: 'var(--accent)' }}>{visualPlayerRoll}</div>
            <div className="rolling-dice" style={{ color: 'var(--accent)' }}>{visualDriverRoll}</div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div style={{ animation: 'fadeIn 0.5s fade-in' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '2rem 0', fontSize: '1.2rem' }}>
            <div>
              <p>Выпало: <strong>{playerRoll}</strong></p>
              <p>Итого: <strong style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>{playerRoll + playerClass.baseStat}</strong></p>
            </div>
            <div>
              <p>Выпало: <strong>{driverRoll}</strong></p>
              <p>Итого: <strong style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>{driverRoll + dStats.baseStat}</strong></p>
            </div>
          </div>

          <h3 style={{ color: getResultColor(), marginBottom: '2rem' }}>
            {getResultText()}
          </h3>

          <button className="btn btn-primary" onClick={onFinish} style={{ width: '100%', padding: '1rem' }}>
            Оплатить и уйти
          </button>
        </div>
      )}

      {/* Инлайн-стили для трясущегося кубика */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes diceSpinAndShake {
          0% { transform: rotate(0deg) scale(1) translateY(0); }
          25% { transform: rotate(20deg) scale(1.3) translateY(-5px); }
          50% { transform: rotate(0deg) scale(1.1) translateY(0); }
          75% { transform: rotate(-20deg) scale(1.3) translateY(5px); }
          100% { transform: rotate(0deg) scale(1) translateY(0); }
        }
        .rolling-dice {
          animation: diceSpinAndShake 0.15s infinite;
          display: inline-block;
          text-shadow: 0 0 10px var(--accent);
          background: #222;
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 15px;
          border: 2px solid var(--text-secondary);
        }
      `}} />
    </div>
  );
}
