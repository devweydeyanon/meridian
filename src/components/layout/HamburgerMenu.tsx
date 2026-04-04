'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { MobileNavSection } from './navData';

interface HamburgerMenuProps {
  sections: MobileNavSection[];
  variant?: 'personal' | 'business' | 'corporate';
}

export function HamburgerMenu({ sections, variant = 'personal' }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);

  const loginHref = variant === 'corporate' ? '/login' : '/login';
  const openHref = '/open-account';

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="hidden max-md:block w-9 h-9 bg-transparent border-none cursor-pointer p-1.5 relative z-[10001] ml-2"
        aria-label="Menu"
      >
        <span className={`block w-5 h-0.5 bg-gray-700 mx-auto rounded-sm transition-all duration-300 ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
        <span className={`block w-5 h-0.5 bg-gray-700 mx-auto rounded-sm transition-all duration-300 mt-1 ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-gray-700 mx-auto rounded-sm transition-all duration-300 mt-1 ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 w-[300px] h-screen bg-white z-[9999] overflow-y-auto shadow-[-4px_0_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-800">Menu</h3>
          <button onClick={() => setOpen(false)} className="bg-transparent border-none cursor-pointer p-1 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="py-3">
          {sections.map((section) => (
            <div key={section.title} className="px-5 pb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 pt-3">
                {section.title}
              </div>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-sm font-medium text-gray-700 border-b border-gray-100 hover:text-accent-500 no-underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-gray-200 mt-2">
          <Link
            href={openHref}
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-sm font-bold rounded-md bg-cta-primary text-white mb-2 no-underline"
          >
            Open an account
          </Link>
          <Link
            href={loginHref}
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-sm font-bold rounded-md bg-white text-gray-700 border border-gray-300 no-underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </>
  );
}
