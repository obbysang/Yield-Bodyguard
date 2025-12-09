import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { PoolData } from '../types';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { mainnet, arbitrum, polygon } from 'viem/chains';
import type { Address } from 'viem';
import { REBALANCE_SPENDER_ADDRESS } from '../services/config';

interface RebalanceModalProps {
  sourcePool: PoolData;
  targetPool: PoolData; // The safe alternative
  onClose: () => void;
  onConfirm: () => void;
}

export const RebalanceModal: React.FC<RebalanceModalProps> = ({ sourcePool, targetPool, onClose, onConfirm }) => {
  const [step, setStep] = useState<'review' | 'sign' | 'success'>('review');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  const { writeContractAsync } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })
  const { address } = useAccount()
  const chainId = useChainId()
  const chain = chainId === 1 ? mainnet : chainId === 42161 ? arbitrum : chainId === 137 ? polygon : mainnet

  const handleSign = async () => {
    setStep('sign');
    const erc20 = [{
      type: 'function',
      name: 'approve',
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ type: 'bool' }],
      stateMutability: 'nonpayable'
    }] as const
    try {
      const tokenAddress: Address = (sourcePool.tokenAddress || '0x0000000000000000000000000000000000000000') as Address
      const spender: Address = (sourcePool.spenderAddress || REBALANCE_SPENDER_ADDRESS) as Address
      const amount = 1000000n
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: erc20,
        functionName: 'approve',
        args: [spender, amount],
        account: address as Address,
        chain
      })
      setTxHash(hash)
      setStep('success')
    } catch {
      setStep('review')
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-lg rounded-3xl overflow-hidden relative z-10 shadow-2xl"
        >
          {step === 'review' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Action</h2>
              <p className="text-gray-500 text-sm mb-6">Move assets from high-risk pool to a safe alternative.</p>

              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex-1 p-4 bg-red-50 rounded-xl border border-red-100 text-center">
                   <div className="text-xs text-red-600 font-bold uppercase mb-1">Exiting</div>
                   <div className="font-bold text-gray-900">{sourcePool.name}</div>
                   <div className="text-sm text-red-500 mt-1">Score: {sourcePool.score || 30}</div>
                </div>
                <ArrowRight className="text-gray-300" />
                <div className="flex-1 p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                   <div className="text-xs text-green-600 font-bold uppercase mb-1">Entering</div>
                   <div className="font-bold text-gray-900">{targetPool.name}</div>
                   <div className="text-sm text-green-600 mt-1">Score: {targetPool.score || 95}</div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <h4 className="font-bold text-sm text-gray-900">Transaction Preview</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-mono font-medium">$5,400.00 USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Est. Gas Fee</span>
                  <span className="font-mono font-medium text-forest-600">$4.50 (L2)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Slippage</span>
                  <span className="font-mono font-medium">0.05%</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                <button 
                  onClick={handleSign}
                  className="flex-[2] py-3 bg-forest-600 hover:bg-forest-700 text-white font-bold rounded-xl shadow-lg shadow-forest-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Sign & Execute <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 'sign' && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 size={48} className="text-forest-600 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Waiting for confirmation</h3>
              <p className="text-gray-500">Please sign the transaction in your wallet.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rebalance Complete!</h3>
              <p className="text-gray-500 mb-8">Your assets have been moved to {targetPool.name}.</p>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
