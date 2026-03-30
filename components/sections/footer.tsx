import Link from 'next/link';
import { Twitter, DiscIcon as Discord, Youtube, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-4 text-center">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Brand Logo / Title */}
        <Link href="/" className="inline-block mb-6">
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
            <Twitter className="w-4 h-4" />
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
