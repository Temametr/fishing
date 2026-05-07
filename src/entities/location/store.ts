import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lon: number | null;
  city: string;
  isAuto: boolean;
  setLocation: (lat: number, lon: number, city: string, isAuto: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lon: null,
  city: 'Определяем локацию...',
  isAuto: true,
  setLocation: (lat, lon, city, isAuto) => set({ lat, lon, city, isAuto }),
}));
