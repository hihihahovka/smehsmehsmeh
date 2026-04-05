import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, GENDERS } from '../store/gameStore';
import DifficultCaptcha from '../components/ui/DifficultCaptcha';
import PrayDetector from '../components/minigames/PrayDetector';
import LightningBorder from '../components/ui/LightningBorder';
import LicenseReader from '../components/minigames/LicenseReader';
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
  const [showPrayDetector, setShowPrayDetector] = useState(false);

  const register = useGameStore((s) => s.register);
  const addRubles = useGameStore((s) => s.addRubles);
  const completeLicense = useGameStore((s) => s.completeLicense);
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
        <div className="registration-step">
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Шаг 1: Докажи, что ты человек</h2>
          <DifficultCaptcha onPass={() => setStep(1)} />
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
              <div
                key={key}
                className={`class-card-wrapper ${selectedGender === key ? 'selected' : ''}`}
                style={{ position: 'relative' }}
              >
                <LightningBorder active={selectedGender === key}>
                  <button
                    className={`class-card ${selectedGender === key ? 'selected' : ''}`}
                    onClick={() => setSelectedGender(key)}
                  >
                    <span className="class-emoji">{cls.emoji}</span>
                    <span className="class-name">{cls.name}</span>
                    {Object.entries(cls.stats).map(([stat, val]) => {
                      const isString = typeof val === 'string';
                      const color = isString ? '#f87171' : (val > 10 ? '#4ade80' : val < 10 ? '#f87171' : 'var(--text-secondary)');
                      return (
                        <span
                          key={stat}
                          style={{ fontSize: '0.65rem', fontWeight: 600, color }}
                        >
                          {isString ? `${stat}: ${val}` : `${stat}: ${val}`}
                        </span>
                      );
                    })}
                  </button>
                </LightningBorder>
              </div>
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

      {/* Шаг 2: Обязательная Молитва */}
      {step === 2 && (
        <div className="card registration-step" style={{ textAlign: 'center' }}>
          <h2>Шаг 3: Духовный обряд</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Прежде чем продолжить, ты должен доказать свою преданность сервису.
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowPrayDetector(true)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            🙏 Помолиться великому Яндексу
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={() => {
              addRubles(-50, "Пропуск обязательной молитвы");
              setStep(3);
            }}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            ⏭ Пропустить (Грех, -50 Я-баллов)
          </button>

          {showPrayDetector && (
            <PrayDetector 
              onSuccess={() => {
                setShowPrayDetector(false);
                addRubles(100, "Благословение при регистрации");
                setStep(3);
              }}
              onCancel={() => {
                setShowPrayDetector(false);
                addRubles(-50, "Отказ от молитвы");
                setStep(3);
              }}
            />
          )}
        </div>
      )}

      {/* Шаг 3: Доход */}
      {step === 3 && (
        <div className="card registration-step">
          <h2>Шаг 4: Сколько зарабатываешь?</h2>
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
            onClick={() => setStep(4)}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            Далее
          </button>
        </div>
      )}

      {/* Шаг 4: Лицензионное соглашение */}
      {step === 4 && (
        <div className="card registration-step">
          <h2>Лицензионное соглашение</h2>
          <LicenseReader
            onComplete={() => {
              completeLicense();
              handleFinish();
            }}
            onSkip={handleFinish}
          />
        </div>
      )}
    </div>
  );
}
