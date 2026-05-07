import React from 'react';
import { useTelegram } from '@/shared/hooks/useTelegram';

export default function App() {
  const { user, triggerHaptic } = useTelegram();

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-tg-link to-blue-500">
          FISHTIME PRO
        </h1>
        <p className="text-tg-hint mt-3 text-lg">
          Привет, {user?.first_name || 'Рыбак'}! 🎣
        </p>
      </div>

      <button 
        onClick={() => triggerHaptic('heavy')}
        className="w-full max-w-sm py-4 rounded-2xl bg-tg-button text-tg-button-text font-bold text-lg active:scale-95 transition-transform"
      >
        ТЕСТ ВИБРАЦИИ
      </button>
    </div>
  );
}
