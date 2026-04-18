export type Mood = 'stress' | 'buồn' | 'mất động lực' | 'mệt mỏi' | 'cô đơn' | 'bình yên' | 'tâm sự';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  mood: string[]; // Use string array for flexibility with mock data
  type: 'music' | 'podcast';
  duration: number; // in seconds
}

export interface Story {
  id: string;
  content: string;
  timestamp: string;
  mood: string;
}
