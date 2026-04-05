import { useGameStore, LEVEL_NAMES } from '../../store/gameStore';
import './LevelBadge.css';

/*
 * LevelBadge — всегда виден в правом верхнем углу.
 * Показывает: Я-Баллы, уровень, стрик.
 */
export default function LevelBadge() {
  const yandexRubles = useGameStore((s) => s.yandexRubles);
  const level = useGameStore((s) => s.level);
  const streak = useGameStore((s) => s.streak);
  const amnesiaActive = useGameStore((s) => s.amnesiaActive);
  const fakeUserName = useGameStore((s) => s.fakeUserName);
  const userName = useGameStore((s) => s.userName);

  const displayName = amnesiaActive ? fakeUserName : userName;

  return (
    <div className="level-badge" id="level-badge">
      <div className="level-badge__name">{displayName}</div>
      <div className="level-badge__level">
        Ур. {level}: {LEVEL_NAMES[level]}
      </div>
      <div className="level-badge__rubles">
        {yandexRubles} Я-Баллы
      </div>
      {streak > 1 && (
        <div className="level-badge__streak">🔥 {streak} дн.</div>
      )}
    </div>
  );
}
