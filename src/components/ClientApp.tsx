"use client";

import { useState, useEffect } from "react";
import { InputForm, ExplainOutput, LoadingState } from "@/components/SimpllyUI";
import { AlertCircle, ChevronRight } from "lucide-react";

export type BlogEntry = {
    id: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
    body: string;
};

type PageType = "home" | "about" | "blog" | "article" | "privacy" | "terms";

export default function ClientApp({ initialBlogs }: { initialBlogs: BlogEntry[] }) {
  const [activePage, setActivePage] = useState<PageType>("home");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<"eli5" | "beginner" | "detailed">("eli5");
  const [data, setData] = useState<{explanation: string, example: string, analogy: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = (page: PageType, articleId: string | null = null) => {
     if (articleId) setActiveArticleId(articleId);
     setActivePage(page);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Attach dynamic event listeners to any raw HTML spanning elements that might use data-navigate="home"
  useEffect(() => {
    if (activePage === 'article') {
       const links = document.querySelectorAll('[data-navigate]');
       const handler = (e: any) => {
          const targetStr = e.currentTarget.getAttribute('data-navigate');
          if (targetStr) navigate(targetStr as PageType);
       };
       links.forEach(l => l.addEventListener('click', handler));
       return () => links.forEach(l => l.removeEventListener('click', handler));
    }
  }, [activePage, activeArticleId]);

  const handleExplain = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (topic.trim().length < 3) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), level })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "Failed to fetch");
      setData(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        document.getElementById('outputSection')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const activeBlog = initialBlogs.find(b => b.id === activeArticleId);

  const resetAll = () => {
    setTopic("");
    setData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Nav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-5 flex justify-between items-center bg-gradient-to-b from-bg-primary to-transparent backdrop-blur-md">
      <span onClick={() => navigate('home')} className="font-crimson text-[1.5rem] font-semibold text-text-primary tracking-tight transition-opacity hover:opacity-80 cursor-pointer">
        Simplly
      </span>
      <div className="flex gap-4 sm:gap-8 items-center">
        <span onClick={() => navigate('about')} className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer">About</span>
        <span onClick={() => navigate('blog')} className="text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer">Blog</span>
      </div>
    </nav>
  );

  const FooterComp = () => (
    <footer className="w-full py-10 px-6 text-center border-t border-border mt-auto">
       <a href="https://buymeacoffee.com/deepikasr" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent mb-6 cursor-pointer no-underline">
         Support Simplly ☕
       </a>
       <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-5">
         <span onClick={() => navigate('about')} className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer">About</span>
         <span onClick={() => navigate('blog')} className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer">Blog</span>
         <span onClick={() => navigate('privacy')} className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer">Privacy</span>
         <span onClick={() => navigate('terms')} className="text-[13px] text-text-muted hover:text-text-primary transition-colors cursor-pointer">Terms</span>
       </div>
       <p className="text-xs text-text-muted">© 2026 Simplly. Created with curiosity by Deepika</p>
    </footer>
  );

  const renderHome = () => (
    <div className={`page ${activePage === 'home' ? 'block' : 'hidden'} min-h-screen flex flex-col`}>
      <main className="w-full max-w-[720px] mx-auto px-6 pt-[8rem] pb-12 flex-1 flex flex-col">
        <section className={`flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${data || loading ? 'justify-start py-4' : 'justify-center py-12 flex-1'}`}>
          <h1 className="font-crimson text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-[1.1] mb-4 text-text-primary tracking-[-0.02em] animate-fadeIn">
            Understand anything. <em className="italic text-accent not-italic font-normal">Clearly.</em>
          </h1>
          <p className="text-base text-text-secondary max-w-[400px] mx-auto mb-10 font-light leading-[1.6] animate-fadeIn" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            Complex ideas, explained simply. Type any topic and choose how deep you want to go.
          </p>

          <div className="w-full animate-fadeIn" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            <InputForm 
              topic={topic}
              setTopic={setTopic}
              level={level}
              setLevel={setLevel}
              onSubmit={handleExplain}
              loading={loading}
            />
          </div>
        </section>

        {loading && <div className="mt-8"><LoadingState /></div>}

        {error && !loading && (
          <div className="w-full max-w-[600px] mx-auto p-6 mt-8 bg-red-500/5 border border-red-500/20 text-red-600 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
            <AlertCircle size={32} />
            <h3 className="font-crimson font-medium text-xl">Oops! Something went wrong.</h3>
            <p className="text-sm font-sans">{error}</p>
            <button 
               onClick={() => handleExplain()}
               className="mt-4 px-5 py-2.5 bg-red-500 font-medium text-white rounded-lg hover:bg-red-600 outline-none transition-colors border-none"
            >
               Try Again
            </button>
          </div>
        )}

        {data && !loading && (
          <div id="outputSection" className="mt-4 pt-4">
            <ExplainOutput 
               topic={topic}
               explanation={data.explanation}
               example={data.example}
               analogy={data.analogy}
               onReset={resetAll}
            />
          </div>
        )}

        {(!data && !loading) && (
          <section className="py-20 border-t border-border mt-12 w-full animate-fadeIn" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
              <div className="text-center mb-10">
                  <h2 className="font-crimson text-[1.75rem] font-medium mb-2">Clarity, refined</h2>
                  <p className="text-text-secondary text-base">Tools designed for deep understanding</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-7 rounded-xl bg-white border border-border transition-all duration-300 hover:-translate-y-[2px] hover:shadow-soft">
                      <h3 className="font-crimson text-lg font-medium mb-2">Adaptive Depth</h3>
                      <p className="text-[14px] text-text-secondary leading-[1.6]">From quick summaries to deep dives. Choose your level and we adjust automatically.</p>
                  </div>
                  <div className="p-7 rounded-xl bg-white border border-border transition-all duration-300 hover:-translate-y-[2px] hover:shadow-soft">
                      <h3 className="font-crimson text-lg font-medium mb-2">Structured Thinking</h3>
                      <p className="text-[14px] text-text-secondary leading-[1.6]">Every explanation follows a clear framework: concept, example, analogy.</p>
                  </div>
                  <div className="p-7 rounded-xl bg-white border border-border transition-all duration-300 hover:-translate-y-[2px] hover:shadow-soft">
                      <h3 className="font-crimson text-lg font-medium mb-2">Save & Revisit</h3>
                      <p className="text-[14px] text-text-secondary leading-[1.6]">Build your personal library of simplified concepts.</p>
                  </div>
              </div>
          </section>
        )}
      </main>
      <FooterComp />
    </div>
  );

  const renderBlog = () => (
    <div className={`page ${activePage === 'blog' ? 'block' : 'hidden'} min-h-screen flex flex-col`}>
      <main className="w-full max-w-[720px] mx-auto px-6 pt-[7rem] pb-20 flex-1 animate-fadeIn">
          <header className="text-center mb-12">
              <h1 className="font-crimson text-[clamp(2.5rem,5vw,3.5rem)] font-medium mb-3 tracking-[-0.02em]">The Journal</h1>
              <p className="font-crimson text-lg text-text-secondary italic">Thoughts on clarity, learning, and understanding</p>
          </header>

          <div className="flex flex-col">
              {initialBlogs.map((blog, idx) => (
                  <div key={blog.id} onClick={() => navigate('article', blog.id)} className={`block cursor-pointer py-8 border-b border-border transition-all duration-300 hover:pl-3 group ${idx === 0 ? 'pt-0' : ''}`}>
                      <h2 className="font-crimson text-2xl font-medium mb-2 tracking-[-0.01em] transition-colors group-hover:text-accent">{blog.title}</h2>
                      <p className="text-[15px] text-text-secondary leading-[1.6] mb-3">{blog.description}</p>
                      <div className="text-[13px] text-text-muted flex gap-3">{blog.readTime} &bull; {blog.category}</div>
                  </div>
              ))}
          </div>
      </main>
      <FooterComp />
    </div>
  );

  const renderArticle = () => {
    if (!activeBlog) return null;

    // React's dangerouslySetInnerHTML combined with global CSS or tailwind mappings allows HTML parsing
    // However, since MD files use className instead of class in our examples, React will absorb it natively 
    // if using dangerouslySetInnerHTML, it allows standard HTML `class`. We provided `className` string replacements in the parser.
    return (
      <div className={`page ${activePage === 'article' ? 'block' : 'hidden'} min-h-screen flex flex-col`}>
        <main className="w-full max-w-[680px] mx-auto px-6 pt-[7rem] pb-12 flex-1 animate-fadeIn">
            <article>
                <header className="text-center mb-10">
                    <div className="text-[13px] text-text-muted mb-4 uppercase tracking-[0.1em]">{activeBlog.category} &bull; {activeBlog.readTime}</div>
                    <h1 className="font-crimson text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.2] mb-4 tracking-[-0.02em]">{activeBlog.title}</h1>
                    <p className="font-crimson text-xl text-text-secondary italic leading-[1.5]">{activeBlog.description}</p>
                </header>

                <div 
                   className="font-crimson text-lg leading-[1.75] text-text-primary"
                   dangerouslySetInnerHTML={{ __html: activeBlog.body }}
                />

                <footer className="mt-12 pt-6 border-t border-border flex justify-between items-center">
                    <div className="font-sans text-sm text-text-secondary">Written by <strong className="text-text-primary font-medium">The Simplly Team</strong></div>
                    <a href="https://buymeacoffee.com/deepikasr" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary flex items-center gap-2 hover:text-accent transition-colors cursor-pointer no-underline">Support ☕</a>
                </footer>
            </article>
        </main>
        <FooterComp />
      </div>
    );
  };

  const renderAbout = () => (
    <div className={`page ${activePage === 'about' ? 'block' : 'hidden'} min-h-screen flex flex-col`}>
      <main className="w-full max-w-[680px] mx-auto px-6 pt-[7rem] pb-20 flex-1 animate-fadeIn">
          <header className="text-center mb-12">
              <h1 className="font-crimson text-[clamp(2.25rem,5vw,3rem)] font-medium mb-4 tracking-[-0.02em] leading-tight">Find clarity in complexity</h1>
              <p className="font-crimson text-xl text-text-secondary italic leading-[1.5]">Simplly exists because understanding should not be a privilege. It is a right for the curious.</p>
          </header>

          <div className="mb-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent mb-3">Why We Exist</div>
              <p className="font-crimson text-lg leading-[1.75] text-text-primary">We live in an age of information abundance and comprehension scarcity. Never before have we had access to so much knowledge, yet never before have we felt so overwhelmed by it.</p>
          </div>

          <div className="mb-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent mb-3">The Problem</div>
              <p className="font-crimson text-lg leading-[1.75] text-text-primary">Complexity is often used as a shield. Jargon creates artificial barriers. We accept that certain subjects are "hard" before we even try.</p>
          </div>

          <div className="py-8 my-8 border-y border-border text-center">
              <p className="font-crimson text-[1.375rem] italic text-text-secondary leading-[1.4] m-0">"Simplicity is the ultimate sophistication."</p>
          </div>

          <div className="mb-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent mb-3">Our Approach</div>
              <p className="font-crimson text-lg leading-[1.75] text-text-primary">Every explanation follows a proven framework: concept, example, analogy. This is not dumbing down. It is building up.</p>
          </div>

          <div className="text-center py-8 mt-4">
              <span onClick={() => navigate('home')} className="inline-flex cursor-pointer items-center gap-2.5 bg-text-primary text-white px-7 py-3.5 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:-translate-y-px">
                  Start exploring <ChevronRight size={16} />
              </span>
          </div>
      </main>
      <FooterComp />
    </div>
  );

  const renderPrivacy = () => (
    <div className={`page ${activePage === 'privacy' ? 'block' : 'hidden'} min-h-screen flex flex-col`}>
      <main className="w-full max-w-[680px] mx-auto px-6 pt-[7rem] pb-20 flex-1 animate-fadeIn">
          <header className="text-center mb-12">
              <h1 className="font-crimson text-[clamp(2.25rem,5vw,3rem)] font-medium mb-4 tracking-[-0.02em] leading-tight">Privacy Policy</h1>
              <div className="text-[13px] text-text-muted mb-4 uppercase tracking-[0.1em]">Last Updated: April 2026</div>
          </header>
          <div className="font-crimson text-lg leading-[1.75] text-text-primary">
              <p className="mb-6">At Simplly, your privacy is structurally guaranteed.</p>
              
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-accent mt-8 mb-3">Stateless Architecture</h3>
              <p className="mb-6">Simplly is built as a stateless application. We do not use cookies, user accounts, or databases. We do not store your search queries, IP address, browsing behavior, or the generated explanations.</p>
              
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-accent mt-8 mb-3">Third-Party Processing</h3>
              <p className="mb-6">The topics you submit are transiently sent to Groq AI (our large language model provider) to generate the explanation. Groq AI does not use your data to train their models under our API agreement. We instantly discard the data once the result is rendered on your screen.</p>
              
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-accent mt-8 mb-3">Contact</h3>
              <p className="mb-6">If you have any questions regarding how your data is processed, feel free to reach out through our support links.</p>
          </div>
      </main>
      <FooterComp />
    </div>
  );

  const renderTerms = () => (
    <div className={`page ${activePage === 'terms' ? 'block' : 'hidden'} min-h-screen flex flex-col`}>
      <main className="w-full max-w-[680px] mx-auto px-6 pt-[7rem] pb-20 flex-1 animate-fadeIn">
          <header className="text-center mb-12">
              <h1 className="font-crimson text-[clamp(2.25rem,5vw,3rem)] font-medium mb-4 tracking-[-0.02em] leading-tight">Terms of Service</h1>
              <div className="text-[13px] text-text-muted mb-4 uppercase tracking-[0.1em]">Last Updated: April 2026</div>
          </header>
          <div className="font-crimson text-lg leading-[1.75] text-text-primary">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-accent mt-8 mb-3">Educational Purpose</h3>
              <p className="mb-6">Simplly is an AI-powered educational framework designed to break down and simplify complex concepts. The platform is provided "as is", completely free of charge, for educational and personal use.</p>
              
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-accent mt-8 mb-3">No Guarantees of Accuracy</h3>
              <p className="mb-6">While our AI models strive for accuracy, they can occasionally hallucinate or output inaccurate facts. We do not provide any guarantees, representations, or warranties regarding the absolute correctness of the generated explanations. Simplly should not be used in critical scenarios (like medical or legal advice) without verifying facts.</p>
              
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-accent mt-8 mb-3">Usage Policy</h3>
              <p className="mb-6">By using Simplly, you agree not to submit abusive, illegal, or harmful queries to our systems. Doing so violates our terms and undermines the service for everyone else.</p>
          </div>
      </main>
      <FooterComp />
    </div>
  );

  return (
    <>
       <Nav />
       {renderHome()}
       {renderAbout()}
       {renderBlog()}
       {renderArticle()}
       {renderPrivacy()}
       {renderTerms()}
    </>
  );
}
