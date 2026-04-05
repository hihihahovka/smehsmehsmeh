/*
 * =============================================
 *  АКСЕЛЕРОМЕТР-АЛКОТЕСТЕР
 *  Ответственный: Участник 3 (Мини-игры)
 * =============================================
 *
 *  TODO:
 *  - [ ] DeviceMotion API для акселерометра
 *  - [ ] Шарик на canvas, который нужно удержать в центре
 *  - [ ] Таймер: 5 сек стабильности = прошёл
 *  - [ ] Или: летающие объекты, по которым нужно тапать
 */

export default function BalanceGame({ onComplete }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <h3>Алкотестер</h3>
      <p>[TODO: Акселерометр / балансировка — Участник 3]</p>
      <button className="btn btn-primary" onClick={onComplete}>
        Заглушка: Протрезвел
      </button>
    </div>
  );
}
