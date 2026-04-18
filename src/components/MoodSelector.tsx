import React from 'react';
import { Mood } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const MOODS: { label: Mood; emoji: string }[] = [
  { label: 'stress', emoji: '🤯' },
  { label: 'buồn', emoji: '😢' },
  { label: 'mất động lực', emoji: '📉' },
  { label: 'mệt mỏi', emoji: '😫' },
  { label: 'cô đơn', emoji: '👤' },
  { label: 'bình yên', emoji: '🌿' },
];

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
}

export default function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {MOODS.map((m) => (
        <motion.button
          key={m.label}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(m.label)}
          className={cn(
            "flex items-center gap-3 px-6 py-3 transition-all duration-300 border uppercase text-[10px] font-bold tracking-[2px]",
            selectedMood === m.label 
              ? "bg-artistic-accent border-artistic-accent text-black" 
              : "bg-black border-artistic-line text-artistic-muted hover:border-artistic-accent hover:text-artistic-fg"
          )}
        >
          <span className="grayscale contrast-125">{m.emoji}</span>
          <span>{m.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
