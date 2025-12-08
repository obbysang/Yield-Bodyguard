import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  notifications: number;
  walletAddress?: string;
}

export const Header: React.FC<HeaderProps> = ({ notifications, walletAddress }) => {
  
  const displayAddress = walletAddress 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : '0x00...0000';

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20"
    >
      {/* Search - Decorative */}
      <div className="relative w-96 hidden md:block group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-500 transition-colors" size={18} />
        <motion.input 
          layout
          type="text" 
          placeholder="Search pools, tokens, or protocols..." 
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-forest-500/20 focus:outline-none transition-all placeholder:text-gray-400"
          whileFocus={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        />
      </div>

      <div className="flex items-center gap-6">
        {/* Wallet Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm cursor-pointer"
        >
          <div className={`w-2 h-2 rounded-full animate-pulse ${walletAddress ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-gray-700 font-mono">{displayAddress}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </motion.div>

        {/* Notifications */}
        <motion.button 
          whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell size={20} />
          <AnimatePresence>
            {notifications > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"
              ></motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            src="https://picsum.photos/100/100" 
            alt="User" 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900">DeFi Degen</p>
            <p className="text-xs text-gray-500">Premium Plan</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
};