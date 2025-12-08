import React, { useEffect, useState } from 'react';
import { X, ExternalLink, ShieldAlert, Activity, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { PoolData, RiskAnalysisResult } from '../types';
import { getAiRiskExplanation } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface PoolDetailModalProps {
  pool: PoolData;
  analysis: RiskAnalysisResult;
  recommendation?: PoolData;
  onClose: () => void;
  onRebalance: () => void;
}

// Mock chart data for visual polish
const generateChartData = () => 
  Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    apy: 5 + Math.random() * 20,
    tvl: 1000000 + Math.random() * 500000
  }));


export const PoolDetailModal: React.FC<PoolDetailModalProps> = ({ pool, analysis, recommendation, onClose, onRebalance }) => {
  const [aiExplanation, setAiExplanation] = useState<string>("Agent analyzing...");
  const [loadingAi, setLoadingAi] = useState(true);
  const chartData = generateChartData();

  useEffect(() => {
    let mounted = true;
    getAiRiskExplanation(pool, analysis).then(text => {
      if (mounted) {
        setAiExplanation(text);
        setLoadingAi(false);
      }
    });
    return () => { mounted = false; };
  }, [pool, analysis]);

  const scoreColor = analysis.score >= 70 ? 'text-green-600 bg-green-50' : 
                     analysis.score >= 50 ? 'text-yellow-600 bg-yellow-50' : 
                     'text-red-600 bg-red-50';
  
  const scoreRing = analysis.score >= 70 ? 'stroke-green-500' : 
                    analysis.score >= 50 ? 'stroke-yellow-500' : 
                    'stroke-red-500';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row relative z-10"
        >
          
          {/* Left Panel: Score & Actions */}
          <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 flex flex-col items-center text-center">
            <div className="w-full flex justify-between items-center mb-6 md:hidden">
              <h2 className="font-bold text-lg">Risk Analysis</h2>
              <button onClick={onClose}><X size={24} /></button>
            </div>

            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
               <svg className="w-full h-full transform -rotate-90">
                 {/* Background Circle */}
                 <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                 {/* Animated Score Circle */}
                 <motion.circle 
                   cx="80" cy="80" r="70" 
                   stroke="currentColor" 
                   strokeWidth="12" 
                   fill="none"
                   className={scoreRing}
                   strokeLinecap="round"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: analysis.score / 100 }}
                   transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                 />
               </svg>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.5 }}
                 className="absolute flex flex-col items-center"
               >
                 <span className="text-4xl font-bold text-gray-800">{analysis.score}</span>
                 <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Score</span>
               </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${scoreColor}`}
            >
              {analysis.score >= 70 ? 'SAFE' : analysis.score >= 50 ? 'CAUTION' : 'HIGH RISK'}
            </motion.div>

            <div className="w-full space-y-3">
               {analysis.score < 70 && recommendation ? (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRebalance}
                    className="w-full bg-forest-600 hover:bg-forest-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft size={18} />
                    Switch to {recommendation.name.split('.')[0]}
                  </motion.button>
               ) : (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-bold bg-green-50 py-3 rounded-xl mb-2">
                     <CheckCircle size={18} /> Pool is Safe
                  </div>
               )}

               {analysis.score < 50 && (
                  <button className="text-xs text-red-500 font-semibold underline mt-2 hover:text-red-700">
                    Force Emergency Exit
                  </button>
               )}

               <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
               >
                  <ExternalLink size={18} />
                  View Contract
               </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-left w-full"
            >
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Drivers</h4>
              <div className="space-y-2 text-sm text-gray-600">
                 <div className="flex justify-between">
                   <span>TVL Score</span>
                   <span className="font-medium text-gray-900">{(analysis.details.s_tvl * 100).toFixed(0)}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Audit Status</span>
                   <span className="font-medium text-gray-900">{analysis.details.s_audit === 1 ? 'Verified' : 'Unverified'}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Volatility</span>
                   <span className="font-medium text-gray-900">{(analysis.details.s_volatility * 100).toFixed(0)}</span>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Details & AI */}
          <div className="md:w-2/3 p-8 relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hidden md:block">
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                {pool.name.substring(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{pool.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase font-semibold">{pool.protocol}</span>
                  <span>•</span>
                  <span>{pool.chain}</span>
                </div>
              </div>
            </div>

            {/* AI Explanation Box */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-forest-50 border border-forest-100 rounded-xl p-5 mb-8"
            >
               <div className="flex items-center gap-2 mb-2 text-forest-800 font-semibold">
                  <Activity size={18} />
                  <h3>Agent Insight</h3>
               </div>
               <p className="text-forest-900 leading-relaxed text-sm">
                 {loadingAi ? (
                   <span className="animate-pulse">Analyzing pool metrics against real-time risk vectors...</span>
                 ) : (
                   aiExplanation
                 )}
               </p>
            </motion.div>

            {/* Safe Alternative Section */}
            {recommendation && analysis.score < 70 && (
              <div className="mb-8">
                 <h4 className="text-sm font-semibold text-gray-900 mb-3">Safe Alternative Detected</h4>
                 <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={onRebalance}>
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                         {recommendation.name.substring(0,2)}
                       </div>
                       <div>
                         <div className="font-bold text-gray-900 text-sm">{recommendation.name}</div>
                         <div className="text-xs text-green-600 font-semibold">Score: {recommendation.score} • APY: {(recommendation.apy * 100).toFixed(2)}%</div>
                       </div>
                    </div>
                    <ArrowRightLeft size={16} className="text-gray-400" />
                 </div>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Total Value Locked', value: `$${pool.tvl.toLocaleString()}` },
                { label: 'Current APY', value: `${(pool.apy * 100).toFixed(2)}%`, highlight: pool.apy > 1 },
                { label: 'Concentration', value: `${(pool.concentration * 100).toFixed(1)}%` },
                { label: 'Liquidity Depth', value: `$${pool.liquidityDepth.toLocaleString()}` },
              ].map((metric, i) => (
                <motion.div 
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-4 rounded-xl"
                >
                  <div className="text-gray-500 text-xs mb-1">{metric.label}</div>
                  <div className={`text-xl font-bold ${metric.highlight ? 'text-red-500' : 'text-gray-900'}`}>{metric.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="h-48 w-full"
            >
              <h4 className="text-sm font-semibold text-gray-900 mb-4">30 Day APY History</h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorApy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#166534', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="apy" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorApy)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};