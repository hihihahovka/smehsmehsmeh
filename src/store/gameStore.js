import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/*
 * ==========================================
 *  ЯНДЕКС МИНУС — Главный Game Store
 * ==========================================
 *  Вся логика прогресса, ЯР, уровней и лога.
 *  Используется ВСЕМИ компонентами через хук:
 *    const level = useGameStore(s => s.level);
 */

// --- Конфигурация уровней ---
export const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000];
export const LEVEL_NAMES = ['ЖЕРТВА', 'ТЕРПИЛО', 'КЛИЕНТ', 'ЛОЯЛЬНЫЙ', 'ИЗБРАННЫЙ'];

// --- Конфигурация гендеров ---
// Каждый гендер: 2 характеристики. Среднее арифметическое = 10 (сумма = 20).
export const GENDERS = {
  'вертолёт': {
    name: 'Боевой вертолёт Апач', emoji: '🚁',
    bonus: 'Скидка на полёты',    penalty: 'Шум в салоне',
    stats: { авторитет: +18, чистота: +2 },
  },
  'скуф': {
    name: 'Истинный скуф',        emoji: '🍺',
    bonus: 'Водитель-братишка',   penalty: 'Платное пиво',
    stats: { общение: +17, аккуратность: +3 },
  },
  'масик': {
    name: 'Масик',                emoji: '🧸',
    bonus: 'Всегда комфорт плюс', penalty: 'Слишком дорого',
    stats: { чистота: +12, аккуратность: +8 },
  },
  'тюбик': {
    name: 'Тюбик',                emoji: '🧴',
    bonus: 'Молчаливый водитель', penalty: 'Нет сдачи',
    stats: { аккуратность: +15, общение: +5 },
  },
  'разведёнка': {
    name: 'Разведёнка с Принцем', emoji: '👸',
    bonus: '+3 к детям в машине', penalty: 'Алименты списываются с баланса',
    stats: { общение: +14, авторитет: +6 },
  },
  'программист': {
    name: 'Программист 1С',       emoji: '💻',
    bonus: 'Обновление конфигурации', penalty: 'Не работает в выходных',
    stats: { аккуратность: +19, авторитет: +1 },
  },
  'эльф': {
    name: 'Эльф 80 уровня',       emoji: '🧝',
    bonus: 'Путешествие по лесу', penalty: 'Сложен в общении',
    stats: { чистота: +11, общение: +9 },
  },
  'гопник': {
    name: 'Культурный гопник',    emoji: '🥀',
    bonus: 'Скидка у ларька',     penalty: 'Водитель боится',
    stats: { авторитет: +19, чистота: +1 },
  },
  'неопределился': {
    name: 'Не определился',       emoji: '❓',
    bonus: 'Сюрприз',             penalty: 'Рандомный дебафф',
    stats: { общение: +10, авторитет: +10 },
  },
};

// --- Вычисление уровня из ЯР ---
function calcLevel(rubles) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (rubles >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 0;
}

// --- Store ---
export const useGameStore = create(
  persist(
    (set, get) => ({
      // === Состояние регистрации ===
      isRegistered: false,
      userName: '',
      userGender: null,        // 'apache' | 'skuf' | 'masik' и т.д.
      monthlyIncome: 0,
      licenseRead: false,

      // === Прогресс ===
      yandexRubles: 0,
      level: 0,
      streak: 0,
      lastLoginDate: null,

      // === Статистика ===
      totalRides: 0,
      cancelCount: 0,
      todayCancels: 0,

      // === Купленные улучшения ===
      upgrades: {
        colorPalette: false,
        gridLayout: false,
        normalFont: false,
        noAds: false,
        autoPedals: false,
        memory: false,
        liveSupport: false,
        mapChunks: 0,  // 0..10
      },

      // === Колода водителей ===
      driverCards: [],

      // === Амнезия ===
      amnesiaActive: false,
      fakeUserName: null,

      // === Лог действий (для экрана «Статистика деградации») ===
      actionLog: [],

      // ============================
      //  ACTIONS
      // ============================

      // --- Регистрация ---
      register: ({ userName, userGender, monthlyIncome }) => set({
        isRegistered: true,
        userName,
        userGender,
        monthlyIncome,
        lastLoginDate: new Date().toISOString().slice(0, 10),
        streak: 1,
      }),

      // --- Прочитал лицензию вслух ---
      completeLicense: () => {
        const { licenseRead } = get();
        if (licenseRead) return; // already done
        set({ licenseRead: true });
        get().addRubles(100, 'Прочитал лицензионное соглашение вслух');
      },

      // --- Добавить / списать ЯР ---
      addRubles: (amount, reason) => set((state) => {
        const newRubles = Math.max(0, state.yandexRubles + amount);
        const newLevel = calcLevel(newRubles);
        const entry = {
          id: Date.now(),
          delta: amount,
          reason,
          balance: newRubles,
          timestamp: new Date().toISOString(),
        };
        return {
          yandexRubles: newRubles,
          level: newLevel,
          actionLog: [...state.actionLog, entry],
        };
      }),

      // --- Полное списание ЯР (критическая неудача в бою) ---
      wipeRubles: (reason) => set((state) => {
        const newRubles = 0;
        const newLevel = calcLevel(newRubles);
        const entry = {
          id: Date.now(),
          delta: -state.yandexRubles,
          reason,
          balance: newRubles,
          timestamp: new Date().toISOString(),
        };
        return {
          yandexRubles: newRubles,
          level: newLevel,
          actionLog: [...state.actionLog, entry],
        };
      }),

      // --- Стрик (вызывать при открытии аппа) ---
      checkStreak: () => set((state) => {
        const today = new Date().toISOString().slice(0, 10);
        if (state.lastLoginDate === today) return {};

        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (state.lastLoginDate === yesterday) {
          // продолжение стрика
          const newStreak = state.streak + 1;
          return {
            streak: newStreak,
            lastLoginDate: today,
            todayCancels: 0,
          };
        } else {
          // стрик сломан
          return {
            streak: 1,
            lastLoginDate: today,
            amnesiaActive: true,
            todayCancels: 0,
            fakeUserName: getRandomName(),
          };
        }
      }),

      // --- Завершение поездки ---
      completeRide: (driverCard) => set((state) => ({
        totalRides: state.totalRides + 1,
        driverCards: [...state.driverCards, driverCard],
      })),

      // --- Отмена (инкремент счётчика) ---
      incrementCancel: () => set((state) => ({
        cancelCount: state.cancelCount + 1,
        todayCancels: state.todayCancels + 1,
      })),

      // --- Покупка улучшения ---
      buyUpgrade: (key, cost) => {
        const { yandexRubles, upgrades } = get();
        if (yandexRubles < cost) return false;
        if (key === 'mapChunks') {
          if (upgrades.mapChunks >= 10) return false;
          set((state) => ({
            upgrades: { ...state.upgrades, mapChunks: state.upgrades.mapChunks + 1 },
          }));
        } else {
          if (upgrades[key]) return false;
          set((state) => ({
            upgrades: { ...state.upgrades, [key]: true },
          }));
        }
        get().addRubles(-cost, `Покупка: ${key}`);
        return true;
      },

      // --- Вылечить амнезию ---
      cureAmnesia: () => set({
        amnesiaActive: false,
        fakeUserName: null,
      }),

      // --- Полный сброс (для дебага) ---
      resetAll: () => set({
        isRegistered: false,
        userName: '',
        userGender: null,
        monthlyIncome: 0,
        licenseRead: false,
        yandexRubles: 0,
        level: 0,
        streak: 0,
        lastLoginDate: null,
        totalRides: 0,
        cancelCount: 0,
        todayCancels: 0,
        upgrades: {
          colorPalette: false,
          gridLayout: false,
          normalFont: false,
          noAds: false,
          autoPedals: false,
          memory: false,
          liveSupport: false,
          mapChunks: 0,
        },
        driverCards: [],
        amnesiaActive: false,
        fakeUserName: null,
        actionLog: [],
      }),
    }),
    {
      name: 'yandex-minus-storage', // ключ в localStorage
    }
  )
);

// --- Утилита: случайное имя для «Амнезии» ---
const RANDOM_NAMES = [
  'Геннадий', 'Светлана Владимировна', 'Олег Батькович',
  'Клеопатра', 'Артемий Лебедев', 'Шрек', 'Владислав',
  'Пользователь #48291', 'Незнакомец', 'Дорогой друг',
  'Абонент недоступен', 'Гость из Саратова',
];

function getRandomName() {
  return RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
}
