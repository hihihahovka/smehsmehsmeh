import { useState } from 'react';

/*
 * Участник 2: Режим ВМЕСТЕ
 * Отряд для драки с водителем. Ребенок дает дебафф.
 */

export default function SquadSelector() {
  const [squad, setSquad] = useState([]);

  const toggleMember = (member) => {
    if (squad.includes(member)) {
      setSquad(squad.filter(m => m !== member));
    } else {
      setSquad([...squad, member]);
    }
  };

  return (
    <div className="card squad-selector" style={{ marginTop: '1rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Режим «ВМЕСТЕ»</p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Собери отряд для файта с водителем. Внимание: ребенок в пати — дебафф!
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {['Танк', 'Хилер', 'ДД', 'Ребёнок'].map(m => (
          <button 
            key={m}
            className={`btn ${squad.includes(m) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => toggleMember(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
