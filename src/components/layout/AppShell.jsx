import { useGameStore } from '../../store/gameStore';
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
  const todayCancels = useGameStore((s) => s.todayCancels);

  // Устанавливаем data-level на root для CSS-переменных
  document.documentElement.setAttribute('data-level', level);

  // Эффект "похмелья" при 3+ отменах сегодня
  const isHangover = todayCancels >= 3;

  return (
    <div className={`app-shell ${isHangover ? 'hangover' : ''}`}
         style={isHangover ? { '--blur-amount': '2px', '--shake-intensity': '1' } : {}}>
      <LevelBadge />

      <main className="app-main">
        {children}
      </main>

      {/* Marquee на уровне 0 */}
      {level === 0 && (
        <div className="marquee-bar">
          <span>
            ★ ЛУЧШИЙ СЕРВИС ТАКСИ В МИРЕ ★ ДОВЕРЬТЕСЬ ЯНДЕКС МИНУС ★ СКИДКИ ДО -500% ★ ТЕПЕРЬ С ПОКЕМОНАМИ ★ ЯНДЕКС МИНУС — ВЫБОР ПРОФЕССИОНАЛОВ ★
          </span>
        </div>
      )}
    </div>
  );
}
