import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, push, set } from 'firebase/database';
import { auth, db } from './firebase/config';
import { Layout } from './components/Layout';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { PinEntry } from './components/PinEntry';
import { Login } from './components/Login';
import { AdminDashboard } from './components/AdminDashboard';
import { KitchenScreen } from './components/KitchenScreen';
import { QRGenerator } from './components/QRGenerator';
import { checkLocation, validatePIN, checkRateLimit } from './utils/security';
import { CartItem, Order } from './types';
import { AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerFlow = ({ onCartChange }: { onCartChange: (count: number) => void }) => {
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') || '1';
  const [isNear, setIsNear] = useState<boolean | null>(null);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCartChange(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart, onCartChange]);

  useEffect(() => {
    checkLocation()
      .then(setIsNear)
      .catch((err) => {
        console.error(err);
        setIsNear(false);
      });
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.selectedSize === item.selectedSize);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.selectedSize === item.selectedSize
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = async () => {
    if (!checkRateLimit(tableNumber)) {
      setError('Order limit reached (max 5 per hour). Please wait.');
      return;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const orderData: Omit<Order, 'id'> = {
      tableNumber,
      items: cart,
      subtotal,
      orderTime: Date.now(),
      status: 'new',
    };

    try {
      const ordersRef = ref(db, 'orders_active');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);
      setCart([]);
      setOrderPlaced(true);
      setTimeout(() => setOrderPlaced(false), 5000);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    }
  };

  if (isNear === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#4A3728] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#8B7E74]">Checking your location...</p>
      </div>
    );
  }

  if (!isPinVerified && isNear === true) {
    return (
      <PinEntry
        tableNumber={tableNumber}
        onSuccess={() => setIsPinVerified(true)}
        onValidate={(pin) => validatePIN(tableNumber, pin)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {orderPlaced && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-4 right-4 bg-[#008033] text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold">Order placed successfully! We're preparing it now.</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-24 left-4 right-4 bg-[#D2691E] text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3"
          >
            <AlertCircle size={24} />
            <span className="font-bold">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-2">
        {isNear === false && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFF5F0] border border-[#FFD8C2] p-3 rounded-2xl mb-6 flex items-center justify-center gap-2 text-[#D2691E] text-sm"
          >
            <MapPin size={16} />
            <span>You are viewing the menu remotely. Ordering is disabled.</span>
          </motion.div>
        )}
        <h1 className="text-4xl font-serif font-bold text-[#4A3728]">Welcome</h1>
        <p className="text-[#8B7E74] text-lg">Table {tableNumber} • Brew & Bite Café</p>
      </div>

      <Routes>
        <Route path="/" element={<Menu onAddToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onPlaceOrder={placeOrder}
              tableNumber={tableNumber}
              isNear={isNear}
            />
          }
        />
      </Routes>
    </div>
  );
};

const AdminFlow = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/kitchen" element={<KitchenScreen />} />
      <Route path="/qr-generator" element={<QRGenerator />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_DATABASE_URL && 
                               import.meta.env.VITE_FIREBASE_DATABASE_URL !== "YOUR_DATABASE_URL";

  if (!isFirebaseConfigured) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2.5rem] border border-[#E5E1D1] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-[#FFF5F0] rounded-3xl flex items-center justify-center mx-auto text-[#D2691E] border border-[#FFD8C2]">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#4A3728]">Configuration Required</h2>
          <p className="text-[#8B7E74]">
            Firebase is not yet configured. Please set the required environment variables in the Secrets panel.
          </p>
          <div className="text-left bg-[#FDFCF0] p-4 rounded-xl text-xs font-mono overflow-x-auto">
            <p className="font-bold mb-2">Required Variables:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_DATABASE_URL</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
            </ul>
          </div>
        </div>
        <div className="pt-4">
            <p className="text-sm text-[#8B7E74]">
              Once configured, you can access the Admin Panel at:
              <br />
              <code className="bg-[#E5E1D1] px-2 py-1 rounded mt-1 inline-block">/admin</code>
            </p>
          </div>
      </Layout>
    );
  }

  return (
    <Layout cartCount={cartCount}>
      <Routes>
        <Route path="/admin/*" element={<AdminFlow />} />
        <Route path="/*" element={<CustomerFlow onCartChange={setCartCount} />} />
      </Routes>
    </Layout>
  );
}
