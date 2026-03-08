import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] border border-[#E5E1D1] shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#4A3728] rounded-2xl flex items-center justify-center mx-auto text-white mb-4">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#4A3728]">Staff Login</h2>
          <p className="text-[#8B7E74]">Enter your credentials to access the dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7E74]" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#FDFCF0] border border-[#E5E1D1] rounded-2xl focus:border-[#4A3728] focus:outline-none transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7E74]" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#FDFCF0] border border-[#E5E1D1] rounded-2xl focus:border-[#4A3728] focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-[#D2691E] text-sm text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4A3728] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#3A2B20] transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Access Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
