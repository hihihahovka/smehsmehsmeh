import { useEffect, useState } from 'react';

/*
 * Участник 3: Карта Москвы с покемонами и симуляция поездки
 * Как только на экране (или до него) открутилась рулетка и выпал водитель:
 * 1. Водитель рандомно спавнится на карте Москвы.
 * 2. Маршрут от него к клиенту строится принудительно через точки покемонов.
 * 3. Запускается симуляция движения его машинки по этому маршруту.
 * 4. Таксист не завершит маршрут, пока не «проедет» всех покемонов.
 * Рекомендуется использовать Leaflet или Yandex.Maps API.
 */

export default function PokemonMap({ onAllCaught }) {
  const [caught, setCaught] = useState(0);

  // TODO: Интеграция Canvas или Leaflet

  return (
    <div className="card pokemon-map" style={{ marginTop: '1rem', opacity: 0.9 }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Следим за водителем...
      </p>
      <div style={{ padding: '2rem', background: '#e0e0e0', borderRadius: '8px', color: '#000', textAlign: 'center', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <p style={{ fontWeight: 'bold' }}>🗺️ [Интерактивная Карта Москвы]</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          *Рулетка выбрала водителя — он заспавнился на севере Москвы*<br/>
          *Симуляция движения: маршрут перестроен, чтобы захватить Пикачу*
        </p>
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>
        Собрано: {caught} / 3
      </p>
    </div>
  );
}
