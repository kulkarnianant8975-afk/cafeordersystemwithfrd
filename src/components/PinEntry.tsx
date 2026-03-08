import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';

interface PinEntryProps {
  tableNumber: string;
  onSuccess: () => void;
  onValidate: (pin: string) => boolean;
}

export const PinEntry = ({ tableNumber, onSuccess, onValidate }: PinEntryProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onValidate(pin)) {
      onSuccess();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-[2.5rem] border border-[#E5E1D1] shadow-xl text-center space-y-8">
      <div className="w-20 h-20 bg-[#FDFCF0] rounded-3xl flex items-center justify-center mx-auto text-[#4A3728] border border-[#E5E1D1]">
        <Lock size={32} />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-serif font-bold text-[#4A3728]">Table {tableNumber}</h2>
        <p className="text-[#8B7E74]">Please enter the 4-digit PIN found on your table.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-4">
          <motion.input
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            className="w-48 text-center text-4xl tracking-[1em] py-4 bg-[#FDFCF0] border-2 border-[#E5E1D1] rounded-2xl focus:border-[#4A3728] focus:ring-0 transition-all font-mono"
            autoFocus
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#D2691E] font-medium"
          >
            Incorrect PIN. Please try again.
          </motion.p>
        )}

        <button
          type="submit"
          disabled={pin.length !== 4}
          className="w-full bg-[#4A3728] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#3A2B20] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue to Menu
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};
