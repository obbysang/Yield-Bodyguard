import React from 'react';
import { LayoutDashboard, Activity, Settings, LogOut, ShieldCheck, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onDisconnect, isConnected }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div 
      initial={{ x: -64, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col justify-between z-10 hidden md:flex"
    >
      <div>
        <div className="p-8 flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-10 h-10 bg-forest-900 rounded-xl flex items-center justify-center text-white cursor-pointer"
          >
            <ShieldCheck size={24} />
          </motion.div>
          <div>
            <h1 className="font-bold text-xl text-forest-950">YieldBodyguard</h1>
            <p className="text-xs text-gray-400">Autonomous Agent</p>
          </div>
        </div>

        <nav className="px-4 mt-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-forest-900 rounded-xl shadow-lg shadow-forest-900/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <motion.button
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative z-10 w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors duration-200 group ${
                    isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-forest-900'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-forest-900 transition-colors'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.button>
              </div>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mb-4">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-forest-800 to-forest-950 rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer"
        >
          {/* Animated Blob Background */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={80} />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-forest-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <h3 className="font-semibold mb-1 relative z-10">ATP Premium</h3>
          <p className="text-xs text-forest-100 mb-3 relative z-10">Get auto-rebalancing & priority alerts.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            Upgrade Now
          </motion.button>
        </motion.div>
        
        <motion.button 
          onClick={onDisconnect}
          whileHover={{ x: 5, color: '#ef4444' }}
          className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-gray-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">{isConnected ? 'Disconnect Wallet' : 'Exit Demo'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};