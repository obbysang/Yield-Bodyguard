import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, RefreshCw, Shield, ArrowRightLeft } from 'lucide-react';

const mockLogs = [
  { id: 1, type: 'risk_check', title: 'Routine Risk Scan', desc: 'All 3 pools analyzed. No anomalies detected.', time: '10 mins ago', status: 'success' },
  { id: 2, type: 'rebalance', title: 'Auto-Rebalance Executed', desc: 'Moved 1000 USDC from Curve to Aave for +0.5% APY.', time: '2 hours ago', status: 'info' },
  { id: 3, type: 'alert', title: 'High Volatility Detected', desc: 'Degen.Farm.V2 token volatility exceeded 40%.', time: '5 hours ago', status: 'warning' },
  { id: 4, type: 'risk_check', title: 'Routine Risk Scan', desc: 'All 3 pools analyzed. No anomalies detected.', time: '6 hours ago', status: 'success' },
  { id: 5, type: 'connect', title: 'Wallet Connected', desc: 'Session started for 0x71...39A2', time: '1 day ago', status: 'info' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export const ActivityLog: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Agent Activity Log</h2>
        
        <div className="relative border-l-2 border-gray-100 ml-4 space-y-10 pb-4">
          {mockLogs.map((log) => {
             let Icon = Shield;
             let colorClass = 'bg-gray-100 text-gray-600';
             
             if (log.type === 'risk_check') { Icon = CheckCircle; colorClass = 'bg-green-100 text-green-600'; }
             if (log.type === 'alert') { Icon = AlertTriangle; colorClass = 'bg-red-100 text-red-600'; }
             if (log.type === 'rebalance') { Icon = ArrowRightLeft; colorClass = 'bg-blue-100 text-blue-600'; }
             if (log.type === 'connect') { Icon = RefreshCw; colorClass = 'bg-indigo-100 text-indigo-600'; }

             return (
               <motion.div variants={itemVariants} key={log.id} className="relative pl-8">
                 <div className={`absolute -left-[21px] top-0 w-10 h-10 rounded-full border-4 border-white ${colorClass} flex items-center justify-center`}>
                   <Icon size={18} />
                 </div>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                   <div>
                     <h3 className="font-bold text-gray-900 text-base">{log.title}</h3>
                     <p className="text-gray-500 text-sm mt-1">{log.desc}</p>
                   </div>
                   <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">{log.time}</span>
                 </div>
               </motion.div>
             );
          })}
        </div>
        
        <button className="w-full mt-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 font-medium rounded-xl transition-colors">
          Load Older Activity
        </button>
      </div>
    </motion.div>
  );
};