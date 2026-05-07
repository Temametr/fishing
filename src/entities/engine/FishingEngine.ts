export interface WeatherData {
  temp: number;
  pressure: number;
  pressureDelta: number; // Тренд давления (изменение за последние часы)
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
}

export class FishingEngine {
  static calculate(data: WeatherData, type: 'peaceful' | 'predator') {
    let score = 50;
    const logs: string[] = [];

    // 1. Давление (Критический фактор)
    if (Math.abs(data.pressureDelta) <= 1.5) {
      score += 20;
      logs.push("Давление стабильно (+)");
    } else if (data.pressureDelta < -2) {
      if (type === 'predator') {
        score += 30;
        logs.push("Резкое падение: жор хищника!");
      } else {
        score -= 20;
        logs.push("Перепад: мирная рыба болеет");
      }
    } else {
      score += 5;
      logs.push("Давление медленно растет");
    }

    // 2. Температура
    if (type === 'predator') {
      if (data.temp >= 10 && data.temp <= 16) { score += 15; logs.push("Оптимальная прохлада"); }
      else if (data.temp > 25) { score -= 15; logs.push("Вода слишком теплая"); }
    } else {
      if (data.temp >= 18 && data.temp <= 24) { score += 15; logs.push("Тепло: активный метаболизм"); }
      else if (data.temp < 10) { score -= 15; logs.push("Слишком холодно"); }
    }

    // 3. Ветер
    if (data.windSpeed > 15) {
      score -= 20;
      logs.push("Сильный ветер мешает");
    } else if (data.windSpeed > 3 && type === 'predator') {
      score += 10;
      logs.push("Рябь скрывает хищника");
    }

    // 4. Осадки и UV
    if (data.precipitation > 0 && data.precipitation < 3) { 
      score += 10; 
      logs.push("Дождь насыщает воду кислородом"); 
    }
    if (data.uvIndex > 6) { 
      score -= 10; 
      logs.push("Высокий UV: рыба на глубине"); 
    }

    // Ограничиваем от 0 до 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    
    return { score: finalScore, logs };
  }
}
