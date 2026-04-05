/*
 * =============================================
 *  ЧТЕНИЕ ЛИЦЕНЗИИ ВСЛУХ (Web Speech API)
 *  Ответственный: Участник 1 (Онбординг)
 * =============================================
 *
 *  TODO:
 *  - [ ] SpeechRecognition API (webkitSpeechRecognition)
 *  - [ ] Показать текст, который нужно прочитать
 *  - [ ] Real-time подсветка распознанных слов
 *  - [ ] Порог: 70%+ совпадения → успех
 *  - [ ] Визуальный индикатор: микрофон активен
 *  - [ ] +100 Я-Баллы за чтение
 */

export default function LicenseReader({ onComplete, onSkip }) {
  return (
    <div className="card">
      <h3>Прочитайте вслух:</h3>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: '1rem',
        borderRadius: 'var(--border-radius)',
        fontSize: '0.85rem',
        lineHeight: 1.6,
        margin: '1rem 0',
        color: 'var(--text-secondary)',
      }}>
        «Настоящим я, пользователь сервиса Яндекс Минус, добровольно и осознанно
        соглашаюсь на то, что мой пользовательский опыт будет планомерно ухудшаться
        с каждым использованием данного приложения. Я понимаю, что интерфейс может
        содержать убегающие кнопки, некорректные цены и водителей-призраков.»
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
        [TODO: Web Speech API — микрофон + распознавание]
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button className="btn btn-primary" onClick={onComplete} style={{ flex: 1 }}>
          ✅ Прочитано (заглушка)
        </button>
        <button className="btn btn-secondary" onClick={onSkip} style={{ flex: 1 }}>
          Пропустить
        </button>
      </div>
    </div>
  );
}
