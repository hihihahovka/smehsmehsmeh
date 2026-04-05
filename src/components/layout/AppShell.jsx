import { useLocation, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { ArrowLeft } from 'lucide-react';
import LevelBadge from './LevelBadge';
import './AppShell.css';

/*
 * AppShell — обёртка всего приложения после регистрации.
 * - Устанавливает data-level на <body> для тем
 * - Показывает LevelBadge (всегда виден)
 * - Показывает marquee на уровне 0
 * - Показывает рекламу по уровню
 */
export default function AppShell({ children }) {
  const level = useGameStore((s) => s.level);
  const upgrades = useGameStore((s) => s.upgrades);
  const todayCancels = useGameStore((s) => s.todayCancels);
  const location = useLocation();
  const navigate = useNavigate();

  // Устанавливаем data-level на root для CSS-переменных
  document.documentElement.setAttribute('data-level', level);
  
  // Применяем купленные улучшения как дата-атрибуты для CSS
  document.documentElement.setAttribute('data-upgrade-color', upgrades.colorPalette ? 'true' : 'false');
  document.documentElement.setAttribute('data-upgrade-font', upgrades.normalFont ? 'true' : 'false');
  document.documentElement.setAttribute('data-upgrade-grid', upgrades.gridLayout ? 'true' : 'false');

  // Эффект "похмелья" при 3+ отменах сегодня
  const isHangover = todayCancels >= 3;

  return (
    <div className={`app-shell ${isHangover ? 'hangover' : ''}`}
         style={isHangover ? { '--blur-amount': '2px', '--shake-intensity': '1' } : {}}>
      
      {/* Универсальная верхняя панель навигации */}
      <header className="app-header">
        {location.pathname !== '/' && (
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Назад
          </button>
        )}
        <LevelBadge />
      </header>

      <main className="app-main">
        {children}
      </main>

      {/* Marquee на уровне 0 */}
      {level === 0 && (
        <div className="marquee-bar">
          <span>
            ★ ЛУЧШИЙ СЕРВИС ТАКСИ В МИРЕ ★ ДОВЕРЬТЕСЬ ЯНДЕКС СТОП ★ СКИДКИ ДО -500% ★ ТЕПЕРЬ С ПОКЕМОНАМИ ★ ЯНДЕКС СТОП — ВЫБОР ПРОФЕССИОНАЛОВ ★
          </span>
        </div>
      )}
    </div>
  );
}
