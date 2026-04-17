import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export function InputForm({
  topic,
  setTopic,
  level,
  setLevel,
  onSubmit,
  loading,
}: {
  topic: string;
  setTopic: (s: string) => void;
  level: "eli5" | "beginner" | "detailed";
  setLevel: (l: "eli5" | "beginner" | "detailed") => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="w-full max-w-[580px] mx-auto relative px-4 sm:px-0">
      <form onSubmit={onSubmit} className="w-full relative">
        <div className="relative bg-white rounded-xl border border-border pt-4 sm:pt-5 pb-[0.625rem] sm:pb-3 px-4 sm:px-5 transition-all duration-200 focus-within:border-accent focus-within:shadow-[0_0_0_3px_#e0f2fe,0_10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="relative h-14 flex items-center mt-1 text-center justify-center">
            <input
              type="text"
              autoComplete="off"
              className="w-full h-full absolute inset-0 border-none outline-none font-sans text-[1.0625rem] text-text-primary bg-transparent leading-relaxed peer pt-4 text-center"
              placeholder=" "
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onFocus={() => setShowHint(true)}
              onBlur={() => setShowHint(false)}
              disabled={loading}
              id="topicInput"
            />
            <label 
              htmlFor="topicInput" 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base text-text-muted pointer-events-none transition-all duration-300 origin-top peer-focus:top-0 peer-focus:-translate-y-1 peer-focus:scale-[0.85] peer-focus:text-accent peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1 peer-not-placeholder-shown:scale-[0.85] peer-not-placeholder-shown:text-accent whitespace-nowrap"
            >
              What do you want to understand?
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 pt-3 border-t border-border gap-4 sm:gap-2">
            <div className="flex gap-1 sm:gap-2">
              {(["eli5", "beginner", "detailed"] as const).map((l) => {
                const active = level === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    disabled={loading}
                    className={`px-2.5 sm:px-[0.875rem] py-1 sm:py-[0.375rem] rounded-full text-[11px] sm:text-xs font-medium border transition-all duration-200 font-sans cursor-pointer whitespace-nowrap ${
                      active 
                        ? 'text-accent bg-accent-soft border-accent/20' 
                        : 'bg-transparent border-transparent text-text-muted hover:bg-bg-secondary hover:text-text-secondary'
                    }`}
                  >
                    {l === 'eli5' ? 'ELI5' : l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setTopic(''); document.getElementById('topicInput')?.focus(); }}
                className={`w-7 h-7 rounded-full border-none bg-transparent text-text-muted flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-bg-secondary hover:text-text-secondary ${topic.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.8] pointer-events-none'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button
                type="submit"
                disabled={loading || topic.trim().length < 3}
                className="px-4 sm:px-5 py-[0.4375rem] sm:py-2 rounded-lg border-none bg-text-primary text-white font-sans text-[13px] font-medium cursor-pointer flex items-center gap-1.5 sm:gap-2 transition-all duration-200 hover:bg-accent hover:-translate-y-[1px] disabled:opacity-50 disabled:hover:bg-text-primary disabled:hover:translate-y-0"
              >
                <span>Simplify</span>
                {loading ? (
                   <div className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                   </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <p className={`mt-3 text-[0.75rem] text-text-muted transition-all duration-200 ${showHint || topic ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
        Press <kbd className="bg-bg-secondary px-[0.375rem] py-[0.125rem] rounded border border-border font-sans text-[0.6875rem]">Enter</kbd> to simplify
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="text-center py-12 animate-fadeIn">
      <p className="font-crimson text-xl italic text-text-secondary mb-4">Simplifying...</p>
      <div className="inline-flex gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[bounce_1.4s_ease-in-out_infinite] [animation-delay:-0.32s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[bounce_1.4s_ease-in-out_infinite] [animation-delay:-0.16s]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[bounce_1.4s_ease-in-out_infinite]"></span>
      </div>
    </div>
  );
}

export function ExplainOutput({
  topic,
  explanation,
  example,
  analogy,
  onReset
}: {
  topic: string;
  explanation: string;
  example: string;
  analogy: string;
  onReset: () => void;
}) {
  return (
    <section className="w-full max-w-[680px] mx-auto pb-12 animate-fadeIn">
      <header className="text-center mb-12 pb-6 border-b border-border animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent mb-2">Understanding</div>
        <h2 className="font-crimson text-3xl md:text-4xl font-medium text-text-primary tracking-tight capitalize">{topic}</h2>
      </header>

      <div className="mb-10 opacity-0 translate-y-3 animate-fadeInUp" style={{ animationDelay: '0.15s', animationFillMode: 'forwards' }}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-3.5">Explanation</div>
        <div className="font-crimson text-lg leading-[1.8] text-text-primary">
          <p>{explanation}</p>
        </div>
      </div>

      <div className="mb-10 opacity-0 translate-y-3 animate-fadeInUp" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-3.5">Example</div>
        <div className="font-crimson text-lg leading-[1.8] text-text-primary">
          <p>{example}</p>
        </div>
      </div>

      <div className="mb-10 opacity-0 translate-y-3 animate-fadeInUp" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted mb-3.5">Analogy</div>
        <div className="font-crimson text-lg leading-[1.8] text-text-primary">
          <p>{analogy}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12 pt-6 border-t border-border opacity-0 animate-fadeInUp" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        <button
          onClick={onReset}
          className="text-sm text-text-primary font-medium flex items-center gap-2 hover:text-accent transition-colors outline-none cursor-pointer bg-transparent border-none"
        >
          <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500" />
          Try another topic
        </button>
        <a href="https://buymeacoffee.com/deepikasr" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary flex items-center gap-2 hover:text-accent transition-colors cursor-pointer no-underline">
          Support Simplly ☕
        </a>
      </div>
    </section>
  );
}

import Link from "next/link";
export function Footer() {
  return (
    <footer className="w-full py-10 px-6 text-center border-t border-border mt-auto">
       <a href="https://buymeacoffee.com/deepikasr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent mb-6 cursor-pointer no-underline">
         Support Simplly ☕
       </a>
       <div className="flex justify-center gap-6 mb-5">
         <Link href="/about" className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer">About</Link>
         <Link href="/blog" className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer">Blog</Link>
         <span className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer" onClick={() => alert('Coming soon')}>Privacy</span>
         <span className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer" onClick={() => alert('Coming soon')}>Terms</span>
       </div>
       <p className="text-xs text-text-muted">© 2026 Simplly. Created with curiosity by Deepika</p>
    </footer>
  );
}
