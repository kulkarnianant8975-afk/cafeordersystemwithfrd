export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Coffee' | 'Tea' | 'Pizza' | 'Snacks' | 'Desserts';
  sizes?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: string;
}

export interface Order {
  id: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  orderTime: number;
  status: OrderStatus;
}

export interface CafeConfig {
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  pins: Record<string, string>; // tableNumber -> PIN
}
