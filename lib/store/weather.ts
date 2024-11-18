import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WeatherStore {
  unit: 'celsius' | 'fahrenheit';
  language: 'en' | 'bn';
  setUnit: (unit: 'celsius' | 'fahrenheit') => void;
  setLanguage: (lang: 'en' | 'bn') => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      unit: 'celsius',
      language: 'en',
      setUnit: (unit) => set({ unit }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'weather-settings',
    }
  )
);