import React from 'react';

export const MapPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-tg-hint">
      <i className="fa-solid fa-map-location-dot text-4xl mb-4"></i>
      <h2 className="text-xl font-bold text-tg-text">Карта водоемов</h2>
      <p className="mt-2 text-sm text-center">Интерактивная карта с рыбными<br/>местами в разработке.</p>
    </div>
  );
};
