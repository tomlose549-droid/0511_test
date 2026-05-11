/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundService } from './services/soundService';
import { 
  Trash2, 
  Archive, 
  Briefcase, 
  Luggage as SuitcaseIcon, 
  Cpu, 
  Sword, 
  Plane, 
  Package, 
  PlusSquare, 
  Monitor, 
  Lock, 
  Server, 
  ShieldCheck, 
  Bird,
  HelpCircle
} from 'lucide-react';

// --- 类型定义 ---
interface CardItem {
  name: string;
  probability: number;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
}

interface ActiveCard {
  instanceId: string;
  item: CardItem;
  status: 'back' | 'front';
}

// --- 配置数据 ---
const ITEM_POOL: CardItem[] = [
  { name: '垃圾桶', probability: 0.25, icon: <Trash2 />, color: 'bg-zinc-100', borderColor: 'border-zinc-400' },
  { name: '抽屉柜', probability: 0.14, icon: <Archive />, color: 'bg-amber-50', borderColor: 'border-amber-400' },
  { name: '手提箱', probability: 0.10, icon: <Briefcase />, color: 'bg-blue-50', borderColor: 'border-blue-400' },
  { name: '高级行李箱', probability: 0.10, icon: <SuitcaseIcon />, color: 'bg-purple-50', borderColor: 'border-purple-400' },
  { name: '电脑机箱', probability: 0.08, icon: <Cpu />, color: 'bg-slate-100', borderColor: 'border-slate-500' },
  { name: '武器箱', probability: 0.05, icon: <Sword />, color: 'bg-red-50', borderColor: 'border-red-600' },
  { name: '航空储物箱', probability: 0.03, icon: <Plane />, color: 'bg-sky-100', borderColor: 'border-sky-500' },
  { name: '快递箱', probability: 0.09, icon: <Package />, color: 'bg-yellow-50', borderColor: 'border-yellow-600' },
  { name: '医疗物资堆', probability: 0.03, icon: <PlusSquare />, color: 'bg-green-50', borderColor: 'border-green-500' },
  { name: '电脑', probability: 0.015, icon: <Monitor />, color: 'bg-indigo-50', borderColor: 'border-indigo-400' },
  { name: '小保险箱', probability: 0.015, icon: <Lock />, color: 'bg-orange-50', borderColor: 'border-orange-500' },
  { name: '服务器', probability: 0.015, icon: <Server />, color: 'bg-cyan-50', borderColor: 'border-cyan-500' },
  { name: '大保险箱', probability: 0.005, icon: <ShieldCheck />, color: 'bg-rose-100', borderColor: 'border-rose-700' },
  { name: '鸟窝', probability: 0.08, icon: <Bird />, color: 'bg-emerald-50', borderColor: 'border-emerald-400' },
];

// --- 辅助函数 ---
const getRandomItem = (): CardItem => {
  const rand = Math.random();
  let cumulative = 0;
  for (const item of ITEM_POOL) {
    cumulative += item.probability;
    if (rand < cumulative) return item;
  }
  return ITEM_POOL[0];
};

const getNewCardCount = (): number => {
  const rand = Math.random();
  if (rand < 0.25) return 2;
  if (rand < 0.40) return 3; // 0.25 + 0.15
  return 4; // 剩下的 60%
};

export default function App() {
  const [cards, setCards] = useState<ActiveCard[]>([]);

  // 生成新卡牌
  const handleGenerate = useCallback(() => {
    soundService.playWhoosh();
    const count = getNewCardCount();
    const newCards: ActiveCard[] = Array.from({ length: count }).map(() => ({
      instanceId: Math.random().toString(36).substr(2, 9),
      item: getRandomItem(),
      status: 'back',
    }));
    setCards(newCards);
  }, []);

  // 点击卡牌逻辑
  const handleCardClick = (id: string) => {
    setCards((prev) => {
      const cardIdx = prev.findIndex(c => c.instanceId === id);
      if (cardIdx === -1) return prev;
      
      const card = prev[cardIdx];
      
      if (card.status === 'back') {
        // 第一阶段：翻转到正面
        soundService.playFlip();
        const next = [...prev];
        next[cardIdx] = { ...card, status: 'front' };
        return next;
      } else {
        // 第二阶段：消失
        soundService.playDissolve();
        return prev.filter(c => c.instanceId !== id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] bg-tactical-grid p-8 flex flex-col items-center font-sans overflow-hidden">
      {/* 顶部战术状态栏 */}
      <div className="w-full flex justify-between items-center mb-12 border-b border-white/5 pb-4 px-4 opacity-50 font-mono text-[10px] tracking-[0.2em]">
        <div className="flex gap-8">
          <span>REGION: ZERO-DAM</span>
          <span>STATUS: OPERATIONAL</span>
        </div>
        <div className="flex gap-8">
          <span>COORDS: 31.2304 N, 121.4737 E</span>
          <span className="text-amber-500">SECURE LINK ACTIVE</span>
        </div>
      </div>

      {/* 核心按钮区域 */}
      <div className="mt-4 mb-20 relative group">
        <div className="absolute -inset-4 bg-amber-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          onClick={handleGenerate}
          className="relative px-20 py-10 bg-zinc-900 text-white rounded-sm font-display text-6xl shadow-2xl hover:bg-zinc-800 active:scale-95 transition-all tracking-widest border-2 border-zinc-700 overflow-hidden"
          id="generate-button"
        >
          {/* 按钮装饰线 */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-amber-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-amber-500" />
          
          <span className="relative z-10 drop-shadow-lg">零号大坝</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
        </button>
      </div>

      {/* 卡牌展示区域 */}
      <div className="w-full max-w-7xl flex justify-center items-start min-h-[450px]">
        <div className="flex gap-8 flex-nowrap p-4">
          <AnimatePresence mode="popLayout">
            {cards.map((card) => (
              <motion.div
                key={card.instanceId}
                layout
                initial={{ opacity: 0, y: 150, scale: 0.5, rotateX: 45, filter: 'blur(20px) brightness(2)' }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px) brightness(1)' }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.3, 
                  y: -150, 
                  rotateZ: 25,
                  filter: 'brightness(3) blur(40px)',
                  transition: { duration: 0.5, ease: "circIn" } 
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 25,
                  layout: { duration: 0.3 } 
                }}
                className="shrink-0 relative group"
              >
                {/* 战术彩色残影 - 青色层 (Cyan Ghost) */}
                <motion.div 
                  className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl -z-10 pointer-events-none"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0 }}
                  exit={{ x: -60, opacity: 0.8, scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* 战术彩色残影 - 品红层 (Magenta Ghost) */}
                <motion.div 
                  className="absolute inset-0 bg-magenta-500/20 rounded-lg blur-xl -z-10 pointer-events-none"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0 }}
                  exit={{ x: 60, opacity: 0.8, scale: 1.2 }}
                  transition={{ duration: 0.4 }}
                />

                {/* 主卡牌容器 */}
                <div
                  onClick={() => handleCardClick(card.instanceId)}
                  className="relative w-52 h-72 cursor-pointer preserve-3d"
                  style={{ perspective: '1200px' }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{ 
                      rotateY: card.status === 'back' ? 0 : 180,
                      boxShadow: card.status === 'front' 
                        ? '0 0 30px rgba(245,158,11,0.2)' 
                        : '0 30px 60px rgba(0,0,0,0.8)'
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 卡背 (Tactical Hardware) */}
                    <div className="absolute inset-0 backface-hidden w-full h-full bg-[#1a1c1e] rounded-lg border-2 border-zinc-800 flex flex-col items-center justify-center p-1 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
                      <div className="w-full h-full border border-zinc-700/50 rounded-md flex flex-col items-center justify-center relative overflow-hidden bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite]">
                         {/* 战术斜纹 */}
                         <div className="absolute top-4 left-4 right-4 flex justify-between opacity-20">
                           <div className="w-12 h-1 bg-amber-500" />
                           <div className="w-4 h-1 bg-zinc-500" />
                         </div>
                         
                         <div className="relative flex flex-col items-center gap-4">
                           <div className="w-24 h-24 border-2 border-zinc-600 rounded-full flex items-center justify-center">
                             <HelpCircle className="w-12 h-12 text-zinc-500" />
                           </div>
                           <span className="font-display text-xl text-zinc-600 tracking-widest uppercase">Encrypted</span>
                         </div>

                         <div className="absolute bottom-4 left-0 w-full flex gap-1 opacity-10">
                           {Array.from({length: 20}).map((_, i) => (
                             <div key={i} className="w-2 h-4 bg-amber-500 -skew-x-12" />
                           ))}
                         </div>
                      </div>
                    </div>

                    {/* 卡面 (HUD Interface) */}
                    <div 
                      className={`absolute inset-0 backface-hidden w-full h-full rounded-lg border-2 flex flex-col items-center justify-between bg-zinc-900 shadow-[0_30px_60px_rgba(0,0,0,0.8)] rotate-y-180 border-amber-500/30 overflow-hidden`}
                    >
                      {/* HUD 扫描背景层 */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_3px)]" />
                      
                      {/* 顶部信息 */}
                      <div className="w-full relative z-10 flex justify-between items-center p-3 font-mono text-[8px] bg-gradient-to-b from-white/5 to-transparent">
                        <div className="flex gap-2 items-center">
                          <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
                          <span className="text-zinc-500">UID: DF-{card.instanceId.slice(0,4)}</span>
                        </div>
                        <span className="text-amber-500/80 font-bold">PRB: {Math.round(card.item.probability * 1000) / 10}%</span>
                      </div>
                      
                      {/* 中心核心 */}
                      <div className="relative flex flex-col items-center gap-6 flex-1 justify-center w-full px-4">
                        <div className={`relative p-6 rounded-sm border-t-2 border-b-2 shadow-inner group-hover:scale-110 transition-transform ${card.item.borderColor} bg-zinc-800/50`}>
                          <div className="scale-[2.8] text-white brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {card.item.icon}
                          </div>
                          {/* 装饰边角 */}
                          <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-amber-500/50" />
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-amber-500/50" />
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl font-display text-white tracking-widest text-center">
                            {card.item.name}
                          </span>
                          <div className="flex gap-1">
                            {Array.from({length: 5}).map((_, i) => (
                              <div key={i} className={`w-3 h-1 ${i < 3 ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 底部详细参数 */}
                      <div className="w-full p-3 font-mono text-[8px] text-zinc-500 flex flex-col gap-1 bg-black/40 border-t border-white/5">
                        <div className="flex justify-between">
                          <span>CLASSIFICATION</span>
                          <span className="text-zinc-300">TACTICAL_GEAR</span>
                        </div>
                        <div className="flex justify-between">
                          <span>SERIAL_NO</span>
                          <span className="text-zinc-300">AS-992-K01</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 背景动态装饰 */}
      <div className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-end pointer-events-none opacity-[0.02] select-none font-display">
        <h2 className="text-[18rem] leading-none italic tracking-tighter -mb-20">DELTA</h2>
        <h2 className="text-[18rem] leading-none italic tracking-tighter -mb-20 text-right">FORCE</h2>
      </div>

      <style>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        @keyframes shimmer {
          0% { background-position: -100% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
    </div>
  );
}
