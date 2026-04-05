import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, GENDERS } from '../store/gameStore';
import './Registration.css';

/*
 * =============================================
 *  СТРАНИЦА РЕГИСТРАЦИИ
 *  Ответственный: Участник 1 (Онбординг)
 * =============================================
 *
 *  Шаги:
 *  1. Капча (DifficultCaptcha)
 *  2. Выбор гендера
 *  3. Слайдер дохода
 *  4. Чтение лицензии вслух (LicenseReader)
 *
 *  TODO (Участник 1):
 *  - [ ] Реализовать компонент DifficultCaptcha
 *  - [ ] Стилизовать выбор гендера (карточки с анимацией)
 *  - [ ] Подключить слайдер дохода с визуальной обратной связью
 *  - [ ] Интегрировать LicenseReader (Web Speech API)
 *  - [ ] Добавить визуальные эффекты (glitch, шум, тряска)
 */

export default function RegistrationPage() {
  const [step, setStep] = useState(0);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [income, setIncome] = useState(50000);
  const [name, setName] = useState('');

  const register = useGameStore((s) => s.register);
  const navigate = useNavigate();

  const handleFinish = () => {
    if (!name || !selectedGender) return;
    register({
      userName: name,
      userGender: selectedGender,
      monthlyIncome: income,
    });
    navigate('/');
  };

  return (
    <div className="page-container registration-page">
      <h1 className="registration-title">ЯНДЕКС МИНУС</h1>
      <p className="registration-subtitle">Регистрация нового страдальца</p>

      {/* Шаг 0: Капча */}
      {step === 0 && (
        <div className="card registration-step">
          <h2>Шаг 1: Докажи, что ты человек</h2>
          {/* TODO: заменить на DifficultCaptcha */}
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            [Тут будет ужасная капча из 2003 года]
          </p>
          <button className="btn btn-primary" onClick={() => setStep(1)}>
            Пропустить (заглушка)
          </button>
        </div>
      )}

      {/* Шаг 1: Имя + Гендер */}
      {step === 1 && (
        <div className="card registration-step">
          <h2>Шаг 2: Выбери свой гендер</h2>

          <label className="input-label">Имя</label>
          <input
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введи своё имя"
          />

          <label className="input-label" style={{ marginTop: '1rem' }}>Выбери гендер</label>
          <div className="class-grid" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(GENDERS).map(([key, cls]) => (
              <button
                key={key}
                className={`class-card ${selectedGender === key ? 'selected' : ''}`}
                onClick={() => setSelectedGender(key)}
              >
                <span className="class-emoji">{cls.emoji}</span>
                <span className="class-name">{cls.name}</span>
                <span className="class-bonus">+ {cls.bonus}</span>
                <span className="class-penalty">− {cls.penalty}</span>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => name && selectedGender && setStep(2)}
            disabled={!name || !selectedGender}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Далее
          </button>
        </div>
      )}

      {/* Шаг 2: Доход */}
      {step === 2 && (
        <div className="card registration-step">
          <h2>Шаг 3: Сколько зарабатываешь?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            Мы используем это для «настройки цен» (формирования антискидки)
          </p>
          <div className="income-display">
            {income.toLocaleString('ru-RU')} ₽/мес
          </div>
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="income-slider"
          />
          <button
            className="btn btn-primary"
            onClick={() => setStep(3)}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Далее
          </button>
        </div>
      )}

      {/* Шаг 3: Лицензионное соглашение */}
      {step === 3 && (
        <div className="card registration-step">
          <h2>Шаг 4: Лицензионное соглашение</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            Прочитай вслух для бонуса +100 ЯР, или пропусти.
          </p>
          {/* TODO: заменить на LicenseReader с Web Speech API */}
          <div className="license-text">
            Настоящим я, пользователь сервиса «Яндекс Минус», добровольно и осознанно
            соглашаюсь на то, что мой пользовательский опыт будет планомерно ухудшаться
            с каждым использованием данного приложения...
          </div>
          <button
            className="btn btn-primary"
            onClick={handleFinish}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Принять и войти
          </button>
        </div>
      )}
    </div>
  );
}
