/*
 * Участник 2: Выбор тарифа
 * Антикомфорт дает шансон, не закрывается окно и цена х2.
 */

export default function AntiComfortTariff() {
  return (
    <div className="card anti-comfort-tariff" style={{ marginTop: '1rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Тариф «Антикомфорт»</p>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <ul style={{ textAlign: 'left', margin: '0.5rem auto', display: 'inline-block' }}>
          <li>🚬 Шансон на полную</li>
          <li>💨 Окно всегда открыто</li>
          <li>💸 Цена x2</li>
        </ul>
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }}>Выбрать этот ад</button>
    </div>
  );
}
