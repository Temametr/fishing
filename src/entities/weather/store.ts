import { create } from 'zustand';
import { WeatherData } from '@/entities/engine/FishingEngine';

interface WeatherState {
  weather: WeatherData | null;
  forecast: { peaceful: any; predator: any } | null;
  setWeatherData: (weather: WeatherData, forecast: { peaceful: any; predator: any }) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  forecast: null,
  setWeatherData: (weather, forecast) => set({ weather, forecast }),
}));
