'use client';

import React from 'react';

// Custom Brand SVGs
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.17 1.23 1.33 2.95 2.16 4.77 2.37v3.96c-1.87-.04-3.69-.69-5.18-1.84-.28-.21-.54-.45-.78-.7v6.62c.04 1.95-.54 3.91-1.67 5.48-1.42 1.95-3.75 3.12-6.17 3.15-2.58.07-5.15-1.07-6.76-3.1-1.66-2.1-2.22-4.96-1.5-7.55C1.62 10.37 3.73 8.35 6.3 7.82c1.08-.22 2.2-.14 3.23.23v4.06c-.84-.36-1.81-.39-2.65.1-.96.55-1.52 1.63-1.45 2.73.04 1.13.72 2.16 1.73 2.67.97.48 2.13.39 3-.24.64-.47.99-1.23.97-2.02l-.01-17.33z"/>
  </svg>
);

const TwitchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

const NetflixIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M5.998 0h3.562l6.237 14.654V0h2.203v24h-3.562L8.201 9.346V24H5.998V0z" fill="currentColor"/>
  </svg>
);

const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M12 0C5.373 0 0 5.372 0 12s5.373 12 12 12 12-5.372 12-12S18.627 0 12 0zm5.485 17.306c-.215.353-.676.463-1.03.249-2.865-1.75-6.47-2.144-10.716-1.18-.403.093-.81-.162-.902-.565-.093-.403.162-.81.566-.902 4.646-1.06 8.623-.615 11.833 1.344.353.214.464.676.249 1.03zm1.467-3.26c-.27.44-.847.58-1.287.31-3.28-2.016-8.282-2.597-12.155-1.422-.496.15-1.022-.128-1.173-.624-.15-.497.127-1.023.624-1.173 4.417-1.34 9.923-.69 13.68 1.62.44.27.58.847.31 1.287zm.127-3.39c-3.932-2.336-10.423-2.55-14.205-1.402-.603.183-1.242-.158-1.425-.76-.182-.603.158-1.243.76-1.426 4.343-1.318 11.503-1.066 16.03 1.62.542.32.72.1.398 1.564-.32.543-1.02.72-1.56.398z"/>
  </svg>
);

const PLATFORMS = [
  { name: 'YouTube', icon: YoutubeIcon, color: 'text-red-500 hover:text-red-400', count: '142 channels' },
  { name: 'Instagram', icon: InstagramIcon, color: 'text-pink-500 hover:text-pink-400', count: '89 profiles' },
  { name: 'TikTok', icon: TikTokIcon, color: 'text-zinc-200 hover:text-white', count: '104 accounts' },
  { name: 'Twitch', icon: TwitchIcon, color: 'text-purple-400 hover:text-purple-300', count: '32 streams' },
  { name: 'Netflix', icon: NetflixIcon, color: 'text-red-600 hover:text-red-500', count: '12 shows' },
  { name: 'Spotify', icon: SpotifyIcon, color: 'text-emerald-500 hover:text-emerald-400', count: '28 podcasts' },
];

export default function SupportedPlatforms() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 shadow-sm">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 font-display">Connected Platforms</h3>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Active agency integrations</p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex items-center gap-2.5 p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700/80 transition-all duration-150 group cursor-default"
              >
                <Icon className={`w-4 h-4 ${platform.color} transition-transform duration-150 group-hover:scale-110`} />
                <div>
                  <p className="text-xs font-semibold text-zinc-300">{platform.name}</p>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{platform.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
