import Link from 'next/link';
import { DiscIcon as Discord, Youtube, Github } from 'lucide-react';

const RedditIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.505 1.12-.818 2.67-1.35 4.385-1.466l.89-4.114c.052-.242.275-.409.524-.383l2.92.614a1.235 1.235 0 0 1 1.302-1.058zm-7.64 5.952c-.895 0-1.62.726-1.62 1.62 0 .895.725 1.62 1.62 1.62.894 0 1.62-.725 1.62-1.62 0-.895-.726-1.62-1.62-1.62zm5.26 0c-.895 0-1.62.726-1.62 1.62 0 .895.725 1.62 1.62 1.62.894 0 1.62-.725 1.62-1.62 0-.895-.726-1.62-1.62-1.62zm-2.63 3.655c-1.326 0-2.482.502-3.165 1.25l-.036.04.054.027c.307.155.679.243 1.07.243 1.326 0 2.482-.502 3.165-1.25l.036-.04-.054-.027c-.308-.155-.679-.243-1.07-.243z"/>
  </svg>
)

const MessengerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654v4.235l4.086-2.242c1.09.301 2.245.464 3.445.464 6.627 0 12-4.975 12-11.112S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.26 5.888-3.26-6.559 6.963z"/>
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-4 text-center">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Brand Logo / Title */}
        <Link href="/" className="inline-flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Tacticianclimb Logo" className="w-8 h-8 rounded-lg" />
          <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            TacticianClimb
          </h2>
        </Link>

        {/* Short bio/description */}
        <p className="text-slate-400 max-w-sm mb-8 text-sm leading-relaxed">
          The premium platform for Teamfight Tactics coaching, boosting, and community tournaments. Built for players, by players.
        </p>

        {/* Social Links */}
        <div className="flex gap-4 mb-12">
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-slate-800 transition-all">
            <Discord className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all">
            <MessengerIcon className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-500/50 hover:bg-slate-800 transition-all">
            <RedditIcon className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500/50 hover:bg-slate-800 transition-all">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500/50 hover:bg-slate-800 transition-all">
            <Github className="w-4 h-4" />
          </a>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 mb-12">
          <Link href="/login" className="hover:text-purple-400 transition-colors">Admin Login</Link>
          <a href="#" className="hover:text-purple-400 transition-colors">Disclaimer</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-600 font-medium">
          &copy; {currentYear} TacticianClimb. All rights reserved. <br className="sm:hidden" />
          Not affiliated with Riot Games.
        </div>
      </div>
    </footer>
  );
}
