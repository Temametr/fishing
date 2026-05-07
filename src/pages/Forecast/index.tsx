import { motion } from 'framer-motion';
import { useWeatherStore } from '@/entities/weather/store';
import { Thermometer, Wind, Droplets } from 'lucide-react';

export const Forecast = () => {
  const { weather } = useWeatherStore();

  // Если данных еще нет (пользователь не нажал "Сканировать" на главной)
  if (!weather) {
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

  // Заглушка для списка дней (в реальности здесь будет fetch данных на 7 дней)
  const days = ['Сегодня', 'Завтра', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <header>
        <h2 className="text-2xl font-black">Прогноз клева</h2>
        <p className="text-tg-hint text-xs">Анализ погодных окон на 7 дней</p>
      </header>

      <div className="space-y-3">
        {days.map((day, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="font-bold text-tg-text">{day}</span>
                <span className="text-[10px] text-tg-hint uppercase">Хороший клев</span>
            </div>
            
            <div className="flex gap-4 items-center">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-sm font-bold">
                        <Thermometer size={14} className="text-tg-link" />
                        {Math.round(weather.temp + (i * 0.5))}°
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-tg-hint">
                        <Wind size={10} />
                        {weather.windSpeed.toFixed(1)} м/с
                    </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-tg-button/20 flex items-center justify-center text-tg-button font-black">
                    {Math.max(30, 85 - (i * 5))}%
                </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
