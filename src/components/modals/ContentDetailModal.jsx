import React, { useEffect, useState } from 'react';
import { Toast } from '../../utils/toast.js';

const ContentDetailModal = ({ isOpen, onClose, content, onPlay, onToggleList, isAdded }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'auto';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen && !isVisible) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-500 ${
                isOpen ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                className={`relative w-full max-w-5xl bg-[#181818] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-500 transform ${
                    isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
                }`}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Hero Section */}
                <div className="relative aspect-video md:aspect-[21/9] w-full">
                    <img 
                        src={content?.backdrop || content?.image} 
                        alt={content?.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">
                            {content?.title}
                        </h2>
                        
                        <div className="flex flex-wrap items-center gap-4">
                            <button 
                                onClick={() => onPlay(content)}
                                className="px-8 py-3 bg-white text-black font-bold rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all transform active:scale-95"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                Assistir Agora
                            </button>
                            
                            <button 
                                onClick={() => onToggleList(content)}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-md transition-all ${
                                    isAdded 
                                    ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                                    : 'bg-black/40 border-white/30 text-white hover:border-white hover:bg-black/60'
                                }`}
                            >
                                {isAdded ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
                            <span className="text-green-500 uppercase tracking-wider">98% Relevante</span>
                            <span className="text-zinc-400">{content?.year || '2024'}</span>
                            <span className="px-2 py-0.5 border border-zinc-600 text-zinc-300 rounded text-xs">
                                {content?.rating || '16+'}
                            </span>
                            <span className="text-zinc-400">{content?.duration || '1h 45min'}</span>
                            <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] border border-zinc-700">
                                4K
                            </span>
                        </div>

                        <p className="text-zinc-300 text-lg leading-relaxed font-medium">
                            {content?.description || content?.synopsis || 'Nenhuma sinopse disponível para este conteúdo.'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block">Elenco</span>
                            <p className="text-zinc-300 text-sm leading-snug">
                                {content?.cast || 'Informação não disponível'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block">Direção</span>
                            <p className="text-zinc-300 text-sm leading-snug">
                                {content?.director || 'Informação não disponível'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <span className="text-zinc-500 text-xs font-black uppercase tracking-widest block">Gêneros</span>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-xs border border-white/5 capitalize">
                                    {content?.genre || 'Geral'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Spacer */}
                <div className="h-12 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
        </div>
    );
};

export default ContentDetailModal;
