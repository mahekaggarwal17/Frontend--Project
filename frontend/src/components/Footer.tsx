'use client';

import React, { useRef, useEffect } from 'react';
import { GitBranch, Share2, Zap, Heart } from 'lucide-react';
import gsap from 'gsap';

const FOOTER_LINKS = [
  {
    title: 'Product',
    items: ['Directory', 'Analytics', 'Campaigns', 'Reports'],
  },
  {
    title: 'Resources',
    items: ['Documentation', 'API Reference', 'Changelog', 'Status'],
  },
  {
    title: 'Company',
    items: ['About', 'Blog', 'Careers', 'Contact'],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !footerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const columns = footerRef.current?.querySelectorAll('.footer-col');
            if (!columns) return;
            gsap.fromTo(
              columns,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
              }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="mt-16 border-t border-slate-800/60 bg-[#030712]/90 backdrop-blur-xl"
    >
      {/* Divider */}
      <div className="h-[1px] w-full bg-zinc-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div className="footer-col col-span-2 sm:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-sm">
                <Zap size={15} className="text-zinc-300" />
              </div>
              <span className="font-bold text-zinc-100 font-display tracking-tight">
                Creator<span className="text-blue-500">CRM</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
              The premium influencer management platform for modern creator agencies.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2">
              {[GitBranch, Share2].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-blue-500 hover:border-blue-500/30 transition-all duration-150 cursor-pointer"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="footer-col space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 font-mono">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-[#BBF351] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-pink-500 fill-pink-500" /> by Creator CRM Team · © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-slate-500 font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
