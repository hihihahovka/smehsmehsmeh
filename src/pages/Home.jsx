import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import DeviceDetector from '../components/ui/DeviceDetector';
import AntiComfortTariff from '../components/ui/AntiComfortTariff';

/*
 * =============================================
 *  ГЛАВНЫЙ ЭКРАН
 *  Ответственный: Участник 2 (Главный экран + рулетки)
 * =============================================
 *
 *  TODO (Участник 2):
 *  - [ ] Убегающая кнопка «Заказать» (RunawayButton)
 *  - [ ] Реклама на 80% экрана (ур.0), 40% (ур.1), скрыта (ур.2+)
 *  - [ ] ДнД-кубик d20 (визуальный бросок + анимация)
 *  - [ ] Карточка тарифов: Рулетка / Антискидка / Антикомфорт
 *  - [ ] Детектор устройства (iPhone / Android плашка)
 *  - [ ] Навигация: Магазин, Колода, Статистика, Поддержка
 */

export default function HomePage() {
  const level = useGameStore((s) => s.level);
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {level === 0 ? '🚕 ЯНДЕКС МИНУС 🚕' : 'Яндекс Минус'}
      </h1>

      {/* TODO: AdvertBanner — реклама по уровню */}
      {level <= 1 && (
        <div className="card" style={{
          minHeight: level === 0 ? '300px' : '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff3300, #ff00ff)',
          fontSize: level === 0 ? '1.3rem' : '0.9rem',
          textAlign: 'center',
        }}>
          🔥 МЕГА-АКЦИЯ! СКИДКИ МИНУС 500%! 🔥<br/>
          [TODO: рекламный баннер — Участник 2]
        </div>
      )}

      {/* Детектор устройства */}
      <DeviceDetector />

      {/* Выбор тарифа */}
      <AntiComfortTariff />

      {/* TODO: RunawayButton + заглушка */}
      <button
        className="btn btn-primary"
        onClick={() => navigate('/order')}
        style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginTop: '1rem' }}
      >
        {level === 0 ? '🎰 ЗАКАЗАТЬ (ЕСЛИ СМОЖЕШЬ)' : 'Заказать такси'}
      </button>

      {/* Навигация */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/shop')}>🛒 Магазин</button>
        <button className="btn btn-secondary" onClick={() => navigate('/deck')}>🃏 Колода</button>
        <button className="btn btn-secondary" onClick={() => navigate('/stats')}>📊 Стата</button>
        <button className="btn btn-secondary" onClick={() => navigate('/support')}>💬 Поддержка</button>
      </div>
    </div>
  );
}
