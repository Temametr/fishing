import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

export const useTelegram = () => {
  useEffect(() => {
    // Сообщаем Telegram, что приложение готово
    WebApp.ready();
    // Раскрываем приложение на всю высоту экрана
    WebApp.expand();
  }, []);

  // Функция для удобного вызова вибрации
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (type === 'success' || type === 'error') {
      WebApp.HapticFeedback.notificationOccurred(type);
    } else {
      WebApp.HapticFeedback.impactOccurred(type);
    }
  };

  return {
    tg: WebApp,
    user: WebApp.initDataUnsafe?.user,
    triggerHaptic,
  };
};
