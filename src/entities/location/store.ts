import { create } from 'zustand';

interface LocationState {
  lat: number | null;
  lon: number | null;
  city: string;
  setLocation: (lat: number, lon: number, city: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lon: null,
  city: 'Определяем локацию...',
  setLocation: (lat, lon, city) => set({ lat, lon, city }),
}));
