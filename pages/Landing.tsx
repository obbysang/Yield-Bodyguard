import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Bell, CheckCircle2, Zap, Lock, Search, Activity, ArrowRight, Smartphone, Globe, Shield } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface LandingProps {
  onConnect: () => void;
  onEnterDemo: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onConnect, onEnterDemo }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-hidden relative selection:bg-blue-100">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-3xl opacity-60 pointer-events-none mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-60 pointer-events-none mix-blend-multiply"></div>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-gray-900/10">
                        <ShieldCheck size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900">YieldBodyguard</span>
                </div>

                {/* Links */}
                <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-500">
                    <button onClick={onEnterDemo} className="hover:text-gray-900 transition-colors">Dashboard</button>
                    <button onClick={() => scrollTo('explore')} className="hover:text-gray-900 transition-colors">Explore</button>
                    <button onClick={() => scrollTo('risk-engine')} className="hover:text-gray-900 transition-colors">Risk Engine</button>
                    <button onClick={() => scrollTo('why-us')} className="hover:text-gray-900 transition-colors">Why Us</button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5">
                    <button onClick={onConnect} className="text-sm font-bold text-gray-900 hover:text-gray-600 hidden md:block transition-colors">Log In</button>
                    <button 
                        onClick={onConnect}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-900/10"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </nav>

        {/* Hero Section */}
        <header className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-40 pb-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
            {/* Text Section */}
            <div className="lg:w-1/2 text-left relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 mb-8 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-blue-100">
                         <CheckCircle2 size={14} strokeWidth={3} />
                         <span>#1 DeFi Security Platform (2025)</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-8">
                        Your DeFi safety <br className="hidden md:block" />
                        starts with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">trust.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
                        Join 15+ million investors who trust YieldBodyguard to trade and grow their crypto securely.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md w-full relative group">
                        <div className="relative w-full shadow-[0_2px_20px_rgba(0,0,0,0.04)] rounded-2xl transition-shadow group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
                                <span className="text-orange-500 text-xs font-bold">₿</span>
                             </div>
                            <input 
                                type="text" 
                                placeholder="satoshi@nakamoto.com" 
                                className="w-full bg-white border-0 pl-16 pr-32 py-5 rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-900 font-medium placeholder:text-gray-400 outline-none transition-all"
                            />
                             <button 
                                onClick={onConnect}
                                className="absolute right-2 top-2 bottom-2 bg-gray-900 text-white px-8 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                             >
                                Sign Up
                             </button>
                        </div>
                    </div>

                    <div className="mt-16 flex items-center gap-6">
                         <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=YieldBodyguard" alt="QR" className="w-12 h-12 opacity-80" />
                         </div>
                         <div className="text-sm font-medium text-gray-500 leading-tight">
                            Download the <br />
                            <span className="text-gray-900 font-bold">YieldBodyguard App</span> 📱
                         </div>
                    </div>
                </motion.div>
            </div>

            {/* Graphic Section */}
            <div className="lg:w-1/2 relative w-full flex justify-center lg:justify-end perspective-1000">
                {/* Floating Card */}
                <motion.div 
                    initial={{ opacity: 0, rotateY: -20, rotateX: 10, scale: 0.9 }}
                    animate={{ opacity: 1, rotateY: -12, rotateX: 5, scale: 1 }}
                    transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
                    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    className="relative w-full max-w-[480px] bg-white/70 backdrop-blur-2xl rounded-[3rem] p-8 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.15)] border border-white/80"
                >
                    {/* Inner Card Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                             <p className="text-gray-500 text-sm font-bold mb-2">Portfolio Value</p>
                             <h3 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">$ 91,134.76</h3>
                             <div className="flex items-center gap-2 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                                <TrendingUp size={14} className="text-green-600" />
                                <span className="text-green-700 font-bold text-xs">+$14,832.01 (19.44%)</span>
                             </div>
                        </div>
                        <div className="flex gap-3">
                             <div className="w-12 h-12 bg-white rounded-full shadow-lg shadow-gray-100 flex items-center justify-center text-gray-400 relative">
                                <Bell size={20} />
                                <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                             </div>
                             <div className="w-12 h-12 bg-gray-200 rounded-full border-4 border-white shadow-lg shadow-gray-100 overflow-hidden">
                                <img src="https://picsum.photos/seed/bg/100" alt="Profile" className="w-full h-full object-cover" />
                             </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="h-72 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={Array.from({length: 25}, (_, i) => ({val: 50 + Math.random() * 40 + i * 3 + (i > 15 ? i*4 : 0)}))}>
                                <defs>
                                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area 
                                    type="basis" 
                                    dataKey="val" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    fill="url(#grad1)" 
                                    animationDuration={2000}
                                />
                             </AreaChart>
                        </ResponsiveContainer>

                        {/* Floating Tooltip Mock */}
                         <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute top-[25%] left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl flex flex-col items-center"
                        >
                            <span className="text-[10px] text-gray-300 font-semibold mb-0.5">12 Jun 2025</span>
                            <span className="text-lg font-bold">$84,392.00</span>
                            {/* Line connecting to graph */}
                            <div className="absolute -bottom-10 left-1/2 w-0.5 h-10 bg-gray-900/20"></div>
                            <div className="absolute -bottom-10 left-1/2 w-2 h-2 -translate-x-[3px] bg-blue-500 rounded-full border-2 border-white"></div>
                         </motion.div>
                    </div>

                    {/* Y Axis Labels Mock */}
                    <div className="absolute right-6 top-32 flex flex-col gap-8 text-[10px] font-bold text-gray-300 text-right">
                        <span>€ 30,0k</span>
                        <span>€ 21,5k</span>
                        <span>€ 13,6k</span>
                    </div>
                </motion.div>
                
                {/* Decorative Elements */}
                <div className="absolute top-[10%] right-[10%] w-32 h-32 bg-purple-300 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
                <div className="absolute bottom-[20%] left-[20%] w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30 -z-10"></div>
            </div>
        </header>

        {/* Stats Section */}
        <div className="border-y border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: "Assets Protected", value: "$4.2B+" },
                    { label: "Active Users", value: "15M+" },
                    { label: "Pools Monitored", value: "250K+" },
                    { label: "Threats Blocked", value: "99.9%" }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>

        {/* Explore Section */}
        <section id="explore" className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2 block">Live Ecosystem</span>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Explore Safe Yields</h2>
                <p className="text-xl text-gray-500 leading-relaxed">
                    Our agent scans thousands of pools across Ethereum, Arbitrum, and Polygon in real-time. Here are today's top rated opportunities.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                     { name: 'Aave USDC', apy: '4.5%', tvl: '$890M', chain: 'Ethereum', score: 98 },
                     { name: 'Curve 3Pool', apy: '3.8%', tvl: '$450M', chain: 'Arbitrum', score: 95 },
                     { name: 'Lido stETH', apy: '3.2%', tvl: '$22B', chain: 'Ethereum', score: 92 },
                 ].map((pool, i) => (
                     <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                         <div className="flex justify-between items-start mb-4">
                             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-sm">
                                 {pool.name.substring(0, 2)}
                             </div>
                             <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                 Score: {pool.score}
                             </div>
                         </div>
                         <h3 className="font-bold text-xl text-gray-900 mb-1">{pool.name}</h3>
                         <div className="text-sm text-gray-500 mb-6">{pool.chain}</div>
                         <div className="flex justify-between items-end">
                             <div>
                                 <div className="text-xs text-gray-400 mb-1">APY</div>
                                 <div className="text-2xl font-bold text-gray-900">{pool.apy}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-xs text-gray-400 mb-1">TVL</div>
                                 <div className="font-semibold text-gray-700">{pool.tvl}</div>
                             </div>
                         </div>
                     </div>
                 ))}
            </div>
            
            <div className="text-center mt-12">
                <button onClick={onConnect} className="text-gray-900 font-bold flex items-center justify-center gap-2 mx-auto hover:text-blue-600 transition-colors">
                    View full leaderboard <ArrowRight size={18} />
                </button>
            </div>
        </section>

        {/* Risk Engine Section */}
        <section id="risk-engine" className="py-24 bg-gray-900 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold tracking-wider uppercase text-xs">
                             <Activity size={16} />
                             <span>Proprietary Tech</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
                            The engine that never sleeps.
                        </h2>
                        <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                            YieldBodyguard isn't just a dashboard. It's an autonomous agent running 24/7, analyzing on-chain data to calculate risk scores for every pool in your portfolio.
                        </p>

                        <div className="space-y-8">
                            {[
                                { title: 'Real-time Monitoring', desc: 'Scans mempool and block headers for APY spikes and liquidity drains.' },
                                { title: 'AI Risk Scoring', desc: 'Scores every pool 0-100 based on audit status, volatility, and concentration.' },
                                { title: 'Instant Response', desc: 'Can execute emergency exits in the same block a threat is detected.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                                        <p className="text-gray-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl">
                             <div className="flex items-center justify-between mb-8">
                                 <h3 className="font-bold text-lg">Live Analysis</h3>
                                 <div className="flex gap-2">
                                     <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                     <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                     <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                 </div>
                             </div>
                             
                             <div className="space-y-4 font-mono text-sm text-gray-300">
                                 <div className="flex justify-between p-3 bg-gray-800 rounded-lg border-l-4 border-green-500">
                                     <span>Analyzing Aave.USDC...</span>
                                     <span className="text-green-400">SAFE (98)</span>
                                 </div>
                                 <div className="flex justify-between p-3 bg-gray-800 rounded-lg border-l-4 border-green-500">
                                     <span>Analyzing Curve.3pool...</span>
                                     <span className="text-green-400">SAFE (95)</span>
                                 </div>
                                 <div className="flex justify-between p-3 bg-gray-800 rounded-lg border-l-4 border-red-500 animate-pulse bg-red-900/20">
                                     <span>Analyzing Degen.Farm...</span>
                                     <span className="text-red-400">CRITICAL (12)</span>
                                 </div>
                                <div className="p-4 mt-4 bg-gray-900 rounded-xl border border-gray-700 text-xs text-gray-500">
                                    &gt; Threat Detected: Rug Pull Pattern<br/>
                                    &gt; Initiating Auto-Exit Protocol...<br/>
                                    &gt; Success. Assets moved to Safety Vault.
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Why Us / Benefits */}
        <section id="why-us" className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                 <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Why top investors choose us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: Lock, title: "Non-Custodial", desc: "You maintain full control of your keys. We just act as the bodyguard." },
                    { icon: Zap, title: "Lightning Fast", desc: "Our infrastructure is co-located with major validators for fastest execution." },
                    { icon: Globe, title: "Multi-Chain", desc: "Seamless protection across Ethereum, L2s, and emerging chains." }
                ].map((item, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow text-center group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <item.icon size={32} />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-4">{item.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* CTA */}
        <div className="py-20 px-6">
            <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Ready to secure your yield?</h2>
                    <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">Start your free trial today. No credit card required.</p>
                    <button 
                        onClick={onConnect}
                        className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
                    >
                        Connect Wallet
                    </button>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                        <ShieldCheck size={16} />
                    </div>
                    <span className="font-bold text-lg text-gray-900">YieldBodyguard</span>
                </div>
                <div className="text-sm text-gray-500">
                    © 2025 YieldBodyguard Inc. All rights reserved.
                </div>
                <div className="flex gap-6 text-gray-400">
                    <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Discord</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Github</a>
                </div>
            </div>
        </footer>
    </div>
  );
};
