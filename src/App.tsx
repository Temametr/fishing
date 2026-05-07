import { useState } from 'react';
import { BottomNav } from '@/widgets/BottomNav';
import { useTelegram } from '@/shared/hooks/useTelegram';

// Импортируем наши страницы
import { Home } from '@/pages/Home';
import { Forecast } from '@/pages/Forecast';
import { MapPage } from '@/pages/Map';
import { Profile } from '@/pages/Profile';

export default function App() {
  const { triggerHaptic } = useTelegram();
  const [activeTab, setActiveTab] = useState('home');

  // Функция, которая определяет, какой компонент рендерить
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'forecast':
        return <Forecast />;
      case 'map':
        return <MapPage />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24 relative overflow-x-hidden">
      
      {/* Здесь рендерится активная страница */}
      {renderContent()}

      {/* Навигация всегда остается внизу */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          triggerHaptic('light');
        }} 
      />
    </div>
  );
}
