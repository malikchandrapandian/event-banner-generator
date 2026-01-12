// app/page.tsx
'use client'

import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { toPng } from 'html-to-image';
import { toast } from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';

type Platform = 'linkedin';
type Theme = 'light';

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>('https://www.techkoodaram.in/_next/image?url=%2Flogo.png&w=640&q=75');
  const [displayName, setDisplayName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [eventDetails, setEventDetails] = useState({
    eventType: 'Meetup',
    title: 'techKoodaram Meetup #1',
    date: 'Jan 24, 2026',
    venue: 'PSR Engineering College, Sivakasi',
    time: '9.30am to 1.00pm'
  });

  // Fixed values as requested
  const selectedPlatform: Platform = 'linkedin';
  const selectedTheme: Theme = 'light';

  const bannerRef = useRef<HTMLDivElement>(null);

  const platformDimensions = {
    linkedin: { width: 1200, height: 627, label: 'LinkedIn (1200×627)' },
  };

  const previewSize = {
    linkedin: { width: 800, height: Math.round(800 * 627 / 1200) },
  };

  const currentTheme = {
    background: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    overlay: 'bg-white bg-opacity-60',
    card: 'bg-white/80',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    badge: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white',
    // border: 'border-purple-600', // not used for profile anymore
    glow: 'shadow-[0_0_30px_rgba(147,51,234,0.3)]'
  };

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


  const handleDownload = async () => {
    const element = document.getElementById('preview-image-area');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `linkedin-banner-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Failed to download. Please try again.');
    }
  };

  const displayPhoto = photo;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <img src="/techkoodaram-logo.webp" alt="techKoodaram" className="object-contain" width={220} height={23} />
            <span>Banner Generator</span>
          </h1>
          {/* <p className="text-gray-600 text-lg">Create stunning banners for LinkedIn</p> */}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1 space-y-6">

            {/* Name Input */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Your Name</h2>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Role Input */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Role</h2>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="E.g. Student/Developer"
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Profile Photo</h2>
              <p className="text-sm text-gray-500 mb-4">Upload your profile photo to use in the banner.</p>

              <div
                {...getPhotoRootProps()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-50 transition-all"
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
                    <p className="text-gray-500 text-sm font-medium">Upload Photo</p>
                    <p className="text-xs text-gray-400 mt-1">(JPG, PNG, WebP)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hidden Fields (kept in DOM but hidden as requested) */}
            <div className="hidden">
              {/* Platform Selection, Theme Selection, Event Details, Logo Upload - all hidden/removed or static */}
              <input type="text" value={eventDetails.eventType} readOnly />
              <input type="text" value={eventDetails.title} readOnly />
              {/* ... other hidden inputs if strictly needed for form submission, but here purely UI */}
            </div>

          </div>

          {/* Banner Preview */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Preview
            </h2>
            <div id="preview-image-area" className="relative flex justify-center items-center min-h-[500px] bg-primary-theme">
              <div
                ref={bannerRef}
                className={`${currentTheme.background} overflow-hidden shadow-2xl relative`}
                style={{
                  width: previewSize.linkedin.width,
                  height: previewSize.linkedin.height
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
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px'
                }}></div>

                {/* LinkedIn Hero Layout */}
                <div className="relative z-10 w-full h-full flex flex-col p-6 md:p-8 lg:p-12 box-border">
                  {/* Header: Logo and Event Type - Fixed height */}
                  <div className="w-full h-12 md:h-16 flex justify-between items-center mb-4 flex-shrink-0">
                    {logo && (
                      <img
                        src={logo}
                        alt="Logo"
                        style={{ width: '220px', height: 'auto', maxHeight: '23px', objectFit: 'contain', objectPosition: 'left' }}
                      />
                    )}
                    <div className={`inline-block px-3 py-1 md:px-4 md:py-2 rounded-full bg-secondary text-secondary-foreground font-bold text-xs md:text-sm ${currentTheme.glow} whitespace-nowrap`}>
                      {eventDetails.eventType.toUpperCase()}
                    </div>
                  </div>

                  {/* Main Hero Content: Centered Title - Flex grow */}
                  <div className="w-full flex-1 flex items-center justify-center">
                    <div className="w-full max-w-4xl mx-auto px-4">
                      <p className={`text-xs font-semibold ${currentTheme.textSecondary} uppercase tracking-wider mb-0.5`}>I am attending</p>
                      <h3
                        className={`text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4 md:mb-6 ${currentTheme.text} line-clamp-3`}
                        style={{
                          textShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {eventDetails.title}
                      </h3>

                    </div>
                  </div>

                  {/* Footer: Profile, Details, and Venue - Fixed height */}
                  <div className={`${currentTheme.card} backdrop-blur-md rounded-xl p-4 border w-full h-24 flex-shrink-0 border-gray-300`}>
                    <div className="flex justify-between items-center w-full h-full px-2">

                      {/* Left: Profile + Name */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white`}
                          style={{
                            border: '4px solid #926839'
                          }}
                        >
                          {displayPhoto ? (
                            <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}>
                              <svg className={`w-6 h-6 text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-lg font-bold ${currentTheme.text} leading-tight`}>{displayName || "Your Name"}</p>
                          {role && <p className={`text-sm font-medium ${currentTheme.textSecondary} mt-0.5`}>{role}</p>}
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="text-right space-y-0.5">
                        <div className="flex items-center justify-end gap-2">
                          <p className={`text-sm font-semibold ${currentTheme.text}`}>{eventDetails.date}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <p className={`text-sm font-semibold ${currentTheme.text}`}>{eventDetails.time}</p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <p className={`text-sm font-bold ${currentTheme.text}`}>{eventDetails.venue}</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform-specific actions */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleDownload}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-primary-theme hover:bg-primary-theme/80 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-primary-theme/30"
              >
                <FiDownload className="text-xl" /> Download Banner
              </button>
            </div>

          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} techKoodaram Banner Generator</p>
        </footer>
      </div>
    </main>
  );
}