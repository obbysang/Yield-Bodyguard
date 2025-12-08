import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowUpRight, Wallet, PieChart as PieIcon, ArrowDownRight } from 'lucide-react';

const mockPositions = [
  { id: 1, asset: 'Curve.usd3CRV', balance: 5400.00, yield: 243.50, apy: 4.5, allocation: 45 },
  { id: 2, asset: 'Aave.USDC', balance: 4200.00, yield: 159.20, apy: 3.8, allocation: 35 },
  { id: 3, asset: 'Degen.Farm.V2', balance: 2400.00, yield: 450.00, apy: 85.0, allocation: 20 },
];

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444'];

const mockHistory = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: 10000 + (i * 50) + Math.random() * 500
}));

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const Portfolio: React.FC = () => {
  const totalBalance = mockPositions.reduce((acc, curr) => acc + curr.balance, 0);
  const totalYield = mockPositions.reduce((acc, curr) => acc + curr.yield, 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Wallet size={20} /></div>
             <span className="text-gray-500 text-sm font-medium">Total Balance</span>
           </div>
           <h2 className="text-3xl font-bold text-gray-900">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
           <div className="flex items-center gap-1 text-xs text-green-600 font-bold mt-2">
             <ArrowUpRight size={14} /> +$450.22 (3.2%)
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PieIcon size={20} /></div>
             <span className="text-gray-500 text-sm font-medium">Yield Earned</span>
           </div>
           <h2 className="text-3xl font-bold text-gray-900">${totalYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
           <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
             All time earnings
           </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><ArrowDownRight size={20} /></div>
             <span className="text-gray-500 text-sm font-medium">Impermanent Loss</span>
           </div>
           <h2 className="text-3xl font-bold text-gray-900">$12.45</h2>
           <div className="flex items-center gap-1 text-xs text-red-500 font-bold mt-2">
             0.1% of portfolio
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6">Performance History</h3>
           <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={mockHistory}>
                 <defs>
                   <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="day" hide />
                 <YAxis orientation="right" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} fill="url(#colorVal)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </motion.div>

        {/* Allocation */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
           <h3 className="font-bold text-gray-900 mb-2 w-full text-left">Allocation</h3>
           <div className="h-56 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={mockPositions}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="allocation"
                 >
                   {mockPositions.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">3</span>
                <span className="text-xs text-gray-400 ml-1">Assets</span>
             </div>
           </div>
           <div className="w-full space-y-2 mt-4">
             {mockPositions.map((pos, idx) => (
               <div key={pos.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-gray-600">{pos.asset}</span>
                  </div>
                  <span className="font-bold text-gray-900">{pos.allocation}%</span>
               </div>
             ))}
           </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Active Positions</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase">Asset</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase">Balance</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase">APY</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase">Yield Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockPositions.map((pos) => (
              <tr key={pos.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900">{pos.asset}</td>
                <td className="py-4 px-6 text-right text-gray-600">${pos.balance.toLocaleString()}</td>
                <td className="py-4 px-6 text-right font-bold text-green-600">{pos.apy}%</td>
                <td className="py-4 px-6 text-right text-gray-600">+${pos.yield.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};