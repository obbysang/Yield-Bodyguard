import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Wallet, Smartphone, Mail, Zap, Lock } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const Settings: React.FC = () => {
  const [riskScore, setRiskScore] = useState(70);
  const [autoRebalance, setAutoRebalance] = useState(true);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
         <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-forest-100 text-forest-700 rounded-lg"><Shield size={24} /></div>
           <h2 className="text-xl font-bold text-gray-900">Risk Configuration</h2>
         </div>

         <div className="space-y-8">
           <div>
             <div className="flex justify-between mb-2">
               <label className="font-semibold text-gray-700">Minimum Safety Score</label>
               <span className="font-bold text-forest-600">{riskScore}</span>
             </div>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={riskScore} 
               onChange={(e) => setRiskScore(parseInt(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
             />
             <p className="text-xs text-gray-500 mt-2">Pools falling below this score will trigger alerts or auto-exit.</p>
           </div>

           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-white rounded-lg shadow-sm text-yellow-600"><Zap size={20} /></div>
               <div>
                 <h3 className="font-bold text-gray-900">Autonomous Rebalancing</h3>
                 <p className="text-xs text-gray-500">Allow agent to exit positions instantly upon critical risk.</p>
               </div>
             </div>
             <button 
               onClick={() => setAutoRebalance(!autoRebalance)}
               className={`w-12 h-6 rounded-full transition-colors relative ${autoRebalance ? 'bg-forest-600' : 'bg-gray-300'}`}
             >
               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoRebalance ? 'left-7' : 'left-1'}`}></div>
             </button>
           </div>
         </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
         <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Bell size={24} /></div>
           <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
         </div>

         <div className="space-y-4">
            {[
              { label: 'Push Notifications', icon: Smartphone, desc: 'Real-time alerts on mobile.' },
              { label: 'Email Digest', icon: Mail, desc: 'Weekly summary of yield and risk.' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                 <div className="flex items-center gap-3">
                   <item.icon size={20} className="text-gray-400" />
                   <div>
                     <h4 className="font-medium text-gray-900">{item.label}</h4>
                     <p className="text-xs text-gray-500">{item.desc}</p>
                   </div>
                 </div>
                 <input type="checkbox" defaultChecked className="w-5 h-5 text-forest-600 rounded focus:ring-forest-500" />
              </div>
            ))}
         </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm opacity-50 relative overflow-hidden">
         <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm font-bold text-gray-500">
               <Lock size={14} /> Feature Coming Soon
            </div>
         </div>
         <div className="flex items-center gap-3 mb-6">
           <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Wallet size={24} /></div>
           <h2 className="text-xl font-bold text-gray-900">Connected Wallets</h2>
         </div>
         <p> Manage your multi-sig and hardware wallets here.</p>
      </motion.div>
    </motion.div>
  );
};