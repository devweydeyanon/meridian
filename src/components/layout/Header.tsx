'use client';

import Link from 'next/link';
import { Logo } from './Logo';
import { HamburgerMenu } from './HamburgerMenu';
import {
  personalNav, businessNav, corporateNav,
  personalMobileNav, businessMobileNav, corporateMobileNav,
  type NavItem,
} from './navData';

interface HeaderProps {
  variant?: 'personal' | 'business' | 'corporate';
}

export function Header({ variant = 'personal' }: HeaderProps) {
  const navItems = variant === 'corporate' ? corporateNav : variant === 'business' ? businessNav : personalNav;
  const mobileNav = variant === 'corporate' ? corporateMobileNav : variant === 'business' ? businessMobileNav : personalMobileNav;
  const logoSub = variant === 'corporate' ? 'Corporate & Institutional' : undefined;

  return (
    <>
      {/* Utility Bar */}
      <div className="bg-navy-800 border-b border-white/5 max-md:hidden">
        <div className="max-w-container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex">
              <Link href="/" className={`px-6 py-2.5 text-sm font-bold transition-colors relative no-underline ${variant === 'personal' ? 'text-white bg-white/5' : 'text-white/60 hover:text-white'}`}>
                Personal
                {variant === 'personal' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-cta-primary" />}
              </Link>
              <Link href="/business" className={`px-6 py-2.5 text-sm font-bold transition-colors relative border-l border-white/10 no-underline ${variant === 'business' ? 'text-white bg-white/5' : 'text-white/60 hover:text-white'}`}>
                Business
                {variant === 'business' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-cta-primary" />}
              </Link>
              <Link href="/corporate" className={`px-6 py-2.5 text-sm font-bold transition-colors relative border-l border-white/10 no-underline ${variant === 'corporate' ? 'text-white bg-white/5' : 'text-white/60 hover:text-white'}`}>
                Corporate & Institutional
                {variant === 'corporate' && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-cta-primary" />}
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/branches" className="text-xs text-white/60 hover:text-white font-medium no-underline">ATMs & Branches</Link>
              <Link href="/help" className="text-xs text-white/60 hover:text-white font-medium no-underline">Help</Link>
              <Link href="/contact" className="text-xs text-white/60 hover:text-white font-medium no-underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[1000] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="max-w-container mx-auto px-6">
          <div className="flex items-center justify-between h-[68px] max-md:h-14">
            <Logo sub={logoSub} />

            {/* Desktop Nav */}
            <nav className="flex items-center gap-0 max-md:hidden">
              {navItems.map((item) => (
                <NavItemComponent key={item.label} item={item} hasDropdown={variant !== 'corporate'} />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              {variant === 'corporate' ? (
                <>
                  <Link href="/login" className="max-md:hidden">
                    <button className="px-5 py-2.5 text-[13.5px] font-semibold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans transition-all hover:border-gray-400">
                      Client login
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="px-5 py-2.5 text-[13.5px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans transition-all hover:bg-cta-hover max-md:px-4 max-md:py-2 max-md:text-xs">
                      Contact us
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="max-md:block">
                    <button className="px-5 py-2.5 text-[13.5px] font-semibold text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer font-sans transition-all hover:border-gray-400 max-md:bg-cta-primary max-md:text-white max-md:border-none max-md:px-4 max-md:py-2 max-md:text-xs max-md:font-bold">
                      Log in
                    </button>
                  </Link>
                  <Link href="/open-account" className="max-md:hidden">
                    <button className="px-5 py-2.5 text-[13.5px] font-bold text-white bg-cta-primary border-none rounded-md cursor-pointer font-sans transition-all hover:bg-cta-hover">
                      Open an account
                    </button>
                  </Link>
                </>
              )}
              <HamburgerMenu sections={mobileNav} variant={variant} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function NavItemComponent({ item, hasDropdown }: { item: NavItem; hasDropdown: boolean }) {
  const showDropdown = hasDropdown && item.dropdown && item.dropdown.length > 0;

  return (
    <div className="relative group">
      <Link
        href={item.href}
        className="flex items-center gap-1 px-4 py-5 text-[14.5px] font-semibold text-gray-700 hover:text-navy-900 transition-colors no-underline"
      >
        {item.label}
        {showDropdown && (
          <svg className="w-3 h-3 text-gray-400 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </Link>

      {showDropdown && (
        <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[220px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
          {item.dropdown!.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="block px-5 py-2.5 text-[13.5px] text-gray-600 hover:bg-gray-50 hover:text-navy-900 font-medium no-underline"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
