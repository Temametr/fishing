import React from 'react';

export const Forecast = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-tg-hint">
      <i className="fa-solid fa-calendar-days text-4xl mb-4"></i>
      <h2 className="text-xl font-bold text-tg-text">Прогноз на 7 дней</h2>
      <p className="mt-2 text-sm text-center">Скоро здесь появится<br/>подробный почасовой прогноз.</p>
    </div>
  );
};
