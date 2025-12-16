
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Download, Maximize2, X, Share, Copy, RefreshCw } from 'lucide-react';

interface FeedViewProps {
  images: GeneratedImage[];
  onRemix?: (prompt: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({ images, onRemix }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Helper to convert base64/url to File and share
  const handleShare = async (e: React.MouseEvent | React.TouchEvent, img: GeneratedImage) => {
    e.stopPropagation();
    
    // Fallback for non-supported browsers or desktop
    if (!navigator.share) {
      handleDownload(e, img);
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch(img.url);
      const blob = await response.blob();
      const file = new File([blob], `niji-gen-${img.id}.png`, { type: blob.type });
      
      await navigator.share({
        files: [file],
        title: 'Niji Gen Image',
        text: img.prompt
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback if sharing fails (e.g. user cancelled)
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = (e: React.MouseEvent | React.TouchEvent, img: GeneratedImage) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `niji-gen-${img.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemix = (img: GeneratedImage) => {
    if (onRemix) {
        onRemix(img.prompt);
        setSelectedImage(null);
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <Maximize2 className="w-8 h-8 opacity-50" />
        </div>
        <p>No recent jobs found.</p>
        <p className="text-sm mt-2">Start imagining to see your gallery here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 p-2 pb-24 overflow-y-auto h-full">
        {images.map((img) => (
          <div 
            key={img.id} 
            onClick={() => setSelectedImage(img)}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800 cursor-pointer"
          >
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {/* Overlay with pointer-events-none to prevent blocking long-press on mobile in feed, 
                though in feed simple tap opens lightbox anyway */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 pointer-events-none">
              <p className="text-xs text-white line-clamp-2 mb-2">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-200">
           {/* Close button */}
           <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-white/20 backdrop-blur-md border border-white/10"
              >
                <X size={24} />
              </button>
           </div>

           {/* Image Container - Designed for Native Long Press 
               We ensure no overlay covers the image directly.
           */}
           <div className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.prompt} 
                className="max-w-full max-h-full object-contain pointer-events-auto select-none"
                style={{ 
                   WebkitTouchCallout: 'default', // Enable iOS native menu
                   userSelect: 'none' 
                }}
              />
           </div>

           {/* Actions Panel - Placed below/over but ensuring image center is clear if possible, 
               or just standard sheet at bottom */}
           <div className="bg-gray-900/90 backdrop-blur-xl border-t border-white/10 pb-10 pt-4 px-6 rounded-t-3xl z-10">
              {/* Prompt Display */}
              <div className="mb-6">
                <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">Prompt</p>
                <p className="text-sm text-gray-200 leading-relaxed max-h-24 overflow-y-auto select-text">{selectedImage.prompt}</p>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleRemix(selectedImage)}
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                  >
                    <RefreshCw size={20} className="text-indigo-400" />
                    <span className="text-xs font-medium text-gray-300">リミックス</span>
                  </button>

                  <button 
                    onClick={(e) => handleShare(e, selectedImage)}
                    disabled={isSharing}
                    className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                  >
                    {isSharing ? (
                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Share size={20} className="text-green-400" />
                    )}
                    <span className="text-xs font-medium text-gray-300">保存・共有</span>
                  </button>
              </div>
              <p className="text-[10px] text-gray-500 text-center mt-4">
                 画像を長押しすると直接保存できます
              </p>
           </div>
        </div>
      )}
    </>
  );
};
