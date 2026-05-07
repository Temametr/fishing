import { motion } from 'framer-motion';
import { useLocationStore } from '@/entities/location/store';
import { MapPin } from 'lucide-react';

export const MapPage = () => {
  const { lat, lon, city } = useLocationStore();

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-4 h-[calc(100vh-120px)] flex flex-col"
    >
      <header>
        <h2 className="text-2xl font-black">Карта водоемов</h2>
        <p className="text-tg-hint text-xs">Ваша локация и рыбные места</p>
      </header>

      <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
        {lat && lon ? (
          <>
            {/* Реальная карта OpenStreetMap */}
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05},${lat-0.05},${lon+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lon}`}
              className="absolute inset-0 w-full h-full opacity-70 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
            
            {/* Информационная плашка поверх карты */}
            <div className="absolute bottom-4 left-4 right-4 bg-tg-bg/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-tg-button/20 rounded-full text-tg-button animate-bounce">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-tg-text">{city}</p>
                  <p className="text-[10px] text-tg-hint">Текущая точка заброса</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <MapPin size={48} className="text-tg-hint mb-4 opacity-50" />
            <h3 className="font-bold text-lg text-tg-text">Локация не найдена</h3>
            <p className="text-sm text-tg-hint mt-2">Перейдите на главную страницу и нажмите "Запустить радар", чтобы обновить координаты.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
