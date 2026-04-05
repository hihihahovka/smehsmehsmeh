import { create } from 'zustand';

/*
 * Стейт текущей поездки.
 * Живёт только в рантайме (без persist).
 */
export const useRideStore = create((set) => ({
  // Этапы: idle -> ordering -> waiting -> riding -> combat -> done
  phase: 'idle',

  // Адрес
  address: null,
  toAddress: null,
  fromSheremetyevo: false,

  // Тариф / водитель
  selectedTariff: null,
  driverCard: null,
  d20Result: null,
  finalPrice: 0,

  // Таймеры ожидания
  waitStartTime: null,
  pedalScore: 0,

  memeDiscount: 0,

  // --- Actions ---
  setAddress: (address, fromSheremetyevo = false) =>
    set({ address, fromSheremetyevo }),
  setToAddress: (toAddress) => set({ toAddress }),

  setTariff: (tariff) => set({ selectedTariff: tariff }),
  setDriver: (card) => set({ driverCard: card }),
  setD20: (result) => set({ d20Result: result }),
  setPrice: (price) => set({ finalPrice: price }),
  applyMemeDiscount: (amount) => set({ memeDiscount: amount }),

  startWaiting: () => set({ phase: 'waiting', waitStartTime: Date.now() }),
  startRiding: () => set({ phase: 'riding' }),
  startCombat: () => set({ phase: 'combat' }),
  finishRide: () => set({ phase: 'done' }),

  startOrder: () => set({ phase: 'ordering' }),
  
  applyCombatMultiplier: (multiplier) => set((s) => ({
    finalPrice: Math.round(s.finalPrice * multiplier)
  })),

  resetRide: () => set({
    phase: 'idle',
    address: null,
    toAddress: null,
    fromSheremetyevo: false,
    selectedTariff: null,
    driverCard: null,
    d20Result: null,
    finalPrice: 0,
    memeDiscount: 0,
    waitStartTime: null,
    pedalScore: 0,
  }),

  addPedalPoint: () => set((s) => ({ pedalScore: s.pedalScore + 1 })),
}));
