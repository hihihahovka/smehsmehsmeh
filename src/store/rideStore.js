import { create } from 'zustand';

/*
 * Стейт текущей поездки.
 * Живёт только в рантайме (без persist).
 */
export const useRideStore = create((set) => ({
  // Этапы: idle -> ordering -> waiting -> riding -> done
  phase: 'idle',

  // Адрес
  address: null,
  fromSheremetyevo: false,

  // Тариф / водитель
  selectedTariff: null,
  driverCard: null,
  d20Result: null,
  finalPrice: 0,

  // Таймеры ожидания
  waitStartTime: null,
  pedalScore: 0,

  // --- Actions ---
  setAddress: (address, fromSheremetyevo = false) =>
    set({ address, fromSheremetyevo }),

  setTariff: (tariff) => set({ selectedTariff: tariff }),
  setDriver: (card) => set({ driverCard: card }),
  setD20: (result) => set({ d20Result: result }),
  setPrice: (price) => set({ finalPrice: price }),

  startWaiting: () => set({ phase: 'waiting', waitStartTime: Date.now() }),
  startRiding: () => set({ phase: 'riding' }),
  finishRide: () => set({ phase: 'done' }),

  startOrder: () => set({ phase: 'ordering' }),

  resetRide: () => set({
    phase: 'idle',
    address: null,
    fromSheremetyevo: false,
    selectedTariff: null,
    driverCard: null,
    d20Result: null,
    finalPrice: 0,
    waitStartTime: null,
    pedalScore: 0,
  }),

  addPedalPoint: () => set((s) => ({ pedalScore: s.pedalScore + 1 })),
}));
