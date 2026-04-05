import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import DeviceDetector from '../components/ui/DeviceDetector';
import AntiComfortTariff from '../components/ui/AntiComfortTariff';
import AdvertBanner from '../components/ui/AdvertBanner';
import RunawayButton from '../components/ui/RunawayButton';

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
        {level === 0 ? '🚕 ЯНДЕКС СТОП 🚕' : 'Яндекс Стоп'}
      </h1>

      {/* Рекламный баннер */}
      <AdvertBanner />

      {/* Детектор устройства */}
      <DeviceDetector />

      {/* Выбор тарифа */}
      <AntiComfortTariff />

      {/* Убегающая кнопка */}
      <div style={{ position: 'relative', height: '80px', marginTop: '1rem', width: '100%' }}>
        <RunawayButton level={level} onClick={() => navigate('/order')}>
          {level === 0 ? '🎰 ЗАКАЗАТЬ (ЕСЛИ СМОЖЕШЬ)' : 'Заказать такси'}
        </RunawayButton>
      </div>

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
