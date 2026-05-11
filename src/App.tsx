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
    <div className="min-h-screen bg-zinc-200 p-8 flex flex-col items-center font-sans overflow-hidden">
      {/* 核心按钮区域 */}
      <div className="mt-8 mb-12">
        <button
          onClick={handleGenerate}
          className="px-16 py-8 bg-zinc-900 text-white rounded-2xl font-black text-4xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-zinc-800 active:scale-95 transition-all tracking-widest border-b-8 border-zinc-950 hover:border-b-4 hover:translate-y-1"
          id="generate-button"
        >
          零号大坝
        </button>
      </div>

      {/* 卡牌展示区域 - 使用 LayoutGroup 确保平滑补位 */}
      <div className="w-full max-w-6xl flex justify-center items-start min-h-[400px]">
        <div className="flex gap-6 flex-nowrap p-4">
          <AnimatePresence mode="popLayout">
            {cards.map((card) => (
              <motion.div
                key={card.instanceId}
                layout
                initial={{ opacity: 0, y: 100, scale: 0, rotate: -45, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.5, 
                  y: -100, 
                  rotate: 20, 
                  filter: 'blur(30px)',
                  transition: { duration: 0.4, ease: "easeIn" } 
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 400, 
                  damping: 30,
                  layout: { duration: 0.3 } 
                }}
                className="shrink-0"
              >
                <div
                  onClick={() => handleCardClick(card.instanceId)}
                  className="relative w-44 h-64 cursor-pointer preserve-3d group"
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    initial={false}
                    animate={{ rotateY: card.status === 'back' ? 0 : 180 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* 卡背 (Card Back) */}
                    <div className="absolute inset-0 backface-hidden w-full h-full bg-zinc-800 rounded-2xl border-4 border-zinc-700 flex flex-col items-center justify-center text-zinc-600 shadow-2xl">
                      <div className="w-full h-full border-2 border-zinc-700/50 rounded-xl m-2 flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
                         <HelpCircle className="w-20 h-20 opacity-20 rotate-12" />
                      </div>
                    </div>

                    {/* 卡面 (Card Front) */}
                    <div 
                      className={`absolute inset-0 backface-hidden w-full h-full rounded-2xl border-4 flex flex-col items-center justify-between p-5 bg-white shadow-2xl rotate-y-180 ${card.item.borderColor} ${card.item.color}`}
                    >
                      <div className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span>COLLECTION</span>
                        <span>{Math.floor(card.item.probability * 100)}%</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
                        <div className="p-4 bg-white/50 rounded-full shadow-inner scale-[2.2] text-zinc-900">
                          {card.item.icon}
                        </div>
                        <span className="text-xl font-black text-zinc-900 mt-8 text-center tracking-tight leading-none px-2 py-1 border-b-2 border-zinc-900/10">
                          {card.item.name}
                        </span>
                      </div>

                      <div className="w-full text-center py-2 bg-black/5 rounded-lg">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase">A-7 Type</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="fixed bottom-0 left-0 w-full p-12 flex justify-between items-end pointer-events-none opacity-5 select-none">
        <h2 className="text-[12rem] leading-none font-black italic tracking-tighter -mb-10">ZERO</h2>
        <h2 className="text-[12rem] leading-none font-black italic tracking-tighter -mb-10">DAM</h2>
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
      `}</style>
    </div>
  );
}
