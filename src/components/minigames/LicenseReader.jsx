import { useState, useEffect, useRef, useCallback } from 'react';

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

const LICENSE_TEXT =
  'Настоящим я торжественно клянусь страдать за свои же деньги ' +
  'Соглашаюсь оплачивать ожидание пока водитель пьет кофе в чужом дворе ' +
  'Разрешаю приложению списывать штраф за громкое дыхание ' +
  'и обязуюсь всегда ставить пять звезд даже если приехал в багажнике';

// Нормализация слова для сравнения
function normalize(word) {
  return word.toLowerCase().replace(/[^а-яёa-z0-9]/g, '');
}

// Fuzzy match: exact, or starts with 3+ same chars, or Levenshtein ≤ 2
function fuzzyMatch(a, b) {
  if (!a || !b) return false;
  if (a === b) return true;
  // prefix match (3+ chars)
  if (a.length >= 3 && b.length >= 3 && a.substring(0, 3) === b.substring(0, 3)) return true;
  // short word leniency
  if (a.length <= 2 || b.length <= 2) return a === b;
  // Levenshtein distance
  const lenA = a.length, lenB = b.length;
  if (Math.abs(lenA - lenB) > 2) return false;
  const dp = Array.from({ length: lenA + 1 }, (_, i) => Array(lenB + 1).fill(0));
  for (let i = 0; i <= lenA; i++) dp[i][0] = i;
  for (let j = 0; j <= lenB; j++) dp[0][j] = j;
  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
    }
  }
  return dp[lenA][lenB] <= 2;
}

// Разбиваем лицензию на слова
const LICENSE_WORDS = LICENSE_TEXT.split(/\s+/).map((w) => ({
  original: w,
  normalized: normalize(w),
}));

const THRESHOLD = 0.99; // 99% слов совпадают → успех

// =========== Стили ===========
const styles = {
  container: {
    maxWidth: 420,
    margin: '0 auto',
    textAlign: 'center',
  },
  textBox: {
    background: 'var(--bg-secondary)',
    padding: '1rem',
    borderRadius: 'var(--border-radius)',
    fontSize: '0.85rem',
    lineHeight: 1.8,
    margin: '0.75rem 0',
    textAlign: 'left',
    maxHeight: 220,
    overflowY: 'auto',
    border: '1px solid var(--border-color)',
  },
  word: {
    display: 'inline',
    padding: '1px 2px',
    borderRadius: 3,
    transition: 'background 0.3s, color 0.3s',
  },
  wordMatched: {
    background: '#22c55e',
    color: '#000',
    fontWeight: 700,
  },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0.75rem auto',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  micIdle: {
    background: 'var(--accent)',
    color: '#fff',
    boxShadow: '0 0 0 0 rgba(108,99,255,0)',
  },
  micActive: {
    background: '#ef4444',
    color: '#fff',
    animation: 'micPulse 1s ease-in-out infinite',
    boxShadow: '0 0 0 8px rgba(239,68,68,0.25)',
  },
  progressBar: {
    width: '100%',
    height: 8,
    background: 'var(--bg-secondary)',
    borderRadius: 4,
    overflow: 'hidden',
    margin: '0.5rem 0',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.4s ease, background 0.4s',
  },
  hint: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    margin: '0.25rem 0',
  },
  btnRow: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.75rem',
  },
  successBox: {
    padding: '1.5rem',
    textAlign: 'center',
  },
};

export default function LicenseReader({ onComplete, onSkip }) {
  const [matchedSet, setMatchedSet] = useState(new Set());
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [success, setSuccess] = useState(false);
  const recognitionRef = useRef(null);

  const matchPercent = matchedSet.size / LICENSE_WORDS.length;
  const matchPercentDisplay = Math.round(matchPercent * 100);

  // Проверка поддержки
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
    }
  }, []);

  // Process recognized words — SEQUENTIAL with fuzzy match + look-ahead
  const processTranscript = useCallback(
    (text) => {
      const spoken = text.split(/\s+/).map(normalize).filter(Boolean);
      setMatchedSet((prev) => {
        const next = new Set(prev);
        // Find the next expected word
        let nextExpected = 0;
        while (next.has(nextExpected) && nextExpected < LICENSE_WORDS.length) nextExpected++;

        for (const spokenWord of spoken) {
          if (!spokenWord) continue;
          if (nextExpected >= LICENSE_WORDS.length) break;

          // Try exact position first
          if (fuzzyMatch(LICENSE_WORDS[nextExpected].normalized, spokenWord)) {
            next.add(nextExpected);
            nextExpected++;
            while (nextExpected < LICENSE_WORDS.length && next.has(nextExpected)) nextExpected++;
            continue;
          }

          // Look ahead up to 3 words — only skip tiny words (prepositions like «я», «с», «на»)
          for (let ahead = 1; ahead <= 2 && nextExpected + ahead < LICENSE_WORDS.length; ahead++) {
            // Only skip if ALL words in between are tiny (≤2 chars)
            let allSkippedAreTiny = true;
            for (let s = 0; s < ahead; s++) {
              if (LICENSE_WORDS[nextExpected + s].normalized.length > 2) {
                allSkippedAreTiny = false;
                break;
              }
            }
            if (!allSkippedAreTiny) break;

            if (fuzzyMatch(LICENSE_WORDS[nextExpected + ahead].normalized, spokenWord)) {
              for (let s = 0; s <= ahead; s++) {
                next.add(nextExpected + s);
              }
              nextExpected += ahead + 1;
              while (nextExpected < LICENSE_WORDS.length && next.has(nextExpected)) nextExpected++;
              break;
            }
          }
        }
        return next;
      });
    },
    []
  );

  // Start / stop recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      // Manual stop — nullify ref first so onend doesn't restart
      const old = recognitionRef.current;
      recognitionRef.current = null;
      old?.stop();
      setIsListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = 'ru-RU';
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 3;

    rec.onresult = (event) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + ' ';
        for (let a = 1; a < event.results[i].length; a++) {
          processTranscript(event.results[i][a].transcript);
        }
      }
      setTranscript(fullTranscript.trim());
      processTranscript(fullTranscript);
    };

    rec.onerror = (e) => {
      console.warn('Speech error:', e.error);
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        recognitionRef.current = null;
        setIsListening(false);
      }
    };

    rec.onend = () => {
      // Only restart if ref still points to this instance (not manually stopped)
      if (recognitionRef.current === rec) {
        try { rec.start(); } catch {
          recognitionRef.current = null;
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [isListening, processTranscript]);

  // Check threshold
  useEffect(() => {
    if (matchPercent >= THRESHOLD && !success) {
      setSuccess(true);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [matchPercent, success]);

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  // ---- Success screen ----
  if (success) {
    return (
      <div className="card" style={styles.successBox}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
        <h3 style={{ color: '#22c55e', marginBottom: '0.25rem' }}>Лицензия прочитана!</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
          Распознано {matchPercentDisplay}% текста.
        </p>
        <button
          className="btn btn-primary"
          onClick={onComplete}
          style={{ width: '100%' }}
        >
          Продолжить
        </button>
      </div>
    );
  }

  // ---- Not supported fallback ----
  if (!supported) {
    return (
      <div className="card" style={styles.container}>
        <h3>Чтение лицензии вслух</h3>
        <p style={{ fontSize: '0.8rem', color: '#f87171', margin: '1rem 0' }}>
          Ваш браузер не поддерживает Web Speech API 😢<br />
          Используйте Chrome / Edge для распознавания речи.
        </p>
        <div style={styles.btnRow}>
          <button className="btn btn-primary" onClick={onComplete} style={{ flex: 1 }}>
            Пропустить (без бонуса)
          </button>
        </div>
      </div>
    );
  }

  // ---- Main UI ----
  const progressColor =
    matchPercent >= THRESHOLD ? '#22c55e' :
      matchPercent >= 0.4 ? '#eab308' : 'var(--accent)';

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { box-shadow: 0 0 0 14px rgba(239,68,68,0); }
        }
      `}</style>

      {/* Текст лицензии с подсветкой */}
      <div style={styles.textBox}>
        {LICENSE_WORDS.map((w, i) => {
          const matched = matchedSet.has(i);
          return (
            <span key={i}>
              <span
                style={{
                  ...styles.word,
                  ...(matched ? styles.wordMatched : {}),
                }}
              >
                {w.original}
              </span>{' '}
            </span>
          );
        })}
      </div>

      {/* Прогресс-бар */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${matchPercentDisplay}%`,
            background: progressColor,
          }}
        />
      </div>
      <p style={styles.hint}>
        Распознано: {matchedSet.size} / {LICENSE_WORDS.length} слов ({matchPercentDisplay}%) — нужно {Math.round(THRESHOLD * 100)}%
      </p>

      {/* Кнопка микрофона */}
      <button
        style={{
          ...styles.micBtn,
          ...(isListening ? styles.micActive : styles.micIdle),
        }}
        onClick={toggleListening}
        title={isListening ? 'Остановить запись' : 'Начать запись'}
      >
        {isListening ? '⏹' : '🎤'}
      </button>
      <p style={styles.hint}>
        {isListening ? '🔴 Слушаю... говорите!' : 'Нажми на микрофон и начни читать'}
      </p>

    </div>
  );
}
