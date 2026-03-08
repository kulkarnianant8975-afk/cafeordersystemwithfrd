import { MenuItem } from './types';

export const CAFE_CONFIG = {
  name: "TTMM Cafe",
  lat: 19.11996906316397,
  lng: 76.744252399406,
  radius: 2000,
  pins: {
    "1": "1234",
    "2": "2345",
    "3": "3456",
    "4": "4567",
    "5": "5678",
    "6": "6789",
    "7": "7890",
    "8": "8901",
    "9": "9012",
    "10": "0123",
    "11": "1111",
    "12": "2222",
    "13": "3333",
    "14": "4444",
    "15": "5555",
    "16": "6666",
    "17": "7777",
    "18": "8888",
    "19": "9999",
    "20": "0000",
  }
};

export const MENU_ITEMS: MenuItem[] = [
  // Coffee
  {
    id: 'c1',
    name: 'Caramel Macchiato',
    price: 280,
    description: 'Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&q=80&w=400',
    category: 'Coffee',
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 'c2',
    name: 'Iced Americano',
    price: 190,
    description: 'Espresso shots topped with cold water produce a light layer of crema, then served over ice.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
    category: 'Coffee',
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 'c3',
    name: 'Cappuccino',
    price: 220,
    description: 'Dark, rich espresso lies in wait under a smoothed and stretched layer of thick milk foam.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400',
    category: 'Coffee',
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 'c4',
    name: 'Hazelnut Latte',
    price: 260,
    description: 'Our signature espresso with steamed milk and sweet hazelnut syrup.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400',
    category: 'Coffee',
    sizes: ['Small', 'Medium', 'Large']
  },

  // Tea
  {
    id: 't1',
    name: 'Matcha Green Tea Latte',
    price: 310,
    description: 'Smooth and creamy matcha sweetened just right and served with steamed milk.',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&q=80&w=400',
    category: 'Tea',
    sizes: ['Small', 'Medium', 'Large']
  },
  {
    id: 't2',
    name: 'Masala Chai',
    price: 150,
    description: 'Traditional Indian tea brewed with aromatic spices and milk.',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=400',
    category: 'Tea',
    sizes: ['Small', 'Medium', 'Large']
  },

  // Pizza
  {
    id: 'p1',
    name: 'Margherita Pizza',
    price: 350,
    description: 'Classic pizza with tomato sauce, fresh mozzarella, and basil leaves.',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?auto=format&fit=crop&q=80&w=400',
    category: 'Pizza',
    sizes: ['Regular', 'Medium', 'Large']
  },
  {
    id: 'p2',
    name: 'Farmhouse Pizza',
    price: 450,
    description: 'Loaded with capsicum, onion, tomato, and mushrooms.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400',
    category: 'Pizza',
    sizes: ['Regular', 'Medium', 'Large']
  },
  {
    id: 'p3',
    name: 'Paneer Tikka Pizza',
    price: 480,
    description: 'Spicy paneer tikka chunks with onion and capsicum on a cheesy base.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
    category: 'Pizza',
    sizes: ['Regular', 'Medium', 'Large']
  },
  {
    id: 'p4',
    name: 'Pepperoni Feast',
    price: 550,
    description: 'Double pepperoni with extra mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400',
    category: 'Pizza',
    sizes: ['Regular', 'Medium', 'Large']
  },

  // Snacks
  {
    id: 's1',
    name: 'Avocado Toast',
    price: 320,
    description: 'Smashed avocado on sourdough bread, topped with chili flakes and a poached egg.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400',
    category: 'Snacks'
  },
  {
    id: 's2',
    name: 'Paneer Sandwich',
    price: 180,
    description: 'Grilled sandwich with spiced paneer filling and green chutney.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400',
    category: 'Snacks'
  },
  {
    id: 's3',
    name: 'French Fries',
    price: 120,
    description: 'Crispy golden fries served with peri-peri seasoning.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400',
    category: 'Snacks'
  },

  // Desserts
  {
    id: 'd1',
    name: 'Chocolate Lava Cake',
    price: 240,
    description: 'Warm chocolate cake with a molten center, served with a scoop of vanilla ice cream.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=400',
    category: 'Desserts'
  },
  {
    id: 'd2',
    name: 'Blueberry Cheesecake',
    price: 290,
    description: 'Creamy cheesecake topped with fresh blueberry compote.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=400',
    category: 'Desserts'
  }
];
