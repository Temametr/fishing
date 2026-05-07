import React from 'react';
import { useTelegram } from '@/shared/hooks/useTelegram';

export const Profile = () => {
  const { user } = useTelegram();
  
  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="w-24 h-24 rounded-full bg-tg-button/20 flex items-center justify-center text-tg-button text-3xl font-bold">
        {user?.first_name?.charAt(0) || 'U'}
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-tg-text">{user?.first_name || 'Рыбак'} {user?.last_name || ''}</h2>
        <p className="text-tg-hint mt-1">ID: {user?.id || 'Неизвестно'}</p>
      </div>
      
      <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-6">
         <h3 className="text-tg-hint uppercase text-xs font-bold mb-3">Настройки (В разработке)</h3>
         <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span>Уведомления о клеве</span>
                <span className="text-tg-hint">Выкл</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span>Любимые места</span>
                <span className="text-tg-button">0</span>
            </div>
         </div>
      </div>
    </div>
  );
};
