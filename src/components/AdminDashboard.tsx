import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Download, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { db, auth } from '../firebase/config';
import { ref, onValue, update, remove } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { Order, OrderStatus } from '../types';
import { exportOrdersToExcel } from '../utils/excel';

export const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersRef = ref(db, 'orders_active');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const orderList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val,
        }));
        
        // Play sound if new order arrives
        const newOrdersCount = orderList.filter(o => o.status === 'new').length;
        const prevNewOrdersCount = orders.filter(o => o.status === 'new').length;
        if (newOrdersCount > prevNewOrdersCount) {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log('Audio play failed:', e));
        }

        setOrders(orderList.sort((a, b) => b.orderTime - a.orderTime));
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orders]);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    const orderRef = ref(db, `orders_active/${orderId}`);
    update(orderRef, { status });
  };

  const clearCompleted = () => {
    const completedOrders = orders.filter(o => o.status === 'ready' || o.status === 'completed');
    completedOrders.forEach(order => {
      remove(ref(db, `orders_active/${order.id}`));
    });
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="flex items-center justify-center h-64">Loading live orders...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3728]">Reception Dashboard</h1>
          <p className="text-[#8B7E74]">Manage incoming orders and table status.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportOrdersToExcel(orders)}
            className="flex items-center gap-2 bg-white border border-[#E5E1D1] px-4 py-2 rounded-xl text-[#4A3728] hover:bg-[#FDFCF0] transition-colors font-medium"
          >
            <Download size={18} />
            Export Excel
          </button>
          <button
            onClick={clearCompleted}
            className="flex items-center gap-2 bg-white border border-[#E5E1D1] px-4 py-2 rounded-xl text-[#D2691E] hover:bg-[#FFF5F0] transition-colors font-medium"
          >
            <Trash2 size={18} />
            Clear Ready
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-[#8B7E74] hover:bg-[#E5E1D1] rounded-xl transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateStatus}
            />
          ))}
        </AnimatePresence>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#E5E1D1]">
          <p className="text-[#8B7E74]">No active orders at the moment.</p>
        </div>
      )}
    </div>
  );
};

interface OrderCardProps {
  key?: string | number;
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const OrderCard = ({ order, onUpdateStatus }: OrderCardProps) => {
  const statusColors = {
    new: 'bg-[#FFF5F0] border-[#FFD8C2] text-[#D2691E]',
    preparing: 'bg-[#F0F7FF] border-[#C2E0FF] text-[#0066CC]',
    ready: 'bg-[#F0FFF4] border-[#C2FFD8] text-[#008033]',
    completed: 'bg-[#F5F5F5] border-[#E5E5E5] text-[#666666]'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl border border-[#E5E1D1] overflow-hidden shadow-sm flex flex-col"
    >
      <div className={cn("px-6 py-4 border-b flex justify-between items-center", statusColors[order.status])}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Table {order.tableNumber}</span>
          <span className="text-xs opacity-70">• {new Date(order.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">{order.status}</span>
      </div>

      <div className="p-6 flex-1 space-y-4">
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-sm">
              <div className="flex gap-2">
                <span className="font-bold text-[#4A3728]">x{item.quantity}</span>
                <div>
                  <p className="font-medium text-[#4A3728]">{item.name}</p>
                  {item.selectedSize && <p className="text-[10px] text-[#8B7E74]">{item.selectedSize}</p>}
                </div>
              </div>
              <span className="text-[#8B7E74]">₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-dashed border-[#E5E1D1] flex justify-between items-center">
          <span className="text-sm text-[#8B7E74]">Total Amount</span>
          <span className="font-bold text-lg text-[#4A3728]">₹{order.subtotal.toFixed(0)}</span>
        </div>
      </div>

      <div className="p-4 bg-[#FDFCF0] border-t border-[#E5E1D1] flex gap-2">
        {order.status === 'new' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'preparing')}
            className="flex-1 bg-[#0066CC] text-white py-2 rounded-xl font-bold text-sm hover:bg-[#0052A3] transition-colors flex items-center justify-center gap-2"
          >
            <Clock size={16} />
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'ready')}
            className="flex-1 bg-[#008033] text-white py-2 rounded-xl font-bold text-sm hover:bg-[#006629] transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'completed')}
            className="flex-1 bg-[#4A3728] text-white py-2 rounded-xl font-bold text-sm hover:bg-[#3A2B20] transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Complete
          </button>
        )}
      </div>
    </motion.div>
  );
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
