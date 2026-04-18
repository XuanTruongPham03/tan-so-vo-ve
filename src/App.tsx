import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Library, 
  Mic2, 
  MessageSquare, 
  Heart, 
  Calendar, 
  Timer,
  Info,
  Menu,
  X,
  Search,
  Sparkles,
  ChevronRight,
  ArrowRight,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track, Mood, Story } from './types';
import { MOCK_TRACKS, MOCK_STORIES } from './data/mockData';
import AudioPlayer from './components/AudioPlayer';
import TrackCard from './components/TrackCard';
import MoodSelector from './components/MoodSelector';
import AnonymousPost from './components/AnonymousPost';
import { cn } from './lib/utils';
import { getMoodAdvice, getRecommendedTracks } from './services/geminiService';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mood State
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [moodAdvice, setMoodAdvice] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [recReason, setRecReason] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [posts, setPosts] = useState<Story[]>(MOCK_STORIES);
  const [newNote, setNewNote] = useState('');

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood);
    setIsAiLoading(true);
    setMoodAdvice(null);
    setRecommendations([]);
    
    const [advice, recs] = await Promise.all([
      getMoodAdvice(mood),
      getRecommendedTracks(mood, MOCK_TRACKS)
    ]);
    
    setMoodAdvice(advice);
    setRecommendations(recs.recommendedIds);
    setRecReason(recs.reason);
    setIsAiLoading(false);
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const idx = MOCK_TRACKS.findIndex(t => t.id === currentTrack?.id);
    const nextIdx = (idx + 1) % MOCK_TRACKS.length;
    setCurrentTrack(MOCK_TRACKS[nextIdx]);
  };

  const handlePrev = () => {
    const idx = MOCK_TRACKS.findIndex(t => t.id === currentTrack?.id);
    const prevIdx = (idx - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length;
    setCurrentTrack(MOCK_TRACKS[prevIdx]);
  };

  return (
    <Router>
      <AppLayout 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onNext={handleNext}
        onPrev={handlePrev}
      >
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/recommend" element={
            <NeuralView 
              selectedMood={selectedMood} 
              onSelect={handleMoodSelect} 
              isAiLoading={isAiLoading} 
              moodAdvice={moodAdvice} 
              recommendations={recommendations}
              recReason={recReason}
              handleTrackSelect={handleTrackSelect}
              currentTrack={currentTrack}
            />
          } />
          <Route path="/music" element={
            <ArchiveView 
              tracks={MOCK_TRACKS.filter(t => t.type === 'music')}
              currentTrack={currentTrack}
              handleTrackSelect={handleTrackSelect}
              title="Thư viện nhạc"
              subtitle="Lọc âm thanh theo tâm trạng"
            />
          } />
          <Route path="/podcast" element={
            <ArchiveView 
              tracks={MOCK_TRACKS.filter(t => t.type === 'podcast')}
              currentTrack={currentTrack}
              handleTrackSelect={handleTrackSelect}
              title="Podcast chia sẻ"
              subtitle="Kết nối và chữa lành tâm hồn"
            />
          } />
          <Route path="/voices" element={
            <CommunityView 
              posts={posts} 
              setPosts={setPosts} 
              newNote={newNote} 
              setNewNote={setNewNote} 
              selectedMood={selectedMood} 
            />
          } />
          <Route path="/about" element={<AboutView />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

function AppLayout({ children, currentTrack, isPlaying, setIsPlaying, onNext, onPrev }: any) {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const navItems = [
    { path: '/', label: 'TỔNG QUAN', icon: HomeIcon },
    { path: '/music', label: 'THƯ VIỆN NHẠC', icon: Library },
    { path: '/podcast', label: 'PODCAST CHIA SẺ', icon: Mic2 },
    { path: '/recommend', label: 'GỢI Ý CẢM XÚC', icon: Sparkles },
    { path: '/voices', label: 'GÓC ẨN DANH', icon: MessageSquare },
    { path: '/about', label: 'GIỚI THIỆU', icon: Info },
  ];

  return (
    <div className="h-screen bg-artistic-bg flex flex-col font-sans text-artistic-fg selection:bg-artistic-accent selection:text-black overflow-hidden tracking-wide">
      {/* Container for Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Menu Toggle (Only visible on small screens) */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-6 right-6 z-[110] bg-artistic-surface p-3 border border-artistic-line text-artistic-fg shadow-xl"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Sidebar Navigation */}
        <aside className={cn(
          "fixed inset-y-0 left-0 w-72 bg-artistic-bg border-r border-artistic-line transition-all duration-500 z-[100] lg:relative lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-10 flex flex-col h-full bg-artistic-bg/50 backdrop-blur-xl">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-4 mb-16 group">
              <div className="w-10 h-10 bg-artistic-accent flex items-center justify-center text-black group-hover:rotate-12 transition-all duration-500 shadow-[0_0_20px_rgba(212,255,0,0.2)]">
                <Heart fill="black" size={20} />
              </div>
              <h1 className="text-xl font-serif italic font-black tracking-tight leading-none">Tần số<br/><span className="text-artistic-accent not-italic font-sans text-[10px] uppercase tracking-[4px]">vỗ về</span></h1>
            </Link>

            <nav className="flex-1 space-y-1">
              <p className="text-[9px] font-black text-artistic-muted/40 uppercase tracking-[4px] mb-4 pl-1">Điều hướng</p>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-4 py-3.5 px-4 group transition-all duration-300 text-[10px] font-black uppercase tracking-[3px] border-l-2",
                    pathname === item.path 
                      ? "text-artistic-accent border-artistic-accent bg-artistic-accent/5" 
                      : "text-artistic-muted border-transparent hover:text-artistic-fg hover:bg-artistic-surface/50"
                  )}
                >
                  <item.icon size={16} className={cn(
                    "transition-transform duration-500 group-hover:scale-110",
                    pathname === item.path ? "text-artistic-accent" : "opacity-50"
                  )} />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-10 border-t border-artistic-line space-y-6">
              <div className="p-6 bg-artistic-surface/30 border border-artistic-line relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-px bg-artistic-accent/20" />
                 <p className="text-[9px] font-black uppercase tracking-[2px] mb-2 text-artistic-accent">Hỗ trợ cộng đồng</p>
                 <p className="text-[10px] text-artistic-muted leading-relaxed uppercase tracking-widest font-bold">
                   Dành riêng cho sinh viên Việt Nam.
                 </p>
              </div>
              <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[2px] text-artistic-muted/30">
                 <span>Nhóm 72 • FLF1007</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[90] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main View Area */}
        <main className="flex-1 min-h-0 relative overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="p-4 sm:p-8 md:p-16 lg:p-24 max-w-7xl mx-auto">
            {children}
          </div>
          
          <footer className="px-8 md:px-16 py-20 border-t border-artistic-line flex flex-col md:flex-row justify-between items-center gap-10 bg-artistic-surface/10">
            <div className="flex items-center gap-4">
               <div className="w-5 h-5 bg-artistic-muted/20 flex items-center justify-center text-black">
                  <Heart fill="currentColor" size={10} className="text-artistic-muted" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[3px] text-artistic-muted">TẦN SỐ VỖ VỀ // KHÔNG GIAN CHỮA LÀNH</p>
            </div>
            <div className="flex gap-10 text-[9px] font-black uppercase tracking-[2px] text-artistic-muted/60">
              <span className="cursor-pointer hover:text-artistic-accent transition-colors underline-offset-4 hover:underline">Quyền riêng tư</span>
              <span className="cursor-pointer hover:text-artistic-accent transition-colors underline-offset-4 hover:underline">Điều khoản</span>
              <span className="cursor-pointer hover:text-artistic-accent transition-colors underline-offset-4 hover:underline">Liên hệ</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Player Overlay (Always fixed relative to the viewport height, but separated from main content) */}
      <AnimatePresence>
        {currentTrack && (
          <div className="z-[150] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <AudioPlayer 
              currentTrack={currentTrack} 
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onNext={onNext}
              onPrev={onPrev}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeView() {
  return (
    <div className="space-y-32">
      <header className="relative py-10 md:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-artistic-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl sm:text-7xl md:text-9xl font-sans font-black text-artistic-fg leading-[0.85] tracking-[-0.05em] uppercase"
        >
          TẦN SỐ<br/>
          <span className="italic font-serif font-normal lowercase tracking-wide text-artistic-accent block mt-4">vỗ về</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 md:mt-16 text-artistic-muted max-w-xl text-xs md:text-sm leading-relaxed uppercase tracking-[2px] md:tracking-[3px] font-medium"
        >
          Một không gian nghệ thuật kết hợp âm thanh đa dạng, giúp xoa dịu tâm hồn và tái tạo năng lượng cho sinh viên sau những giờ học căng thẳng.
        </motion.p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-artistic-line border border-artistic-line">
         <div className="bg-artistic-bg p-12 group hover:bg-artistic-surface transition-all">
            <div className="flex justify-between items-start mb-12">
               <Library className="text-artistic-accent" size={20} />
            </div>
            <h3 className="text-3xl font-serif italic mb-6">Thư viện nhạc</h3>
            <p className="text-artistic-muted text-[10px] uppercase tracking-[2px] leading-relaxed mb-10 font-bold max-w-xs">
               Âm thanh thiên nhiên và lo-fi được phân loại theo từng cung bậc cảm xúc của sinh viên.
            </p>
            <Link to="/music" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[3px] group-hover:text-artistic-accent transition-colors text-artistic-fg">
               Vào thư viện <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
         </div>

         <div className="bg-artistic-bg p-12 group hover:bg-artistic-surface transition-all">
            <div className="flex justify-between items-start mb-12">
               <Mic2 className="text-artistic-accent" size={20} />
            </div>
            <h3 className="text-3xl font-serif italic mb-6">Podcast chia sẻ</h3>
            <p className="text-artistic-muted text-[10px] uppercase tracking-[2px] leading-relaxed mb-10 font-bold max-w-xs">
               Những câu chuyện về đời sống sinh viên, tâm lý học và kỹ năng tự chăm sóc bản thân.
            </p>
            <Link to="/podcast" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[3px] group-hover:text-artistic-accent transition-colors text-artistic-fg">
               Nghe ngay <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
         </div>

         <div className="bg-artistic-bg p-12 group hover:bg-artistic-surface transition-all">
            <div className="flex justify-between items-start mb-12">
               <Sparkles className="text-artistic-accent" size={20} />
            </div>
            <h3 className="text-3xl font-serif italic mb-6">Gợi ý cảm xúc</h3>
            <p className="text-artistic-muted text-[10px] uppercase tracking-[2px] leading-relaxed mb-10 font-bold max-w-xs">
               Hệ thống thấu cảm đề xuất nội dung âm thanh dựa trên trạng thái tinh thần hiện tại của bạn.
            </p>
            <Link to="/recommend" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[3px] group-hover:text-artistic-accent transition-colors text-artistic-fg">
               Trải nghiệm AI <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
         </div>

         <div className="bg-artistic-bg p-12 group hover:bg-artistic-surface transition-all">
            <div className="flex justify-between items-start mb-12">
               <MessageSquare className="text-artistic-accent" size={20} />
            </div>
            <h3 className="text-3xl font-serif italic mb-6">Góc ẩn danh</h3>
            <p className="text-artistic-muted text-[10px] uppercase tracking-[2px] leading-relaxed mb-10 font-bold max-w-xs">
               Không gian an toàn để bạn trút bỏ gánh nặng tâm tư mà không lo sợ bị phán xét.
            </p>
            <Link to="/voices" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[3px] group-hover:text-artistic-accent transition-colors text-artistic-fg">
               Chia sẻ tâm tư <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
         </div>
      </section>

      <section className="space-y-12">
         <div className="flex items-end justify-between border-b border-artistic-line pb-6">
            <h3 className="text-4xl font-sans font-black uppercase tracking-tighter">Nội dung mới nhất</h3>
            <Link to="/music" className="text-[9px] font-black uppercase tracking-[3px] text-artistic-muted hover:text-artistic-accent">Xem tất cả</Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-artistic-line border border-artistic-line overflow-hidden">
            {MOCK_TRACKS.slice(0, 3).map(track => (
              <TrackCard key={track.id} track={track} onClick={() => {}} />
            ))}
         </div>
      </section>
    </div>
  );
}

function NeuralView({ selectedMood, onSelect, isAiLoading, moodAdvice, recommendations, recReason, handleTrackSelect, currentTrack }: any) {
  const recommendedTracks = useMemo(() => {
    return MOCK_TRACKS.filter(t => recommendations.includes(t.id));
  }, [recommendations]);

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-24">
          <h2 className="text-7xl font-sans font-black uppercase tracking-tighter mix-blend-difference mb-8">Gợi ý theo<br/>cảm xúc</h2>
          <p className="text-artistic-muted text-sm uppercase tracking-widest max-w-md leading-relaxed">
            Hệ thống sẽ dựa trên trạng thái của bạn để đưa ra những "Artifacts" âm thanh phù hợp nhất.
          </p>
        </header>

        <div className="bg-artistic-surface border border-artistic-line p-12 md:p-20 relative max-w-4xl mx-auto shadow-2xl">
          <div className="absolute -top-px -left-px w-12 h-12 border-t border-l border-artistic-accent" />
          <div className="text-[10px] font-black uppercase tracking-[3px] mb-8 text-artistic-muted">Hôm nay bạn thấy thế nào?</div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {(['stress', 'buồn', 'mất động lực', 'mệt mỏi', 'cô đơn', 'bình yên'] as Mood[]).map((m) => (
              <button
                key={m}
                onClick={() => onSelect(m)}
                className={cn(
                  "p-4 border text-[9px] font-black uppercase tracking-[2px] transition-all",
                  selectedMood === m ? "bg-artistic-accent border-artistic-accent text-black" : "border-artistic-line text-artistic-muted hover:text-white"
                )}
              >
                {m}
              </button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            {(isAiLoading || moodAdvice) && (
              <motion.div 
                key={isAiLoading ? 'loading' : 'advice'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-10 pt-10 border-t border-artistic-line"
              >
                <div className="flex items-center gap-3 mb-8 text-artistic-accent font-bold text-[10px] uppercase tracking-[4px]">
                  <Sparkles size={16} />
                  Phân tích tần số...
                </div>
                {isAiLoading ? (
                  <div className="flex gap-4 justify-center py-20">
                    <div className="w-2 h-2 bg-artistic-accent animate-ping" />
                    <div className="w-2 h-2 bg-artistic-accent animate-ping delay-150" />
                    <div className="w-2 h-2 bg-artistic-accent animate-ping delay-300" />
                  </div>
                ) : (
                  <div className="space-y-12">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-artistic-fg text-2xl font-serif italic leading-relaxed"
                    >
                      "{moodAdvice}"
                    </motion.p>

                    {recommendedTracks.length > 0 && (
                      <div className="space-y-8">
                        <p className="text-[10px] font-black uppercase tracking-[3px] text-artistic-muted">{recReason}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-artistic-line border border-artistic-line">
                           {recommendedTracks.map(track => (
                             <TrackCard 
                               key={track.id} 
                               track={track} 
                               isActive={currentTrack?.id === track.id}
                               onClick={() => handleTrackSelect(track)} 
                             />
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ArchiveView({ tracks, currentTrack, handleTrackSelect, title, subtitle }: any) {
  const [filterMood, setFilterMood] = useState<Mood | 'tất cả'>('tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const moods: (Mood | 'tất cả')[] = ['tất cả', 'stress', 'buồn', 'mất động lực', 'mệt mỏi', 'cô đơn', 'bình yên'];

  const filteredTracks = useMemo(() => {
    return tracks.filter((t: Track) => {
      const matchesMood = filterMood === 'tất cả' || t.mood.includes(filterMood as Mood);
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMood && matchesSearch;
    });
  }, [tracks, filterMood, searchQuery]);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 md:mb-24 border-b border-artistic-line pb-12 gap-10">
          <div className="flex-1 min-w-0">
            <h3 className="text-[10px] uppercase tracking-[4px] mb-6 text-artistic-muted font-black">{subtitle}</h3>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter break-words leading-[0.9]">{title}</h2>
          </div>
          <div className="relative group w-full lg:w-72 shrink-0">
            <Search size={14} className="absolute left-0 top-1/2 -translate-y-1/2 text-artistic-muted group-focus-within:text-artistic-accent transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="TÌM KIẾM..." 
              className="bg-transparent border-b border-artistic-line py-3 pl-8 outline-none w-full text-[10px] font-black tracking-[3px] uppercase placeholder:text-artistic-muted/20 focus:border-artistic-accent transition-all duration-500"
            />
          </div>
        </header>

        <div className="mb-12 flex flex-wrap gap-2 md:gap-3">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setFilterMood(m)}
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 text-[8px] md:text-[9px] font-black uppercase tracking-[1px] md:tracking-[2px] border transition-all",
                filterMood === m 
                  ? "bg-artistic-accent border-artistic-accent text-black" 
                  : "border-artistic-line text-artistic-muted hover:border-artistic-muted"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-artistic-line border border-artistic-line overflow-hidden">
            {filteredTracks.map((track: Track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                isActive={currentTrack?.id === track.id}
                onClick={() => handleTrackSelect(track)} 
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-artistic-line dashed">
             <p className="text-[10px] font-black uppercase tracking-[4px] text-artistic-muted/40">Không tìm thấy nội dung phù hợp</p>
          </div>
        )}
      </div>
    </section>
  );
}

function CommunityView({ posts, setPosts, newNote, setNewNote, selectedMood }: any) {
  return (
    <section className="py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24">
          <h2 className="text-7xl font-sans font-black uppercase tracking-tighter mb-8">Góc ẩn danh</h2>
          <p className="text-artistic-muted text-xs uppercase tracking-[3px] max-w-md font-medium">
            Nơi chia sẻ những tâm tư, câu chuyện chưa kể của cộng đồng sinh viên. Không phán xét, chỉ có sự thấu cảm.
          </p>
        </header>

        <div className="bg-artistic-surface border border-artistic-line p-12 mb-24 backdrop-blur-sm shadow-xl">
          <textarea 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="GỬI ĐI TẦN SỐ CỦA BẠN..."
            className="w-full h-48 bg-black border border-artistic-line p-8 outline-none resize-none text-xl font-serif italic text-artistic-fg focus:border-artistic-accent transition-all placeholder:text-artistic-muted/20"
          />
          <div className="flex justify-between items-center mt-10">
            <div className="flex items-center gap-6">
              <span className="w-12 h-[1px] bg-artistic-line" />
              <span className="text-[10px] text-artistic-muted uppercase tracking-[3px] font-black">Mã hóa ẩn danh</span>
            </div>
            <button 
              onClick={() => {
                if (!newNote.trim()) return;
                const newPost: Story = {
                  id: Date.now().toString(),
                  content: newNote,
                  timestamp: new Date().toISOString(),
                  mood: selectedMood || 'tâm sự'
                };
                setPosts([newPost, ...posts]);
                setNewNote('');
              }}
              className="bg-artistic-accent text-black px-12 py-5 text-[10px] font-black uppercase tracking-[4px] hover:bg-white transition-all shadow-lg"
            >
              Gửi chia sẻ
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-artistic-line border border-artistic-line shadow-2xl overflow-hidden rounded-sm">
          {posts.map((post: Story) => (
            <div key={post.id} className="bg-artistic-bg hover:bg-artistic-surface/50 transition-colors">
              <AnonymousPost story={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutView() {
  return (
    <section className="py-10 max-w-4xl space-y-20">
      <header>
        <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter mb-8 leading-none">Về dự án<br/><span className="italic font-serif font-normal lowercase tracking-normal text-artistic-accent">tần số vỗ về</span></h2>
        <p className="text-artistic-muted text-sm uppercase tracking-widest leading-relaxed max-w-2xl font-medium px-1">
          Một không gian âm thanh vỗ về tâm hồn dành cho sinh viên Việt Nam, nơi công nghệ và sự thấu cảm gặp nhau để cùng xoa dịu những áp lực thường nhật.
        </p>
      </header>

      <div className="bg-artistic-surface p-10 md:p-16 border border-artistic-line relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-artistic-accent/5 rounded-full blur-[80px]" />
         <h4 className="text-2xl md:text-4xl font-serif italic mb-8 leading-tight max-w-3xl">"Công nghệ không làm chúng ta xa cách, nó là cầu nối để những trái tim mệt mỏi tìm thấy nhau."</h4>
         <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-[9px] font-black uppercase tracking-[3px] text-artistic-accent">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[1px] bg-artistic-accent" />
              Nhóm 72 // Tần số vỗ về
            </div>
            <div className="text-artistic-muted/60 md:border-l md:border-artistic-line md:pl-8">
              Mã học phần: FLF1007
            </div>
         </div>
      </div>
    </section>
  );
}
