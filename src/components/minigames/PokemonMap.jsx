import { useEffect, useState } from 'react';

/*
 * Участник 3: Карта с покемонами
 * Таксист не завершит маршрут, пока не проедет хотя бы одного покемона на карте.
 */

export default function PokemonMap({ onAllCaught }) {
  const [caught, setCaught] = useState(0);

  // TODO: Интеграция Canvas или Leaflet с покемонами

  return (
    <div className="card pokemon-map" style={{ marginTop: '1rem', opacity: 0.9 }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Таксист свернул на охоту!
      </p>
      <div style={{ padding: '2rem', background: '#222', borderRadius: '8px', color: '#fff', textAlign: 'center' }}>
        [Здесь будет интерактивная карта с рандомным появлением покемонов]
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--accent)' }}>
        Собрано: {caught} / 3
      </p>
    </div>
  );
}
