'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, ZoomIn, ImageIcon } from 'lucide-react';
import { defaultProofItems } from '@/lib/default-content';
import type { ProofItem } from '@/lib/types';

interface ProofSectionProps {
  items?: ProofItem[];
}

export default function ProofSection({ items }: ProofSectionProps) {
  const proofItems = items ?? [];
  const [selectedItem, setSelectedItem] = useState<ProofItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const getItemImages = (item: ProofItem): string[] => {
    const imgs: string[] = [];
    if (item.images && item.images.length > 0) {
      imgs.push(...item.images);
    } else if (item.image_url) {
      imgs.push(item.image_url);
    }
    return imgs;
  };

  const openItem = (item: ProofItem) => {
    setSelectedItem(item);
    setActiveImageIndex(0);
  };

  const closeItem = () => {
    setSelectedItem(null);
    setActiveImageIndex(0);
  };

  const selectedImages = selectedItem ? getItemImages(selectedItem) : [];

  const goNext = () => {
    if (selectedImages.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % selectedImages.length);
    }
  };

  const goPrev = () => {
    if (selectedImages.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900/50 relative">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          Results That Speak
        </h2>
        <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
          Real climbs. Real gameplay. Every game played solo.
        </p>

        {proofItems.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-800/30 border border-slate-700/30">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-medium text-lg mb-2">Chưa có kết quả nào được đăng tải</h3>
            <p className="text-slate-400">Booster chưa cập nhật lịch sử đấu hoặc bằng chứng cày rank.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            {proofItems.map((item) => {
              const itemImages = getItemImages(item);
              const thumbnail = itemImages[0];

              return (
                <div
                  key={item.id}
                  onClick={() => openItem(item)}
                  className={`
                    cursor-pointer group relative rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                    border border-slate-700/50 hover:border-purple-500/50 overflow-hidden
                    transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/10
                    ${item.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                    ${item.size === 'medium' ? 'md:row-span-2' : ''}
                  `}
                >
                  {/* Thumbnail */}
                  {thumbnail ? (
                    <div className="relative w-full h-48 md:h-56 overflow-hidden">
                      <img 
                        src={thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      {/* Image count badge */}
                      {itemImages.length > 1 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs">
                          <ImageIcon className="w-3 h-3" />
                          {itemImages.length}
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 md:p-6 relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 mb-3 text-sm md:text-base line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 relative z-20">
                      {(item.tags || []).map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/0 via-transparent to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeItem}
        >
          {/* Close */}
          <button
            onClick={closeItem}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image area */}
          {selectedImages.length > 0 ? (
            <>
              {/* Nav arrows */}
              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-50"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {/* Image */}
              <div
                className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImages[activeImageIndex]}
                  alt={selectedItem.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              </div>

              {/* Dots */}
              {selectedImages.length > 1 && (
                <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  {selectedImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeImageIndex
                          ? 'w-8 bg-purple-500'
                          : 'w-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : null}

          {/* Info below image */}
          <div className="mt-4 text-center max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-bold text-xl mb-2">{selectedItem.title}</h3>
            <p className="text-slate-300 text-sm mb-3">{selectedItem.description}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {selectedItem.tags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-purple-600/30 text-purple-200 border border-purple-500/50"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            {selectedImages.length > 1 && (
              <p className="text-slate-500 text-xs">{activeImageIndex + 1} / {selectedImages.length}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
