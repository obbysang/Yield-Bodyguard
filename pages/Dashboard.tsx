import React from 'react';
import { PoolData, Alert, RiskAnalysisResult } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Shield, AlertTriangle, Play, RefreshCw, Layers, Info, CheckCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  pools: PoolData[];
  alerts: Alert[];
  isSimulating: boolean;
  toggleSimulation: () => void;
  setSelectedPool: (pool: PoolData) => void;
  poolAnalysis: { pool: PoolData, analysis: RiskAnalysisResult }[];
  avgScore: number;
  safeCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const alertStyles = {
  critical: {
    container: 'bg-red-50 border-red-500',
    iconBg: 'text-red-500',
    title: 'text-red-800',
    text: 'text-red-700',
    button: 'bg-red-600 hover:bg-red-700',
    Icon: AlertTriangle
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-500',
    iconBg: 'text-yellow-600',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    Icon: AlertTriangle
  },
  info: {
    container: 'bg-blue-50 border-blue-500',
    iconBg: 'text-blue-500',
    title: 'text-blue-800',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700',
    Icon: Info
  }
};

export const Dashboard: React.FC<DashboardProps> = ({
  pools,
  alerts,
  isSimulating,
  toggleSimulation,
  setSelectedPool,
  poolAnalysis,
  avgScore,
  safeCount
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Simulation Bar */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
      >
         <div className="flex items-center gap-3">
           <motion.div 
             animate={{ rotate: isSimulating ? 360 : 0 }}
             transition={{ repeat: isSimulating ? Infinity : 0, duration: 1, ease: "linear" }}
             className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"
           >
             <RefreshCw size={20} />
           </motion.div>
           <div>
             <h3 className="font-semibold text-sm">Demo Simulation Mode</h3>
             <p className="text-xs text-gray-500">Inject anomalous on-chain data to test agent response.</p>
           </div>
         </div>
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={toggleSimulation}
           className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
             isSimulating 
               ? 'bg-red-100 text-red-700 hover:bg-red-200' 
               : 'bg-indigo-600 text-white hover:bg-indigo-700'
           }`}
         >
           {isSimulating ? 'Reset Simulation' : 'Simulate Attack'}
           {!isSimulating && <Play size={14} fill="currentColor" />}
         </motion.button>
      </motion.div>

      {/* Alert Banner */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className={`border-l-4 p-4 rounded-r-xl flex items-start gap-4 overflow-hidden shadow-sm ${alertStyles[alerts[0].type].container}`}
          >
            <div className={`bg-white p-2 rounded-full shadow-sm mt-1 ${alertStyles[alerts[0].type].iconBg}`}>
              {React.createElement(alertStyles[alerts[0].type].Icon, { size: 20 })}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${alertStyles[alerts[0].type].title}`}>{alerts[0].title}</h3>
              <p className={`text-sm mt-1 ${alertStyles[alerts[0].type].text}`}>{alerts[0].message}</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-white px-4 py-2 rounded-lg text-xs font-bold ${alertStyles[alerts[0].type].button}`}
              onClick={() => {
                 const target = poolAnalysis.find(p => p.pool.id === alerts[0].poolId);
                 if (target) setSelectedPool(target.pool);
              }}
            >
              Review Pool
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-forest-900 text-white p-6 rounded-3xl relative overflow-hidden group">
           <div className="relative z-10">
             <p className="text-forest-200 text-sm font-medium mb-1">Total Monitored</p>
             <h2 className="text-4xl font-bold mb-4">{pools.length} <span className="text-lg font-normal text-forest-300">Pools</span></h2>
             <div className="flex items-center gap-2 text-xs bg-white/10 w-fit px-3 py-1 rounded-full">
               <ArrowUpRight size={14} />
               <span>Active monitoring</span>
             </div>
           </div>
           <motion.div 
             initial={{ opacity: 0.3 }}
             whileHover={{ scale: 1.2, rotate: 10, opacity: 0.5 }}
             className="absolute -right-4 -bottom-4 text-forest-800"
           >
             <Layers size={120} />
           </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm font-medium mb-1">Avg Safety Score</p>
               <h2 className="text-4xl font-bold text-gray-900">{avgScore}</h2>
             </div>
             <div className={`p-2 rounded-full ${avgScore >= 70 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
               <Shield size={24} />
             </div>
           </div>
           <div className="text-xs text-gray-400 mt-4">Weighted by TVL</div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm font-medium mb-1">Safe Pools</p>
               <h2 className="text-4xl font-bold text-gray-900">{safeCount}</h2>
             </div>
             <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
               <CheckCircle size={24} />
             </div>
           </div>
           <div className="text-xs text-gray-400 mt-4">Score {'>'} 70</div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-gray-500 text-sm font-medium mb-1">Pending Actions</p>
               <motion.h2 
                  key={alerts.length}
                  initial={{ scale: 1.5, color: '#ef4444' }}
                  animate={{ scale: 1, color: '#111827' }}
                  className="text-4xl font-bold text-gray-900"
               >
                 {alerts.length}
               </motion.h2>
             </div>
             <div className="p-2 bg-orange-50 text-orange-600 rounded-full">
               <AlertTriangle size={24} />
             </div>
           </div>
           <div className="text-xs text-gray-400 mt-4">Requires approval</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pool List */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Watchlist & Analysis</h2>
            <button className="text-sm font-semibold text-forest-600 hover:text-forest-700">View All</button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Asset / Protocol</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">TVL</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">APY</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Risk Score</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {poolAnalysis.map(({ pool, analysis }, index) => (
                  <motion.tr 
                    key={pool.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedPool(pool)}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                          {pool.name.substring(0,2)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{pool.name}</div>
                          <div className="text-xs text-gray-500">{pool.protocol} • {pool.chain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-right text-sm font-medium text-gray-600">
                      ${(pool.tvl / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className={`text-sm font-bold ${analysis.details.s_apy < 0.5 ? 'text-red-500' : 'text-green-600'}`}>
                        {(pool.apy * 100).toFixed(2)}%
                      </div>
                      {Math.abs(pool.apyChange24h) > 0.1 && (
                        <div className="text-[10px] text-red-500 font-medium mt-1">High Variance</div>
                      )}
                    </td>
                    <td className="py-5 px-6">
                       <div className="flex justify-center">
                         <motion.div 
                           initial={{ scale: 0.8 }}
                           animate={{ scale: 1 }}
                           className={`w-12 h-8 rounded-lg flex items-center justify-center text-sm font-bold border ${
                           analysis.score >= 70 ? 'bg-green-50 border-green-200 text-green-700' : 
                           analysis.score >= 50 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 
                           'bg-red-50 border-red-200 text-red-700'
                         }`}>
                           {analysis.score}
                         </motion.div>
                       </div>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <motion.button whileHover={{ x: 3, y: -3 }} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 group-hover:text-forest-600 transition-colors">
                        <ArrowUpRight size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Side Widgets */}
        <motion.div variants={itemVariants} className="space-y-6">
           {/* Portfolio Chart Widget */}
           <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-gray-900">Net Worth</h3>
               <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                 <TrendingUp size={12} /> +2.4%
               </div>
             </div>
             <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    {v: 1000}, {v: 1200}, {v: 1100}, {v: 1400}, {v: 1350}, {v: 1600}, {v: 1750}
                  ]}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#166534" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="v" 
                      stroke="#166534" 
                      strokeWidth={3} 
                      fill="url(#colorValue)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-2 text-2xl font-bold text-gray-900">$12,450.00</div>
             <div className="text-xs text-gray-400">Total Yield Generated: $450.22</div>
           </motion.div>

           {/* Agent Status */}
           <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-900 p-6 rounded-3xl text-white">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_#4ade80]"></div>
               <h3 className="font-semibold text-sm">Agent Active</h3>
             </div>
             <p className="text-gray-400 text-xs leading-relaxed mb-6">
               YieldBodyguard is currently monitoring {pools.length} pools in your wallet. Next scan in 45 seconds.
             </p>
             <div className="space-y-3">
               <div className="flex justify-between text-xs">
                 <span className="text-gray-500">Gas Balance</span>
                 <span className="font-mono">0.45 ETH</span>
               </div>
               <div className="flex justify-between text-xs">
                 <span className="text-gray-500">Auto-Rebalance</span>
                 <span className="text-green-400 font-bold">ON</span>
               </div>
             </div>
           </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};