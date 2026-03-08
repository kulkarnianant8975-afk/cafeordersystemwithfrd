import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { MenuItem, CartItem } from '../types';
import { MENU_ITEMS } from '../constants';

interface MenuProps {
  onAddToCart: (item: CartItem) => void;
}

export const Menu = ({ onAddToCart }: MenuProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('Coffee');
  const categories = ['Coffee', 'Tea', 'Pizza', 'Snacks', 'Desserts'];

  const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#4A3728] text-white shadow-lg'
                : 'bg-white text-[#4A3728] border border-[#E5E1D1] hover:border-[#4A3728]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={onAddToCart} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface MenuItemCardProps {
  key?: string | number;
  item: MenuItem;
  onAdd: (item: CartItem) => void;
}

const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-3xl overflow-hidden border border-[#E5E1D1] shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-[#4A3728]">
          ₹{item.price.toFixed(0)}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-serif font-bold text-xl text-[#4A3728]">{item.name}</h3>
          <p className="text-[#8B7E74] text-sm line-clamp-2 mt-1">{item.description}</p>
        </div>

        {item.sizes && (
          <div className="flex gap-2">
            {item.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-[#4A3728] text-white'
                    : 'bg-[#FDFCF0] text-[#4A3728] border border-[#E5E1D1]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 bg-[#FDFCF0] rounded-xl p-1 border border-[#E5E1D1]">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-white rounded-lg text-[#4A3728] transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="font-bold w-4 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:bg-white rounded-lg text-[#4A3728] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={() => onAdd({ ...item, quantity, selectedSize })}
            className="bg-[#4A3728] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#3A2B20] transition-colors shadow-lg active:scale-95"
          >
            <ShoppingBag size={18} />
            <span className="font-medium">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
