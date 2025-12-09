import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { PoolDetailModal } from './components/PoolDetailModal';
import { PoolData, Alert } from './types';
import { computeScore } from './services/riskEngine';
import { fetchRealTimePools } from './services/defiData';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Pages & Components
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { ActivityLog } from './pages/ActivityLog';
import { Settings } from './pages/Settings';
import { Landing } from './pages/Landing';
import { WalletConnectModal } from './components/WalletConnectModal';
import { RebalanceModal } from './components/RebalanceModal';
import { checkAtpStatus } from './services/atp';
import { sendDiscord } from './services/notifications';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPool, setSelectedPool] = useState<PoolData | null>(null);
  const [targetRebalancePool, setTargetRebalancePool] = useState<PoolData | null>(null);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [originalPools, setOriginalPools] = useState<PoolData[]>([]); 
  const [hasAtp, setHasAtp] = useState(false);

  // Initial Fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchRealTimePools(15);
      // Pre-calc scores for initial data so we can sort/recommend
      const enriched = data.map(p => ({ ...p, score: computeScore(p).score }));
      setPools(enriched);
      setOriginalPools(enriched);
      setLoading(false);
    };
    loadData();
  }, []);

  // Poll for New Pools
  useEffect(() => {
    const interval = setInterval(async () => {
      // Pause polling if simulating or if user is on landing page (not connected & not demo)
      if (isSimulating || (!isConnected && !isDemoMode)) return; 

      const freshData = await fetchRealTimePools(30);
      
      setPools(currentPools => {
        const currentIds = new Set(currentPools.map(p => p.id));
        const newPools = freshData.filter(p => !currentIds.has(p.id));

        if (newPools.length > 0) {
           const enrichedNew = newPools.map(p => ({ ...p, score: computeScore(p).score }));
           
           const newAlerts: Alert[] = enrichedNew.map(p => ({
             id: `new-${p.id}-${Date.now()}`,
             poolId: p.id,
             title: 'New Yield Opportunity Detected',
             message: `Agent discovered ${p.name} on ${p.chain} with ${(p.apy * 100).toFixed(2)}% APY.`,
             type: 'info',
             timestamp: Date.now()
           }));
           
           setAlerts(prev => [...newAlerts, ...prev]);
           newAlerts.forEach(a => sendDiscord(`${a.title}: ${a.message}`));
           return [...enrichedNew, ...currentPools]; 
        }
        return currentPools;
      });
    }, 15000); 

    return () => clearInterval(interval);
  }, [isSimulating, isConnected, isDemoMode]);

  // Compute analysis for all pools
  const poolAnalysis = useMemo(() => {
    return pools.map(pool => ({
      pool,
      analysis: computeScore(pool)
    }));
  }, [pools]);

  // Find Safe Alternative (Simple heuristic: highest score > 80)
  const safeRecommendation = useMemo(() => {
     return pools.find(p => (p.score || 0) > 80) || pools[0];
  }, [pools]);

  // Stats
  const safeCount = poolAnalysis.filter(p => p.analysis.score >= 70).length;
  const avgScore = pools.length > 0 
    ? Math.round(poolAnalysis.reduce((acc, curr) => acc + curr.analysis.score, 0) / pools.length) 
    : 0;

  // Simulation Logic
  const toggleSimulation = () => {
    if (isSimulating) {
      setPools(originalPools);
      setAlerts([]);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      if (pools.length > 0) {
        const targetId = pools[0].id;
        const attackedPools = pools.map(p => {
          if (p.id === targetId) {
            const compromised = {
              ...p,
              apy: 3.5, 
              apyChange24h: 30.0,
              tokenVol: 0.9,
              tvl: p.tvl * 0.7 
            };
            return { ...compromised, score: computeScore(compromised).score };
          }
          return p;
        });
        setPools(attackedPools);
        
        const newAlert: Alert = {
          id: Date.now().toString(),
          poolId: targetId,
          title: 'CRITICAL RISK ALERT',
          message: `${pools[0].name} APY spiked +3000% in 1 block. Potential governance attack or inflation bug.`,
          type: 'critical',
          timestamp: Date.now()
        };
        setAlerts([newAlert]);
        sendDiscord(`${newAlert.title}: ${newAlert.message}`)
      }
    }
  };

  const handleRebalanceRequest = () => {
    setTargetRebalancePool(safeRecommendation || pools[1]);
    setShowRebalanceModal(true);
    setSelectedPool(null);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setIsDemoMode(false);
  };

  // Only show landing if not connected AND not in demo mode
  if (!isConnected && !isDemoMode) {
    return (
      <>
        <Landing 
          onConnect={() => setShowConnectModal(true)} 
          onEnterDemo={() => setIsDemoMode(true)}
        />
        <WalletConnectModal 
          isOpen={showConnectModal} 
          onClose={() => setShowConnectModal(false)}
          onConnect={(address) => {
            setWalletAddress(address);
            setShowConnectModal(false);
            setIsConnected(true);
            checkAtpStatus(address).then(setHasAtp).catch(() => setHasAtp(false));
          }}
        />
      </>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onDisconnect={handleDisconnect}
        isConnected={isConnected}
      />
      
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-screen overflow-y-auto">
        <Header notifications={alerts.length} walletAddress={walletAddress} />
        
        <main className="p-8 max-w-7xl mx-auto w-full">
           {loading ? (
             <div className="flex flex-col items-center justify-center h-[60vh]">
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                 className="text-forest-600 mb-4"
               >
                 <RefreshCw size={40} />
               </motion.div>
               <h2 className="text-xl font-bold text-gray-900">Scanning DeFi Protocols...</h2>
               <p className="text-gray-500 mt-2">Fetching real-time yields from Ethereum, Arbitrum, and Polygon.</p>
             </div>
           ) : (
             <AnimatePresence mode="wait">
               {activeTab === 'dashboard' && (
                 <Dashboard 
                   key="dashboard"
                   pools={pools} 
                   alerts={alerts} 
                   isSimulating={isSimulating}
                   toggleSimulation={toggleSimulation}
                   setSelectedPool={setSelectedPool}
                   poolAnalysis={poolAnalysis}
                   avgScore={avgScore}
                   safeCount={safeCount}
                 />
               )}
               {activeTab === 'portfolio' && <Portfolio key="portfolio" />}
               {activeTab === 'activity' && <ActivityLog key="activity" />}
              {activeTab === 'settings' && <Settings key="settings" hasAtp={hasAtp} />}
             </AnimatePresence>
           )}
        </main>
      </div>

      {selectedPool && (
        <PoolDetailModal 
          pool={selectedPool}
          analysis={poolAnalysis.find(p => p.pool.id === selectedPool.id)!.analysis}
          recommendation={safeRecommendation}
          onClose={() => setSelectedPool(null)}
          onRebalance={handleRebalanceRequest}
        />
      )}

      {showRebalanceModal && targetRebalancePool && (
         <RebalanceModal 
           sourcePool={selectedPool || pools[0]} 
           targetPool={targetRebalancePool}
           onClose={() => setShowRebalanceModal(false)}
           onConfirm={() => {
             setShowRebalanceModal(false);
             setAlerts(prev => [{
               id: Date.now().toString(), 
               poolId: targetRebalancePool.id, 
               title: 'Rebalance Executed', 
               message: `Successfully moved assets to ${targetRebalancePool.name}`, 
               type: 'info', 
               timestamp: Date.now() 
             }, ...prev]);
             sendDiscord(`Rebalance Executed: Successfully moved assets to ${targetRebalancePool.name}`)
           }}
         />
      )}
    </div>
  );
};

export default App;
