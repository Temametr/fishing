import { Home, CalendarDays, Map, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: BottomNavProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Главная' },
    { id: 'forecast', icon: CalendarDays, label: 'Прогноз' },
    { id: 'map', icon: Map, label: 'Карта' },
    { id: 'profile', icon: Settings, label: 'Профиль' }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-tg-secondary/80 backdrop-blur-xl border-t border-white/10 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-tg-link scale-110' : 'text-tg-hint scale-100'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
