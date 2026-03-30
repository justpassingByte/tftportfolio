'use client';

import Link from 'next/link';
import { Menu, X, Globe, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface NavbarProps {
  displayName: string;
  activeSections?: string[];
  contactLinks?: { discord?: string; telegram?: string; custom?: string; discord_server?: string };
}

export default function Navbar({ displayName, activeSections, contactLinks }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, t, toggleLocale } = useI18n();

  const allNavLinks = [
    { id: 'about_avatar', label: t.nav.about, href: '#about_avatar' },
    { id: 'comparison', label: t.nav.difference, href: '#comparison' },
    { id: 'proof', label: t.nav.results, href: '#proof' },
    { id: 'gallery', label: t.nav.gallery, href: '#gallery' },
    { id: 'reviews', label: t.nav.reviews, href: '#reviews' },
  ];

  // Only show links for sections that are actually loaded on the page
  const navLinks = activeSections 
    ? allNavLinks.filter(link => activeSections.includes(link.id))
    : allNavLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Booster Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Tacticianclimb Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-bold text-lg hidden sm:block tracking-wide">
                Tacticianclimb <span className="text-slate-500 font-normal">/ {displayName}</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 border border-slate-700/50 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            
            {/* Always map Community in the menu list */}
            <a
              href="#community"
              className="px-4 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#community')?.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', '#community');
              }}
            >
              {t.nav.community || 'Community'}
            </a>
          </div>

          {/* Right side: Language toggle + Login */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Selection Segmented Control */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/50">
              <button
                onClick={() => locale !== 'vi' && toggleLocale('vi')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  locale === 'vi' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                VN
              </button>
              <button
                onClick={() => locale !== 'en' && toggleLocale('en')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                  locale === 'en' 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                EN
              </button>
            </div>
            
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 hover:text-purple-300 border-slate-700 transition-colors shadow-sm"
            >
              {t.nav.dashboard_login}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => toggleLocale()}
              className="text-slate-300 hover:text-white px-2 py-1 rounded border border-slate-700/50 text-xs font-medium"
            >
              {locale === 'vi' ? 'EN' : 'VI'}
            </button>
            <button
              type="button"
              className="text-slate-400 hover:text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full left-0 top-16 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', link.href);
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-800">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-3 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                {t.nav.dashboard_login}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
