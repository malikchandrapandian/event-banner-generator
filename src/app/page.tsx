// app/page.tsx
'use client'

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { toPng } from 'html-to-image';

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState({
    title: 'Tech Innovation Meetup 2025',
    date: 'January 15, 2025',
    venue: 'Silicon Valley Tech Hub',
    time: '6:00 PM - 9:00 PM'
  });
  const [selectedTheme, setSelectedTheme] = useState<'cyber' | 'gradient' | 'minimal'>('cyber');
  const bannerRef = useRef<HTMLDivElement>(null);

  const themeStyles = {
    cyber: {
      background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
      overlay: 'bg-black bg-opacity-40',
      accent: 'from-cyan-400 to-blue-500',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_30px_rgba(34,211,238,0.5)]'
    },
    gradient: {
      background: 'bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600',
      overlay: 'bg-gradient-to-t from-black via-transparent to-transparent',
      accent: 'from-yellow-300 to-orange-400',
      border: 'border-yellow-300',
      glow: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]'
    },
    minimal: {
      background: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
      overlay: 'bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/80',
      accent: 'from-emerald-400 to-teal-500',
      border: 'border-emerald-400',
      glow: 'shadow-[0_0_25px_rgba(52,211,153,0.4)]'
    }
  };

  const currentTheme = themeStyles[selectedTheme];

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1
  });

  const handleDownload = async () => {
    if (!bannerRef.current) return;
    
    try {
      const dataUrl = await toPng(bannerRef.current);
      const link = document.createElement('a');
      link.download = 'tech-meetup-banner.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleShare = async () => {
    if (!bannerRef.current) return;
    
    try {
      const dataUrl = await toPng(bannerRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'tech-meetup-banner.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Tech Meetup Banner',
          text: 'Check out my tech meetup banner!',
        });
      } else {
        handleDownload();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2 sm:mb-3">
            Tech Meetup Banner Generator
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">Create stunning event banners for your tech community</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Input Form */}
          <div className="bg-slate-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700 overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Event Details</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Choose Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['cyber', 'gradient', 'minimal'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedTheme === theme
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      <div className={`h-12 rounded ${
                        theme === 'cyber' ? 'bg-gradient-to-br from-indigo-900 to-pink-900' :
                        theme === 'gradient' ? 'bg-gradient-to-br from-orange-500 to-purple-600' :
                        'bg-gradient-to-br from-slate-900 to-slate-800'
                      }`}></div>
                      <p className="text-xs text-gray-300 mt-2 capitalize">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Event Title</label>
                <input
                  type="text"
                  value={eventDetails.title}
                  onChange={(e) => setEventDetails({...eventDetails, title: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                  <input
                    type="text"
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
                  <input
                    type="text"
                    value={eventDetails.time}
                    onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})}
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Venue</label>
                <input
                  type="text"
                  value={eventDetails.venue}
                  onChange={(e) => setEventDetails({...eventDetails, venue: e.target.value})}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Upload Your Photo</label>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/30 transition-all"
                >
                  <input {...getInputProps()} />
                  {photo ? (
                    <div className="relative">
                      <img 
                        src={photo} 
                        alt="Preview" 
                        className="max-h-48 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="mt-3 text-sm text-gray-400">Click to change photo</p>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-gray-300 font-medium">Drag & drop your photo here</p>
                      <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                      <p className="text-xs text-gray-600 mt-1">(JPG, PNG, WebP)</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={!photo}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    photo 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/50' 
                      : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </span>
                </button>
                
                <button
                  onClick={handleShare}
                  disabled={!photo}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                    photo 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50' 
                      : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Banner Preview */}
          <div className="flex flex-col h-full">
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-700 h-full flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Banner Preview
              </h2>
              <div className="flex-1 min-h-0 flex flex-col">
                <div 
                  ref={bannerRef}
                  className="flex-1 min-h-0 max-w-full mx-auto w-full aspect-[16/9] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl overflow-hidden shadow-2xl relative"
                >
                {/* Background Image with Overlay */}
                {photo && (
                  <div className="absolute inset-0">
                    <img 
                      src={photo} 
                      alt="Background" 
                      className="w-full h-full object-cover opacity-15 blur-sm"
                    />
                    <div className={`absolute inset-0 ${currentTheme.overlay}`}></div>
                  </div>
                )}
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }}></div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${currentTheme.accent} text-black font-bold text-sm mb-3 ${currentTheme.glow}`}>
                        TECH MEETUP
                      </div>
                      <h3 className="text-4xl font-black leading-tight mb-2" style={{
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                      }}>
                        {eventDetails.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Center - Photo */}
                  <div className="flex justify-center items-center">
                    <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${currentTheme.border} ${currentTheme.glow} bg-slate-900`}>
                      {photo ? (
                        <img 
                          src={photo} 
                          alt="Attendee" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Footer - Event Details */}
                  <div>
                    <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 border border-white/10">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-gray-400 font-medium">DATE</span>
                          </div>
                          <p className="text-sm font-bold">{eventDetails.date}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-gray-400 font-medium">TIME</span>
                          </div>
                          <p className="text-sm font-bold">{eventDetails.time}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs text-gray-400 font-medium">VENUE</span>
                        </div>
                        <p className="text-sm font-bold">{eventDetails.venue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-6 sm:mt-8 text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Tech Meetup Banner Generator</p>
        <p className="text-gray-600 text-xs mt-1">Made with ❤️ for the tech community</p>
      </footer>
      </div>
    </main>
  );
}