import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wind, Gauge, CloudRain } from 'lucide-react';
import { useTelegram } from '@/shared/hooks/useTelegram';
import { useLocationStore } from '@/entities/location/store';
import { useWeatherStore } from '@/entities/weather/store';
import { FishingEngine, WeatherData } from '@/entities/engine/FishingEngine';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl ${className}`}>
    {children}
  </div>
);

export const Home = () => {
  const { triggerHaptic } = useTelegram();
  const { city, setLocation } = useLocationStore();
  const { weather, forecast, setWeatherData } = useWeatherStore();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = () => {
    triggerHaptic('heavy');
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          const placeName = geoData.address?.city || geoData.address?.village || geoData.address?.town || "Дикий водоем";
          setLocation(latitude, longitude, placeName);

          const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,surface_pressure,wind_speed_10m,precipitation,uv_index&hourly=surface_pressure&past_hours=3&timezone=auto`);
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

          setWeatherData(
            wObj, 
            {
              peaceful: FishingEngine.calculate(wObj, 'peaceful'),
              predator: FishingEngine.calculate(wObj, 'predator')
            }
          );
          
          triggerHaptic('success');
        } catch (e) {
          alert("Ошибка при получении данных со спутника");
          triggerHaptic('error');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        alert("Пожалуйста, разрешите доступ к геопозиции");
        setIsLoading(false);
        triggerHaptic('error');
      }
    );
  };

  return (
    <div className="space-y-6">
      <header className="text-center mt-4">
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-tg-link to-blue-400">
          FISHTIME PRO
        </h1>
        <p className="text-tg-hint text-sm mt-1">Интеллектуальный прогноз</p>
      </header>

      <GlassCard className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-tg-button/20 rounded-full text-tg-button">
            <MapPin size={24} />
          </div>
          <div>
            <h2 className="font-bold text-tg-text text-lg">{city}</h2>
            <p className="text-xs text-tg-hint">Текущая геопозиция</p>
          </div>
        </div>
      </GlassCard>

      {!forecast && (
        <button 
          onClick={handleScan}
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-tg-button text-tg-button-text font-black text-lg active:scale-95 transition-all flex justify-center items-center"
        >
          {isLoading ? (
            <span className="animate-pulse">СКАНИРОВАНИЕ...</span>
          ) : 'ЗАПУСТИТЬ РАДАР'}
        </button>
      )}

      {forecast && weather && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="space-y-6"
        >
          <div className="grid grid-cols-3 gap-3">
            <GlassCard className="!p-3 text-center">
              <Gauge className="mx-auto text-tg-link mb-2" size={20} />
              <div className="font-bold">{Math.round(weather.pressure)}</div>
              <div className="text-[10px] text-tg-hint uppercase">Давление</div>
            </GlassCard>
            <GlassCard className="!p-3 text-center">
              <Wind className="mx-auto text-tg-link mb-2" size={20} />
              <div className="font-bold">{weather.windSpeed.toFixed(1)}</div>
              <div className="text-[10px] text-tg-hint uppercase">Ветер м/с</div>
            </GlassCard>
            <GlassCard className="!p-3 text-center">
              <CloudRain className="mx-auto text-tg-link mb-2" size={20} />
              <div className="font-bold">{weather.precipitation}</div>
              <div className="text-[10px] text-tg-hint uppercase">Осадки мм</div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <GlassCard className="relative overflow-hidden border-t-4 border-t-fish-peaceful">
              <h3 className="text-fish-peaceful font-bold text-sm mb-2 uppercase">Мирная рыба</h3>
              <div className="text-6xl font-black text-white mb-4 tracking-tighter">
                {forecast.peaceful.score}%
              </div>
              <ul className="text-xs text-tg-hint space-y-1.5">
                {forecast.peaceful.logs.map((log: string, i: number) => (
                  <li key={i} className="flex gap-2"><span className="text-fish-peaceful">•</span> {log}</li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="relative overflow-hidden border-t-4 border-t-fish-predator">
              <h3 className="text-fish-predator font-bold text-sm mb-2 uppercase">Хищная рыба</h3>
              <div className="text-6xl font-black text-white mb-4 tracking-tighter">
                {forecast.predator.score}%
              </div>
              <ul className="text-xs text-tg-hint space-y-1.5">
                {forecast.predator.logs.map((log: string, i: number) => (
                  <li key={i} className="flex gap-2"><span className="text-fish-predator">•</span> {log}</li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <button 
            onClick={handleScan}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-sm active:scale-95 transition-all"
          >
            ОБНОВИТЬ ДАННЫЕ
          </button>
        </motion.div>
      )}
    </div>
  );
};
