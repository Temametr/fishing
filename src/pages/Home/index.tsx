import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wind, Gauge, CloudRain, Navigation, Search } from 'lucide-react';
import { useTelegram } from '@/shared/hooks/useTelegram';
import { useLocationStore } from '@/entities/location/store';
import { useWeatherStore } from '@/entities/weather/store';
import { FishingEngine, WeatherData } from '@/entities/engine/FishingEngine';
import { LocationBottomSheet } from '@/widgets/LocationBottomSheet';

// ВАЖНО: Добавили onClick в интерфейс TypeScript
const GlassCard = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl ${className}`}
  >
    {children}
  </div>
);

export const Home = () => {
  const { triggerHaptic } = useTelegram();
  const { city, isAuto, setLocation } = useLocationStore();
  const { weather, forecast, setWeatherData } = useWeatherStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const fetchWeather = async (lat: number, lon: number, cityName: string, auto: boolean) => {
    setIsLoading(true);
    try {
      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,surface_pressure,wind_speed_10m,precipitation,uv_index&hourly=surface_pressure&past_hours=3&timezone=auto`);
      const wData = await wRes.json();
      const currentP = wData.current.surface_pressure;
      const pastP = wData.hourly.surface_pressure[0];

      const wObj: WeatherData = {
        temp: wData.current.temperature_2m,
        pressure: currentP,
        pressureDelta: currentP - pastP,
        windSpeed: wData.current.wind_speed_10m,
        precipitation: wData.current.precipitation,
        uvIndex: wData.current.uv_index
      };

      setWeatherData(wObj, {
        peaceful: FishingEngine.calculate(wObj, 'peaceful'),
        predator: FishingEngine.calculate(wObj, 'predator')
      });
      setLocation(lat, lon, cityName, auto);
      triggerHaptic('success');
    } catch (e) {
      alert("Ошибка спутника");
      triggerHaptic('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoScan = () => {
    triggerHaptic('heavy');
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
      const geoData = await geoRes.json();
      const placeName = geoData.address?.city || geoData.address?.village || geoData.address?.town || "Дикий водоем";
      fetchWeather(latitude, longitude, placeName, true);
    }, () => {
      alert("Доступ к GPS запрещен");
      setIsLoading(false);
      triggerHaptic('error');
    });
  };

  return (
    <div className="space-y-6 pt-[100px]">
      <div className="fixed top-0 left-0 right-0 z-50 bg-tg-bg/80 backdrop-blur-xl p-4 text-center border-b border-white/5">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-tg-link to-blue-400 leading-none">
          FISHTIME PRO
        </h1>
        <p className="text-tg-hint text-[10px] mt-1 font-bold tracking-widest uppercase">Интеллектуальный прогноз</p>
      </div>

      <GlassCard 
        className="flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer border-tg-link/20 shadow-[0_0_20px_rgba(0,242,254,0.1)]"
        onClick={() => { setIsSheetOpen(true); triggerHaptic('light'); }}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isAuto ? 'bg-tg-button/20 text-tg-button' : 'bg-fish-peaceful/20 text-fish-peaceful'}`}>
            {isAuto ? <Navigation size={22} /> : <Search size={22} />}
          </div>
          <div>
            <h2 className="font-bold text-tg-text text-lg">{city}</h2>
            <p className="text-[10px] text-tg-hint uppercase font-bold">{isAuto ? 'Определено автоматически' : 'Выбрано вручную'}</p>
          </div>
        </div>
        <Search size={18} className="text-tg-hint" />
      </GlassCard>

      {!forecast && (
        <button 
          onClick={handleAutoScan} disabled={isLoading}
          className="w-full py-5 rounded-3xl bg-tg-button text-tg-button-text font-black text-lg active:scale-95 shadow-xl transition-all"
        >
          {isLoading ? <span className="animate-pulse">АНАЛИЗ ВОДОЕМА...</span> : 'ЗАПУСТИТЬ РАДАР'}
        </button>
      )}

      {forecast && weather && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <GlassCard className="!p-3 text-center">
              <Gauge className="mx-auto text-tg-link mb-1" size={18} />
              <div className="text-sm font-black">{Math.round(weather.pressure)}</div>
              <div className="text-[8px] text-tg-hint uppercase">Давление</div>
            </GlassCard>
            <GlassCard className="!p-3 text-center">
              <Wind className="mx-auto text-tg-link mb-1" size={18} />
              <div className="text-sm font-black">{weather.windSpeed.toFixed(1)}</div>
              <div className="text-[8px] text-tg-hint uppercase">Ветер</div>
            </GlassCard>
            <GlassCard className="!p-3 text-center">
              <CloudRain className="mx-auto text-tg-link mb-1" size={18} />
              <div className="text-sm font-black">{weather.precipitation}</div>
              <div className="text-[8px] text-tg-hint uppercase">Осадки</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="border-b-4 border-b-fish-peaceful text-center flex flex-col items-center">
              <span className="text-[8px] text-fish-peaceful font-black uppercase mb-2">Мирная</span>
              <div className="text-4xl font-black text-white">{forecast.peaceful.score}%</div>
            </GlassCard>
            <GlassCard className="border-b-4 border-b-fish-predator text-center flex flex-col items-center">
              <span className="text-[8px] text-fish-predator font-black uppercase mb-2">Хищник</span>
              <div className="text-4xl font-black text-white">{forecast.predator.score}%</div>
            </GlassCard>
          </div>
          
          <button 
            onClick={handleAutoScan} disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-white/5 text-tg-hint font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
          >
            Обновить по GPS
          </button>
        </motion.div>
      )}

      <LocationBottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </div>
  );
};
