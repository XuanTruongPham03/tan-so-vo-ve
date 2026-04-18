import React from 'react';
import { Play, Headset, MessageCircle } from 'lucide-react';
import { Track } from '../types';
import { cn } from '../lib/utils';

interface TrackCardProps {
  track: Track;
  isActive?: boolean;
  onClick: () => void;
}

export default function TrackCard({ track, isActive, onClick }: TrackCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative bg-artistic-surface p-4 md:p-6 transition-all duration-300 cursor-pointer overflow-hidden",
        "border border-transparent hover:border-artistic-accent/30",
        isActive && "border-artistic-accent bg-artistic-accent/5"
      )}
    >
      <div className="relative aspect-square mb-4 md:mb-6 overflow-hidden">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute inset-0 bg-artistic-accent/0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500",
          isActive && "opacity-100 bg-artistic-accent/10"
        )}>
          <div className="w-14 h-14 bg-artistic-accent text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,255,0,0.3)] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Play size={20} fill="currentColor" className={cn("ml-1")} />
          </div>
        </div>
        
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-black text-[8px] font-bold text-artistic-accent uppercase tracking-[2px] px-3 py-1 border border-artistic-accent/20">
            {track.type === 'music' ? 'Nhạc' : 'Podcast'}
          </span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-serif italic text-lg mb-1 truncate leading-tight transition-colors group-hover:text-artistic-accent">
          {track.title}
        </h3>
        <p className="text-[10px] text-artistic-muted uppercase tracking-[2px] truncate">
          {track.artist}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {track.mood.map(m => (
          <span key={m} className="text-[8px] text-artistic-muted uppercase tracking-[1px] font-bold border-b border-artistic-line pb-0.5">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
