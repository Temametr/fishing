import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocationStore } from '@/entities/location/store';
import { Thermometer, Wind, Droplets } from 'lucide-react';

export const Forecast = () => {
  const { lat, lon } = useLocationStore();
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Если координат нет, ничего не делаем
    if (!lat || !lon) return;
    
    const fetch7DaysForecast = async () => {
      setIsLoading(true);
      try {
        // Запрашиваем дневной прогноз на 7 дней
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum&timezone=auto`);
        const data = await res.json();
        
        // Форматируем полученные данные для удобного вывода
        const formattedDays = data.daily.time.map((timeStr: string, i: number) => {
          const date = new Date(timeStr);
          const dayName = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : date.toLocaleDateString('ru-RU', { weekday: 'short' });
          
          const maxTemp = data.daily.temperature_2m_max[i];
          const wind = data.daily.wind_speed_10m_max[i];
          const rain = data.daily.precipitation_sum[i];

          // Базовый алгоритм оценки дневного клева (штрафы за сильный ветер и ливень)
          let score = 75;
          if (wind > 15) score -= 25;
          else if (wind > 8) score -= 10;
          if (rain > 5) score -= 20;
          else if (rain > 0) score += 5; // Легкий дождь - в плюс
          if (maxTemp > 28) score -= 15;
          else if (maxTemp < 10) score -= 10;

          score = Math.max(10, Math.min(98, Math.round(score)));

          return {
            dayName,
            dateStr: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
            tempMax: Math.round(maxTemp),
            wind: wind.toFixed(1),
            rain: rain,
            score: score
          };
        });
        
        setDailyData(formattedDays);
      } catch (e) {
        console.error("Ошибка загрузки прогноза на 7 дней", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetch7DaysForecast();
  }, [lat, lon]);

  // Если пользователь еще не запускал радар на главной
  if (!lat || !lon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <div className="w-20 h-20 bg-tg-secondary rounded-full flex items-center justify-center mb-4 text-tg-button">
            <i className="fa-solid fa-radar text-3xl animate-pulse"></i>
        </div>
        <h2 className="text-xl font-bold">Нет данных</h2>
        <p className="text-tg-hint text-sm mt-2">Вернитесь на главную и запустите радар, чтобы получить прогноз на неделю.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6 pb-6"
    >
      <header>
        <h2 className="text-2xl font-black">Прогноз клева</h2>
        <p className="text-tg-hint text-xs">Анализ погодных окон на 7 дней</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <span className="animate-pulse text-tg-link font-bold">Анализ синоптических данных...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {dailyData.map((day, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
              <div className="flex flex-col">
                  <span className="font-bold text-tg-text">{day.dayName}</span>
                  <span className="text-[10px] text-tg-hint uppercase">{day.dateStr}</span>
              </div>
              
              <div className="flex gap-4 items-center">
                  <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-sm font-bold">
                          <Thermometer size={14} className="text-tg-link" />
                          {day.tempMax}°
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-tg-hint">
                          <Wind size={10} />
                          {day.wind} м/с
                      </div>
                      {day.rain > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400">
                            <Droplets size={10} />
                            {day.rain} мм
                        </div>
                      )}
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                    day.score > 70 ? 'bg-fish-peaceful/20 text-fish-peaceful' : 
                    day.score < 40 ? 'bg-fish-predator/20 text-fish-predator' : 
                    'bg-tg-button/20 text-tg-button'
                  }`}>
                      {day.score}%
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
