import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useConnect } from 'wagmi';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

// Extend window interface for Ethereum provider
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connectors, connectAsync } = useConnect()

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const injected = connectors.find(c => c.id === 'io.metamask' || c.name.toLowerCase().includes('injected')) || connectors[0]
      const res = await connectAsync({ connector: injected })
      setConnecting(false)
      onConnect((res as any).accounts?.[0] || '')
    } catch (e: any) {
      setConnecting(false)
      if (e?.name === 'UserRejectedRequestError') setError('Connection rejected by user.')
      else setError('Failed to connect wallet. Please try again.')
    }
  };

  const handleInstall = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Connect Wallet</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleConnect}
                disabled={connecting}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-gray-700 block">MetaMask</span>
                    <span className="text-xs text-gray-500">Connect to your web3 wallet</span>
                  </div>
                </div>
                {connecting ? <Loader2 className="animate-spin text-forest-600" /> : <div className="w-3 h-3 bg-gray-300 rounded-full group-hover:bg-green-400 transition-colors" />}
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all opacity-60 cursor-not-allowed">
                 <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-500">
                    WC
                  </div>
                  <span className="font-bold text-gray-700">WalletConnect</span>
                </div>
              </button>
            </div>

            {error && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center justify-between"
               >
                 <div className="flex items-center gap-2">
                   <AlertCircle size={16} />
                   <span>{error}</span>
                 </div>
                 {error.includes("not installed") && (
                   <button onClick={handleInstall} className="text-xs font-bold underline flex items-center gap-1">
                     Install <ExternalLink size={10} />
                   </button>
                 )}
               </motion.div>
            )}

            <p className="text-xs text-center text-gray-400 mt-6">
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
