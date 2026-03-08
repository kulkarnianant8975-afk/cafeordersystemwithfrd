import { CAFE_CONFIG } from '../constants';

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const checkLocation = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          CAFE_CONFIG.lat,
          CAFE_CONFIG.lng
        );
        resolve(distance <= CAFE_CONFIG.radius);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
};

export const validatePIN = (tableNumber: string, pin: string): boolean => {
  return CAFE_CONFIG.pins[tableNumber] === pin;
};

export const checkRateLimit = (tableNumber: string): boolean => {
  const key = `orders_count_${tableNumber}`;
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify({ count: 1, firstOrder: now }));
    return true;
  }

  const { count, firstOrder } = JSON.parse(stored);
  if (now - firstOrder > oneHour) {
    localStorage.setItem(key, JSON.stringify({ count: 1, firstOrder: now }));
    return true;
  }

  if (count >= 5) return false;

  localStorage.setItem(key, JSON.stringify({ count: count + 1, firstOrder }));
  return true;
};
