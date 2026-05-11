/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SquareStack, 
  RotateCcw, 
  Plus, 
  Trophy, 
  Layers,
  Heart,
  Diamond,
  Club,
  Spade
} from 'lucide-react';

// --- Types ---
type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

// --- Utilities ---
const SUITS: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
      });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const getSuitIcon = (suit: Suit) => {
  switch (suit) {
    case 'Hearts': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
    case 'Diamonds': return <Diamond className="w-5 h-5 text-red-500 fill-red-500" />;
    case 'Clubs': return <Club className="w-5 h-5 text-zinc-900 fill-zinc-900" />;
    case 'Spades': return <Spade className="w-5 h-5 text-zinc-900 fill-zinc-900" />;
  }
};

// --- Components ---

const Card = ({ card, index, isNew }: { card: CardData; index: number; isNew?: boolean }) => {
  return (
    <motion.div
      layoutId={card.id}
      initial={isNew ? { y: 100, opacity: 0, scale: 0.8, rotate: -15 } : false}
      animate={{ y: 0, opacity: 1, scale: 1, rotate: index * 2 - 5 }}
      exit={{ scale: 0.5, opacity: 0 }}
      whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.2 } }}
      className="relative w-32 h-48 bg-white rounded-xl shadow-lg border border-zinc-200 flex flex-col justify-between p-3 cursor-pointer shrink-0 select-none"
      style={{
        zIndex: index,
        marginLeft: index === 0 ? 0 : '-3rem',
      }}
    >
      <div className="flex flex-col items-start">
        <span className="text-xl font-bold leading-none">{card.rank}</span>
        {getSuitIcon(card.suit)}
      </div>
      
      <div className="flex justify-center items-center">
        <div className="scale-150">
          {getSuitIcon(card.suit)}
        </div>
      </div>
      
      <div className="flex flex-col items-end rotate-180">
        <span className="text-xl font-bold leading-none">{card.rank}</span>
        {getSuitIcon(card.suit)}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [deck, setDeck] = useState<CardData[]>(() => createDeck());
  const [hand, setHand] = useState<CardData[]>([]);
  const [history, setHistory] = useState<CardData[]>([]);

  const drawCard = useCallback(() => {
    if (deck.length === 0) return;
    
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setDeck(newDeck);
    setHand((prev) => [...prev, card]);
  }, [deck]);

  const resetGame = () => {
    setDeck(createDeck());
    setHand([]);
    setHistory([]);
  };

  const playCard = (cardId: string) => {
    const card = hand.find((c) => c.id === cardId);
    if (!card) return;
    
    setHand((prev) => prev.filter((c) => c.id !== cardId));
    setHistory((prev) => [card, ...prev].slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <SquareStack className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Card Duel</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Deck Remaining</span>
            <span className="font-mono text-xl font-medium">{deck.length}</span>
          </div>
          <button 
            onClick={resetGame}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5 text-zinc-600" />
          </button>
        </div>
      </header>

      <main className="w-full max-w-5xl flex flex-col gap-12 items-center flex-1">
        {/* Play Area / History */}
        <section className="relative w-full h-64 flex justify-center items-center">
          <div className="absolute inset-0 border-2 border-dashed border-zinc-200 rounded-3xl -z-10 bg-white/50" />
          <AnimatePresence mode="popLayout text-center">
            {history.length > 0 ? (
              <div className="flex items-center gap-4">
                {history.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ 
                      opacity: 1 - (i * 0.2), 
                      scale: 1 - (i * 0.05),
                      x: -i * 10,
                      y: 0,
                      zIndex: history.length - i
                    }}
                    className="absolute"
                  >
                    <Card card={card} index={0} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-zinc-300 gap-2">
                <Trophy className="w-12 h-12" />
                <p className="font-medium">Play a card from your hand</p>
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Hand Area */}
        <section className="w-full flex flex-col items-center gap-8 mt-auto mb-10">
          <div className="flex justify-center w-full overflow-x-auto pb-8 px-8 min-h-[220px]">
            <AnimatePresence>
              {hand.map((card, index) => (
                <div key={card.id} onClick={() => playCard(card.id)}>
                  <Card card={card} index={index} isNew />
                </div>
              ))}
            </AnimatePresence>
            
            {hand.length === 0 && (
              <div className="flex items-center justify-center p-12 border-2 border-dashed border-zinc-200 rounded-xl w-32 h-48 bg-white/30 text-zinc-300">
                <span className="text-sm font-medium italic">Empty Hand</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={drawCard}
              disabled={deck.length === 0}
              className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Draw Card
            </button>
            <div className="h-10 w-px bg-zinc-200 mx-2" />
            <div className="flex items-center gap-2 p-2 bg-white rounded-full shadow-sm border border-zinc-200 px-4">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold">{hand.length} Hand</span>
            </div>
          </div>
        </section>
      </main>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 p-8 opacity-10 pointer-events-none select-none">
        <h2 className="text-[15rem] leading-none font-black italic tracking-tighter">DUEL</h2>
      </div>
    </div>
  );
}
