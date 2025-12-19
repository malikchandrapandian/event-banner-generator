// app/page.tsx
'use client'

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';

type Platform = 'linkedin' | 'instagram' | 'twitter';
type Theme = 'dark' | 'light';

interface LinkedInProfile {
  name: string;
  photo: string;
  headline?: string;
}

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [eventDetails, setEventDetails] = useState({
    eventType: 'Tech Meetup',
    title: 'Tech Innovation Meetup 2025',
    date: 'January 15, 2025',
    venue: 'Silicon Valley Tech Hub',
    time: '6:00 PM - 9:00 PM'
  });
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('linkedin');
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dark');
  
  const bannerRef = useRef<HTMLDivElement>(null);

  const platformDimensions = {
    linkedin: { width: 1200, height: 627, label: 'LinkedIn (1200×627)' },
    instagram: { width: 1080, height: 1080, label: 'Instagram (1080×1080)' },
    twitter: { width: 1200, height: 675, label: 'Twitter (1200×675)' }
  };

  const themeStyles = {
    dark: {
      background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
      overlay: 'bg-black bg-opacity-40',
      card: 'bg-black/40',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      badge: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_30px_rgba(34,211,238,0.5)]'
    },
    light: {
      background: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      overlay: 'bg-white bg-opacity-60',
      card: 'bg-white/80',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      badge: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
      border: 'border-purple-600',
      glow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]'
    }
  };

  const currentTheme = themeStyles[selectedTheme];

  const onDropPhoto = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDropLogo = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps } = useDropzone({
    onDrop: onDropPhoto,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1
  });

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } = useDropzone({
    onDrop: onDropLogo,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.svg'] },
    maxFiles: 1
  });


  const handleShare = async (platform: 'twitter' | 'linkedin' | 'facebook' | 'download') => {
    if (!bannerRef.current) return;
    
    try {
      const dataUrl = await toPng(bannerRef.current, {
        pixelRatio: 2,
        width: platformDimensions[selectedPlatform].width,
        height: platformDimensions[selectedPlatform].height
      });
      
      if (platform === 'download') {
        const link = document.createElement('a');
        link.download = `${selectedPlatform}-banner-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        return;
      }

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'event-banner.png', { type: 'image/png' });
      
      const shareData = {
        title: `I'm attending ${eventDetails.title}`,
        text: `Join me at ${eventDetails.title} on ${eventDetails.date} at ${eventDetails.venue}. ${eventDetails.eventType}`,
        url: window.location.href,
        files: [file]
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support sharing files
        switch (platform) {
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm attending ${eventDetails.title}! ${window.location.href}`)}`, '_blank');
            break;
          case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
            break;
          case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`I'm attending ${eventDetails.title}!`)}`, '_blank');
            break;
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share. Please try again.');
    }
  };

  const displayPhoto = photo;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-3">
            Multi-Platform Banner Generator
          </h1>
          <p className="text-gray-400 text-lg">Create stunning banners for LinkedIn, Instagram & Twitter</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Platform Selection */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Platform</h2>
              <div className="grid grid-cols-3 gap-2">
                {(['linkedin', 'instagram', 'twitter'] as Platform[]).map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-xs text-gray-300 capitalize font-medium">{platform}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{platformDimensions[platform].width}×{platformDimensions[platform].height}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Theme</h2>
              <div className="grid grid-cols-2 gap-3">
                {(['dark', 'light'] as Theme[]).map((theme) => (
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
                      theme === 'dark' ? 'bg-gradient-to-br from-indigo-900 to-pink-900' :
                      'bg-gradient-to-br from-blue-50 to-pink-50 border border-gray-300'
                    }`}></div>
                    <p className="text-xs text-gray-300 mt-2 capitalize">{theme}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Your Name</h2>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Event Details */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Event Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Event Type</label>
                  <input
                    type="text"
                    value={eventDetails.eventType}
                    onChange={(e) => setEventDetails({...eventDetails, eventType: e.target.value})}
                    placeholder="Tech Meetup"
                    className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
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
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                    
                    <input
                      type="text"
                      value={eventDetails.date}
                      onChange={(e) => setEventDetails({...eventDetails, date: e.target.value})}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                    />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Time</label>
                    <input
                      type="text"
                      value={eventDetails.time}
                      onChange={(e) => setEventDetails({...eventDetails, time: e.target.value})}
                      className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
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
              </div>
            </div>

            {/* Profile Photo */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Profile Photo</h2>
              <p className="text-sm text-gray-400 mb-4">Upload your profile photo to use in the banner.</p>

            {/* Photo Upload */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Your Photo</h2>
              
              <div
                {...getPhotoRootProps()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/30 transition-all"
              >
                <input {...getPhotoInputProps()} />
                {displayPhoto ? (
                  <div className="relative">
                    <img 
                      src={displayPhoto} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded-lg shadow-lg"
                    />
                    <p className="mt-2 text-xs text-gray-400">Click to change</p>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-sm font-medium">Upload Photo</p>
                    <p className="text-xs text-gray-500 mt-1">(JPG, PNG, WebP)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Community Logo</h2>
              
              <div
                {...getLogoRootProps()}
                className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/30 transition-all"
              >
                <input {...getLogoInputProps()} />
                {logo ? (
                  <div className="relative">
                    <img 
                      src={logo} 
                      alt="Logo Preview" 
                      className="max-h-24 mx-auto"
                    />
                    <p className="mt-2 text-xs text-gray-400">Click to change</p>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-300 text-sm font-medium">Upload Logo</p>
                    <p className="text-xs text-gray-500 mt-1">(PNG, SVG preferred)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShare('twitter')}
                className="py-2 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span>Tweet</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>Share</span>
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="py-2 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.797v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Share</span>
              </button>
              <button
                onClick={() => handleShare('download')}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
          
          {/* Banner Preview */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Preview - {platformDimensions[selectedPlatform].label}
            </h2>
            <div className="flex justify-center items-center min-h-[500px]">
              <div 
                ref={bannerRef}
                className={`${currentTheme.background} rounded-2xl overflow-hidden shadow-2xl relative`}
                style={{
                  width: selectedPlatform === 'instagram' ? '500px' : '100%',
                  maxWidth: selectedPlatform === 'instagram' ? '500px' : '800px',
                  aspectRatio: selectedPlatform === 'instagram' ? '1/1' : selectedPlatform === 'twitter' ? '16/9' : '1200/627'
                }}
              >
                {/* Background Image with Overlay */}
                {displayPhoto && (
                  <div className="absolute inset-0">
                    <img 
                      src={displayPhoto} 
                      alt="Background" 
                      className="w-full h-full object-cover opacity-15 blur-sm"
                    />
                    <div className={`absolute inset-0 ${currentTheme.overlay}`}></div>
                  </div>
                )}
                
                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `linear-gradient(${selectedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), linear-gradient(90deg, ${selectedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}></div>
                
                {/* Content - Adapts to platform */}
                {selectedPlatform === 'instagram' ? (
                  // Instagram Square Layout
                  <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    <div className="text-center">
                      {logo && (
                        <div className="mb-4">
                          <img src={logo} alt="Logo" className="h-12 mx-auto" />
                        </div>
                      )}
                      <div className={`inline-block px-4 py-1.5 rounded-full ${currentTheme.badge} font-bold text-sm mb-3 ${currentTheme.glow}`}>
                        {eventDetails.eventType.toUpperCase()}
                      </div>
                      <h3 className={`text-3xl font-black leading-tight mb-4 ${currentTheme.text}`} style={{
                        textShadow: selectedTheme === 'dark' ? '0 0 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)'
                      }}>
                        {eventDetails.title}
                      </h3>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className={`w-40 h-40 rounded-full overflow-hidden border-4 ${currentTheme.border} ${currentTheme.glow} ${selectedTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
                        {displayPhoto ? (
                          <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${selectedTheme === 'dark' ? 'from-slate-700 to-slate-800' : 'from-gray-200 to-gray-300'} flex items-center justify-center`}>
                            <svg className={`w-20 h-20 ${selectedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {displayName && (
                      <p className={`text-center text-xl font-bold ${currentTheme.text} mb-4`}>{displayName}</p>
                    )}
                    
                    <div className={`${currentTheme.card} backdrop-blur-md rounded-xl p-5 border ${selectedTheme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <svg className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.venue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // LinkedIn & Twitter Horizontal Layout
                  <div className="relative z-10 h-full flex items-center p-8 md:p-12">
                    <div className="w-full grid grid-cols-3 gap-8 items-center">
                      {/* Left - Profile */}
                      <div className="flex flex-col items-center">
                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 ${currentTheme.border} ${currentTheme.glow} mb-4 ${selectedTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
                          {displayPhoto ? (
                            <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${selectedTheme === 'dark' ? 'from-slate-700 to-slate-800' : 'from-gray-200 to-gray-300'} flex items-center justify-center`}>
                              <svg className={`w-16 h-16 ${selectedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        {displayName && (
                          <p className={`text-center text-lg font-bold ${currentTheme.text}`}>{displayName}</p>
                        )}
                      </div>
                      
                      {/* Center - Event Info */}
                      <div className="text-center">
                        {logo && (
                          <div className="mb-4">
                            <img src={logo} alt="Logo" className="h-16 mx-auto" />
                          </div>
                        )}
                        <div className={`inline-block px-4 py-1.5 rounded-full ${currentTheme.badge} font-bold text-sm mb-3 ${currentTheme.glow}`}>
                          {eventDetails.eventType.toUpperCase()}
                        </div>
                        <h3 className={`text-3xl md:text-4xl font-black leading-tight ${currentTheme.text}`} style={{
                          textShadow: selectedTheme === 'dark' ? '0 0 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                          {eventDetails.title}
                        </h3>
                      </div>
                      
                      {/* Right - Details */}
                      <div className={`${currentTheme.card} backdrop-blur-md rounded-xl p-5 border ${selectedTheme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <svg className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className={`text-xs ${currentTheme.textSecondary} font-medium`}>DATE</span>
                            </div>
                            <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.date}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <svg className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className={`text-xs ${currentTheme.textSecondary} font-medium`}>TIME</span>
                            </div>
                            <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.time}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <svg className={`w-4 h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className={`text-xs ${currentTheme.textSecondary} font-medium`}>VENUE</span>
                            </div>
                            <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.venue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-12 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Multi-Platform Banner Generator</p>
          <p className="text-gray-600 text-xs mt-1">Made with ❤️ for the tech community</p>
        </footer>
      </div>
    </main>
  );
}