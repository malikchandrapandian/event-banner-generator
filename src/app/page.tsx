// app/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import { FiChevronLeft, FiChevronRight, FiDownload, FiShare2 } from 'react-icons/fi';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

type Platform = 'linkedin' | 'instagram' | 'twitter';
type Theme = 'dark' | 'light';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const bannerRefs = {
    linkedin: useRef<HTMLDivElement>(null),
    instagram: useRef<HTMLDivElement>(null),
    twitter: useRef<HTMLDivElement>(null)
  };
  
  useEffect(() => {
    setSelectedPlatform(['linkedin', 'instagram', 'twitter'][currentSlide] as Platform);
  }, [currentSlide]);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const platformDimensions = {
    linkedin: { width: 1200, height: 627, label: 'LinkedIn (1200×627)' },
    instagram: { width: 1080, height: 1080, label: 'Instagram (1080×1080)' },
    twitter: { width: 1200, height: 675, label: 'Twitter (1200×675)' }
  };

  const previewSize = {
    linkedin: { width: 800, height: Math.round(800 * 627 / 1200) },
    instagram: { width: 500, height: 500 },
    twitter: { width: 800, height: Math.round(800 * 675 / 1200) }
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


  const handleShare = async (platform: 'twitter' | 'linkedin' | 'facebook' | 'download', targetPlatform: Platform) => {
    const bannerRef = bannerRefs[targetPlatform];
    if (!bannerRef.current) return;
    
    try {
      const dataUrl = await toPng(bannerRef.current, {
        pixelRatio: 2,
        width: platformDimensions[targetPlatform].width,
        height: platformDimensions[targetPlatform].height
      });
      
      if (platform === 'download') {
        const link = document.createElement('a');
        link.download = `${targetPlatform}-banner-${Date.now()}.png`;
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
  
  const platforms: Platform[] = ['linkedin', 'instagram', 'twitter'];
  const platformIcons = {
    linkedin: <FaLinkedin className="text-blue-500" />,
    instagram: <FaInstagram className="text-pink-500" />,
    twitter: <FaTwitter className="text-blue-400" />
  };

  const bannerRef = bannerRefs[selectedPlatform];

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
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => goToSlide(platforms.indexOf(platform))}
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

            {/* Photo Upload */}
            <div className="bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700">
              <h2 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Profile Photo</h2>
              <p className="text-sm text-gray-400 mb-4">Upload your profile photo to use in the banner.</p>
              
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
                onClick={() => handleShare('twitter', selectedPlatform)}
                className="py-2 px-4 bg-blue-400 hover:bg-blue-500 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span>Tweet</span>
              </button>
              <button
                onClick={() => handleShare('linkedin', selectedPlatform)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>Share</span>
              </button>
              <button
                onClick={() => handleShare('facebook', selectedPlatform)}
                className="py-2 px-4 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.797v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Share</span>
              </button>
              <button
                onClick={() => handleShare('download', selectedPlatform)}
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
            <div className="relative flex justify-center items-center min-h-[500px]">
              <div 
                ref={bannerRef}
                className={`${currentTheme.background} rounded-2xl overflow-hidden shadow-2xl relative`}
                style={{
                  width: previewSize[selectedPlatform].width,
                  height: previewSize[selectedPlatform].height
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
                  <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                    <div className="w-full h-1/4 flex flex-col justify-center items-center">
                      {logo && (
                        <div className="mb-2 w-12 h-12 flex-shrink-0">
                          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div className={`inline-block px-3 py-1 rounded-full ${currentTheme.badge} font-bold text-xs md:text-sm ${currentTheme.glow}`}>
                        {eventDetails.eventType.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="w-full h-1/3 flex justify-center items-center">
                      <h3 className={`text-2xl md:text-3xl font-black leading-tight ${currentTheme.text} w-full px-4 text-center`} style={{
                        textShadow: selectedTheme === 'dark' ? '0 0 20px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)'
                      }}>
                        {eventDetails.title}
                      </h3>
                    </div>
                    
                    <div className="w-full h-1/4 flex flex-col justify-center items-center">
                      <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 ${currentTheme.border} ${currentTheme.glow} flex-shrink-0 ${selectedTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
                        {displayPhoto ? (
                          <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${selectedTheme === 'dark' ? 'from-slate-700 to-slate-800' : 'from-gray-200 to-gray-300'} flex items-center justify-center`}>
                            <svg className={`w-16 h-16 md:w-20 md:h-20 ${selectedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {displayName && (
                        <p className={`text-center text-lg md:text-xl font-bold ${currentTheme.text} mt-2 w-full px-4`}>{displayName}</p>
                      )}
                    </div>
                    
                    <div className="w-full h-1/4">
                      <div className={`${currentTheme.card} backdrop-blur-md rounded-xl p-4 md:p-5 border w-full h-full ${selectedTheme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                        <div className="space-y-2 h-full flex flex-col justify-center">
                          <div className="flex items-center justify-center gap-2 md:gap-3">
                            <div className="flex items-center gap-1 md:gap-2 w-full justify-center">
                              <svg className={`w-3 h-3 md:w-4 md:h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className={`text-xs md:text-sm font-bold ${currentTheme.text} text-center`}>{eventDetails.date}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 w-full justify-center">
                              <svg className={`w-3 h-3 md:w-4 md:h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className={`text-xs md:text-sm font-bold ${currentTheme.text} text-center`}>{eventDetails.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <svg className={`w-3 h-3 md:w-4 md:h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className={`text-xs md:text-sm font-bold ${currentTheme.text} text-center`}>{eventDetails.venue}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // LinkedIn & Twitter Hero Section Layout
                  <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-8 lg:p-12 box-border">
                    {/* Header: Logo and Event Type - Fixed height */}
                    <div className="w-full h-12 md:h-16 flex justify-between items-center mb-4 flex-shrink-0">
                      {logo && (
                        <img src={logo} alt="Logo" className="h-8 md:h-10 lg:h-12 w-auto object-contain" />
                      )}
                      <div className={`inline-block px-3 py-1 md:px-4 md:py-2 rounded-full ${currentTheme.badge} font-bold text-xs md:text-sm ${currentTheme.glow} whitespace-nowrap`}>
                        {eventDetails.eventType.toUpperCase()}
                      </div>
                    </div>

                    {/* Main Hero Content: Centered Title - Flex grow */}
                    <div className="w-full flex-1 flex items-center justify-center">
                      <div className="w-full max-w-4xl mx-auto px-4">
                        <h3 
                          className={`text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4 md:mb-6 ${currentTheme.text} line-clamp-3`} 
                          style={{
                            textShadow: selectedTheme === 'dark' ? '0 0 30px rgba(0,0,0,0.8)' : '0 4px 20px rgba(0,0,0,0.1)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {eventDetails.title}
                        </h3>
                        {displayName && (
                          <p className={`text-base md:text-lg lg:text-xl font-semibold ${currentTheme.textSecondary} mb-4 md:mb-8 line-clamp-2`} style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            Attending: {displayName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer: Profile, Details, and Venue - Fixed height */}
                    <div className={`${currentTheme.card} backdrop-blur-md rounded-xl p-4 md:p-6 border w-full h-20 md:h-24 lg:h-32 flex-shrink-0 ${selectedTheme === 'dark' ? 'border-white/10' : 'border-gray-300'}`}>
                      <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center">
                        {/* Left: Profile and Basic Info */}
                        <div className="flex items-center gap-2 md:gap-4 col-span-2 md:col-span-2">
                          <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 md:border-4 ${currentTheme.border} ${currentTheme.glow} flex-shrink-0 ${selectedTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
                            {displayPhoto ? (
                              <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${selectedTheme === 'dark' ? 'from-slate-700 to-slate-800' : 'from-gray-200 to-gray-300'} flex items-center justify-center`}>
                                <svg className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 ${selectedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1 md:gap-2">
                              <svg className={`w-3 h-3 md:w-4 md:h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className={`text-xs md:text-sm font-bold ${currentTheme.text} truncate`}>{eventDetails.date}</p>
                            </div>
                            <div className="flex items-center gap-1 md:gap-2">
                              <svg className={`w-3 h-3 md:w-4 md:h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className={`text-xs md:text-sm font-bold ${currentTheme.text} truncate`}>{eventDetails.time}</p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Venue */}
                        <div className="text-center md:text-right col-span-1">
                          <div className="flex items-center justify-center md:justify-end gap-1 md:gap-2 mb-1">
                            <svg className={`w-3 h-3 md:w-4 md:h-4 ${selectedTheme === 'dark' ? 'text-cyan-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className={`text-xs ${currentTheme.textSecondary} font-medium hidden md:inline`}>VENUE</span>
                          </div>
                          <p className={`text-sm md:text-base lg:text-lg font-bold ${currentTheme.text} truncate`}>{eventDetails.venue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
                aria-label="Previous slide"
              >
                <FiChevronLeft size={24} />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
                aria-label="Next slide"
              >
                <FiChevronRight size={24} />
              </button>
            </div>

            {/* Platform-specific actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleShare('download', selectedPlatform)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                <FiDownload /> Download
              </button>
              
              {selectedPlatform === 'linkedin' && (
                <button
                  onClick={() => handleShare('linkedin', selectedPlatform)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaLinkedin /> Share on LinkedIn
                </button>
              )}
              
              {selectedPlatform === 'instagram' && (
                <button
                  onClick={() => alert('For Instagram, please download and share from your device')}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  <FaInstagram /> Share on Instagram
                </button>
              )}
              
              {selectedPlatform === 'twitter' && (
                <button
                  onClick={() => handleShare('twitter', selectedPlatform)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                  <FaTwitter /> Share on Twitter
                </button>
              )}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {platforms.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-cyan-500 w-6' : 'bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
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