/*
 * =============================================
 *  РУЛЕТКА ЦЕН
 *  Ответственный: Участник 2
 * =============================================
 *
 *  TODO:
 *  - [ ] Барабан с ценами (множитель ×0.1 — ×10)
 *  - [ ] Анимация прокрутки
 *  - [ ] Callback onResult(price)
 */

export default function PriceRoulette({ basePrice, onResult }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
      <p>[TODO: Рулетка цен — Участник 2]</p>
      <button className="btn btn-primary" onClick={() => onResult?.(basePrice)}>
        Крутить
      </button>
    </div>
  );
}
