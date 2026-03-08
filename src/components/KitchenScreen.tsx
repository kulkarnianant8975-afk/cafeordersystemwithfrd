import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { Order } from '../types';

export const KitchenScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const ordersRef = ref(db, 'orders_active');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val }))
          .filter(o => o.status === 'new' || o.status === 'preparing');
        setOrders(orderList.sort((a, b) => b.orderTime - a.orderTime));
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#4A3728]">Kitchen Display</h1>
          <p className="text-[#8B7E74] text-lg">Live preparation queue.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-[#E5E1D1] shadow-sm">
            <span className="text-sm text-[#8B7E74] block">Pending</span>
            <span className="text-2xl font-bold text-[#D2691E]">{orders.filter(o => o.status === 'new').length}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-[#E5E1D1] shadow-sm">
            <span className="text-sm text-[#8B7E74] block">Preparing</span>
            <span className="text-2xl font-bold text-[#0066CC]">{orders.filter(o => o.status === 'preparing').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white rounded-[2rem] border-4 overflow-hidden shadow-xl ${
                order.status === 'new' ? 'border-[#FFD8C2] ring-4 ring-[#FFD8C2]/20' : 'border-[#C2E0FF]'
              }`}
            >
              <div className={`p-6 flex justify-between items-center ${
                order.status === 'new' ? 'bg-[#FFF5F0]' : 'bg-[#F0F7FF]'
              }`}>
                <h2 className="text-3xl font-bold text-[#4A3728]">Table {order.tableNumber}</h2>
                <span className="text-sm font-bold bg-white/80 px-3 py-1 rounded-full">
                  {Math.floor((Date.now() - order.orderTime) / 60000)}m ago
                </span>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="text-3xl font-black text-[#4A3728] bg-[#FDFCF0] w-12 h-12 flex items-center justify-center rounded-xl border border-[#E5E1D1]">
                        {item.quantity}
                      </span>
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-[#4A3728]">{item.name}</p>
                        {item.selectedSize && (
                          <p className="text-lg text-[#D2691E] font-medium">{item.selectedSize}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'new' && (
                <div className="px-8 py-4 bg-[#D2691E] text-white text-center font-bold animate-pulse">
                  NEW ORDER
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-40">
          <p className="text-2xl text-[#8B7E74] font-serif italic">Kitchen is clear. Great job!</p>
        </div>
      )}
    </div>
  );
};
