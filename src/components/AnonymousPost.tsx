import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Story } from '../types';
import { MessageCircle, Heart } from 'lucide-react';

interface AnonymousPostProps {
  story: Story;
}

export default function AnonymousPost({ story }: AnonymousPostProps) {
  return (
    <div className="bg-artistic-surface border border-artistic-line p-8 group hover:border-artistic-accent/30 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-artistic-line flex items-center justify-center text-[10px] font-bold text-artistic-muted">
            0X
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px]">Ẩn danh // {story.id.slice(-4)}</p>
            <p className="text-[9px] text-artistic-muted uppercase tracking-widest mt-1">
              {formatDistanceToNow(new Date(story.timestamp), { addSuffix: true, locale: vi })}
            </p>
          </div>
        </div>
        <span className="text-[10px] border border-artistic-accent text-artistic-accent px-3 py-1 font-bold uppercase tracking-[2px]">
          {story.mood}
        </span>
      </div>

      <p className="font-serif italic text-xl leading-relaxed mb-8 text-artistic-fg/90">
        "{story.content}"
      </p>

      <div className="flex items-center gap-6 text-artistic-muted">
        <button className="flex items-center gap-2 hover:text-artistic-accent transition-colors">
          <Heart size={14} />
          <span className="text-[10px] font-bold">12</span>
        </button>
        <button className="flex items-center gap-2 hover:text-artistic-accent transition-colors">
          <MessageCircle size={14} />
          <span className="text-[10px] font-bold">04</span>
        </button>
      </div>
    </div>
  );
}
