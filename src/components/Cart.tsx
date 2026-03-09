import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link,useLocation} from 'react-router-dom';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onPlaceOrder: () => void;
  tableNumber: string;
  isNear: boolean | null;
}

export const Cart = ({ items, onUpdateQuantity, onRemove, onPlaceOrder, tableNumber, isNear }: CartProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const location = useLocation();
  const canPlaceOrder = isNear === true;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="w-24 h-24 bg-[#E5E1D1] rounded-full flex items-center justify-center mx-auto text-[#4A3728]">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-serif font-bold">Your cart is empty</h2>
        <p className="text-[#8B7E74]">Looks like you haven't added anything yet.</p>
        <Link
          to={`/${location.search}`}
          className="inline-block bg-[#4A3728] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#3A2B20] transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link to={`/${location.search}`} className="flex items-center gap-2 text-[#4A3728] font-medium">
          <ArrowLeft size={20} />
          Back to Menu
        </Link>
        <span className="bg-[#E5E1D1] px-4 py-1 rounded-full text-sm font-bold">
          Table {tableNumber}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            key={`${item.id}-${item.selectedSize}`}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-4 rounded-2xl border border-[#E5E1D1] flex gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 space-y-1">
              <div className="flex justify-between">
                <h4 className="font-bold text-[#4A3728]">{item.name}</h4>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-[#D2691E] p-1 hover:bg-[#FDFCF0] rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {item.selectedSize && (
                <p className="text-xs text-[#8B7E74]">Size: {item.selectedSize}</p>
              )}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-3 bg-[#FDFCF0] rounded-lg p-1 border border-[#E5E1D1]">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-white rounded-md text-[#4A3728]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-white rounded-md text-[#4A3728]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-bold text-[#4A3728]">
                  ₹{(item.price * item.quantity).toFixed(0)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E5E1D1] space-y-4 shadow-sm">
        <div className="flex justify-between items-center text-lg">
          <span className="text-[#8B7E74]">Subtotal</span>
          <span className="font-bold text-2xl">₹{subtotal.toFixed(0)}</span>
        </div>
        <button
          onClick={onPlaceOrder}
          disabled={!canPlaceOrder}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-[0.98] ${
            canPlaceOrder 
              ? 'bg-[#4A3728] text-white hover:bg-[#3A2B20]' 
              : 'bg-[#E5E1D1] text-[#8B7E74] cursor-not-allowed'
          }`}
        >
          {isNear === false ? 'Outside Café Range' : 'Place Order'}
        </button>
        {isNear === false && (
          <p className="text-center text-xs text-[#D2691E] font-medium">
            Please visit the café to place your order.
          </p>
        )}
      </div>
    </div>
  );
};
