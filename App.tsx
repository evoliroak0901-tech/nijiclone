import React, { useState } from 'react';
import { Menu, Home, Sparkles, User, Pause } from 'lucide-react';
import { AppTab, GeneratedImage } from './types';
import { FeedView } from './components/FeedView';
import { ImagineView } from './components/ImagineView';
import { ProfileView } from './components/ProfileView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Imagine);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [remixPrompt, setRemixPrompt] = useState<string | undefined>(undefined);

  const handleImageGenerated = (image: GeneratedImage) => {
    setGeneratedImages(prev => [image, ...prev]);
    // Switch to feed to show the result immediately
    setActiveTab(AppTab.Feed);
    // Clear remix prompt after successful generation
    setRemixPrompt(undefined);
  };

  const handleRemix = (prompt: string) => {
    setRemixPrompt(prompt);
    setActiveTab(AppTab.Imagine);
  };

  return (
    <div className="relative h-screen w-full bg-[#1a1b23] flex flex-col font-sans">

      {/* Header */}
      <header className="flex items-center justify-between p-4 z-10 bg-[#1a1b23] text-gray-200">
        <button className="p-2 -ml-2">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-sm font-medium tracking-wide">あなたの最近のジョブ</h1>
        <div className="w-6" /> {/* Spacer for centering */}
      </header>

      {/* Main Content Area - Shows Feed by default as the background layer */}
      <main className="flex-1 relative overflow-hidden">
        {/* The "Feed" is always rendered as the base layer in this design interpretation */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === AppTab.Imagine ? 'opacity-40' : 'opacity-100'}`}>
          <FeedView images={generatedImages} onRemix={handleRemix} />
        </div>

        {/* Floating Actions above feed (Pause, Community, Live) - Decorative from screenshot */}
        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-center text-xs font-bold text-[#b8c992] z-0 pointer-events-none opacity-50">
          {/* These are mostly decorative to match screenshot */}
          <div className="flex gap-2">
            <div className="bg-[#2a2a35] px-3 py-1 rounded-full border border-[#4a4a55] flex items-center gap-1">
              <Pause size={10} fill="currentColor" /> 一時停止
            </div>
            <div className="bg-[#2a2a35] px-3 py-1 rounded-full border border-[#4a4a55] text-gray-300">
              コミュニティ
            </div>
          </div>
          <div className="bg-[#2a2a35] px-3 py-1 rounded-full border border-[#4a4a55] text-[#b8c992] flex items-center gap-1">
            ライブ <div className="w-1.5 h-1.5 rounded-full bg-[#b8c992]"></div>
          </div>
        </div>
      </main>

      {/* Imagine Drawer / Bottom Sheet */}
      {/* If Imagine tab is active, this panel slides up or is visible. 
          If Feed is active, this panel might slide down or hide. 
          The screenshot shows the Imagine panel dominating the bottom half. 
      */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-out transform ${activeTab === AppTab.Imagine ? 'translate-y-0' : 'translate-y-[90%]'
          }`}
        style={{ height: '85%' }} // Occupies mostly bottom area
      >
        <ImagineView
          onImageGenerated={handleImageGenerated}
          initialPrompt={remixPrompt}
        />
      </div>

      {/* Profile View Layer */}
      {activeTab === AppTab.Profile && (
        <div className="absolute inset-0 z-30 bg-[#1a1b23] animate-in slide-in-from-right duration-300">
          <ProfileView />
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50 text-[10px] font-medium text-gray-400">
        <button
          onClick={() => setActiveTab(AppTab.Feed)}
          className={`flex flex-col items-center gap-1 ${activeTab === AppTab.Feed ? 'text-gray-900' : ''}`}
        >
          <Home size={24} strokeWidth={activeTab === AppTab.Feed ? 2.5 : 2} />
          <span>フィード</span>
        </button>

        <button
          onClick={() => setActiveTab(AppTab.Imagine)}
          className={`flex flex-col items-center gap-1 ${activeTab === AppTab.Imagine ? 'text-gray-900' : ''}`}
        >
          <Sparkles size={24} fill={activeTab === AppTab.Imagine ? "currentColor" : "none"} strokeWidth={activeTab === AppTab.Imagine ? 0 : 2} />
          <span>イマジン</span>
        </button>

        <button
          onClick={() => setActiveTab(AppTab.Profile)}
          className={`flex flex-col items-center gap-1 ${activeTab === AppTab.Profile ? 'text-gray-900' : ''}`}
        >
          <User size={24} strokeWidth={activeTab === AppTab.Profile ? 2.5 : 2} />
          <span>あなた</span>
        </button>
      </nav>

    </div>
  );
};

export default App;
