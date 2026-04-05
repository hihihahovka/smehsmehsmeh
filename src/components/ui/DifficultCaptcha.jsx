/*
 * =============================================
 *  КАПЧА ИЗ 2003 ГОДА
 *  Ответственный: Участник 1 (Онбординг)
 * =============================================
 *
 *  TODO:
 *  - [ ] Canvas с рандомным текстом (5-6 символов)
 *  - [ ] Искажение: rotate, skew, шум, зачёркивания
 *  - [ ] 3 попытки, потом «Может, ты робот?»
 *  - [ ] +10 ЯР за прохождение с первой попытки
 */

export default function DifficultCaptcha({ onPass }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <p>[TODO: Капча-Canvas — Участник 1]</p>
      <button className="btn btn-primary" onClick={onPass}>
        Заглушка: пропустить
      </button>
    </div>
  );
}
