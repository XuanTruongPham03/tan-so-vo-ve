import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Maximize2, X } from 'lucide-react';
import { Track } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function AudioPlayer({ currentTrack, isPlaying, setIsPlaying, onNext, onPrev }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      setProgress((current / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  if (!currentTrack) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="relative bg-black/90 backdrop-blur-3xl border-t border-artistic-line px-4 py-4 md:px-12 z-50 flex flex-col gap-3"
    >
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />
      
      {/* Progress Bar */}
      <div className="w-full flex items-center gap-4 group">
        <span className="text-[9px] text-artistic-muted font-mono tracking-widest">{formatTime(currentTime)}</span>
        <div className="flex-1 relative h-[2px] bg-artistic-line group-hover:h-1 transition-all">
           <input 
            type="range" 
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div 
            className="absolute top-0 left-0 h-full bg-artistic-accent shadow-[0_0_10px_#d4ff00]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <span className="text-[9px] text-artistic-muted font-mono tracking-widest">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-between gap-4 md:gap-8">
        {/* Track Info */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 md:w-1/4 min-w-0">
          <div className="relative group shrink-0">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title}
              className="w-10 h-10 md:w-14 md:h-14 rounded-none object-cover border border-artistic-line grayscale group-hover:grayscale-0 transition-all"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden">
            <h4 className="font-serif italic text-sm md:text-base truncate leading-none mb-1">{currentTrack.title}</h4>
            <p className="text-[9px] md:text-[10px] text-artistic-muted uppercase tracking-[1px] md:tracking-[2px] truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 md:gap-8 shrink-0">
          <button onClick={onPrev} className="hidden sm:block text-artistic-muted hover:text-white transition-colors">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 md:w-14 md:h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
          </button>
          <button onClick={onNext} className="text-artistic-muted hover:text-white transition-colors">
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>

        {/* Extra Controls */}
        <div className="hidden md:flex items-center gap-6 w-1/4 justify-end">
          <div className="flex items-center gap-3 group">
            <Volume2 size={16} className="text-artistic-muted group-hover:text-artistic-accent" />
            <div className="w-24 h-[1px] bg-artistic-line relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2/3 h-full bg-artistic-accent" />
            </div>
          </div>
          <button className="text-artistic-muted hover:text-artistic-accent transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
