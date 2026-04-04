"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type DemoMode = "summary" | "quiz" | "explain";
interface DemoContent { label: string; jsx: React.ReactNode; }

const SAMPLE_NOTE = `The mitochondria is the powerhouse of the cell. It produces ATP through a process called cellular respiration. This involves three main stages: glycolysis (in the cytoplasm), the Krebs cycle (in the mitochondrial matrix), and the electron transport chain (on the inner mitochondrial membrane). Oxygen is required for aerobic respiration, producing 36–38 ATP molecules per glucose molecule.`;

// 🔧 Replace these before submitting
const GITHUB_URL = "https://github.com/ademolaadisa010/ai-study-helper";
const APP_URL    = "/study";

// ── Scroll-reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const DEMO: Record<DemoMode, DemoContent> = {
  summary: {
    label: "AI Summary",
    jsx: (
      <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
        <p><strong>Mitochondria</strong> = cell's energy factory</p>
        <p className="font-semibold mt-2">🔑 Key Points:</p>
        <ul className="space-y-1 ml-3">
          <li>• Produces <strong>ATP</strong> via cellular respiration</li>
          <li>• 3 stages: Glycolysis → Krebs Cycle → Electron Transport Chain</li>
          <li>• Requires oxygen (aerobic)</li>
          <li>• Yields <strong>36–38 ATP</strong> per glucose</li>
        </ul>
      </div>
    ),
  },
  quiz: {
    label: "Practice Question",
    jsx: (
      <div className="text-sm space-y-3">
        <p className="font-semibold text-slate-800">Sample question:</p>
        <p className="text-slate-700">What is the primary function of the mitochondria?</p>
        <div className="space-y-2">
          {["Protein synthesis", "ATP production", "DNA replication", "Waste removal"].map((opt, i) => (
            <div key={i} className={`rounded-lg px-3 py-2 border text-sm transition-colors ${i === 1 ? "bg-green-50 border-green-400 text-green-700 font-medium" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:bg-indigo-50"}`}>
              {["A)", "B)", "C)", "D)"][i]} {opt} {i === 1 && "✓"}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-1">The live app generates and grades your answers in real time.</p>
      </div>
    ),
  },
  explain: {
    label: "Simple Explanation",
    jsx: (
      <div className="text-sm space-y-3 text-slate-700 leading-relaxed">
        <p>🏭 <strong>Think of mitochondria like a tiny power plant inside your cell.</strong></p>
        <p>Just like a power plant burns fuel to make electricity, mitochondria "burn" sugar (glucose) to make energy your cell can use (called ATP).</p>
        <p>It needs oxygen to work — that's why you breathe! No oxygen = no energy production. 🫁</p>
      </div>
    ),
  },
};

// ── GitHub icon ───────────────────────────────────────────────────────────────
function GhIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
    </svg>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              Study<span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Helper</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {["Features", "How It Works", "Demo", "About"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors">{l}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 text-sm font-medium border border-slate-200 px-3 py-1.5 rounded-lg hover:border-indigo-300 transition-colors">
              <GhIcon /> GitHub
            </Link>
            <Link href={APP_URL} rel="noopener noreferrer"
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow hover:shadow-lg hover:shadow-indigo-200 transition-all hover:-translate-y-0.5">
              Try the App
            </Link>
          </div>

          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      <div className={`md:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 py-4 flex flex-col gap-4">
          {["Features", "How It Works", "Demo", "About"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-slate-700 font-medium text-sm" onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <hr className="border-slate-100" />
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 text-sm font-medium"><GhIcon />View on GitHub</a>
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold px-5 py-3 rounded-lg text-center">Try the App →</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [tick, setTick] = useState(true);
  useEffect(() => { const id = setInterval(() => setTick((t) => !t), 600); return () => clearInterval(id); }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-sky-50 pt-16 pb-16 md:pt-24 md:pb-24">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Hackathon badge */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6" style={{ animation: "fadeUp 0.5s ease-out both" }}>
              <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-semibold">
                🏆 Devpost Hackathon — Spec Driven Development
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Built with Claude AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-5" style={{ animation: "fadeUp 0.6s ease-out 0.1s both" }}>
              Turn Your Notes Into
              <br />
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">Smart Study Materials</span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">with AI</span>
            </h1>

            <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0" style={{ animation: "fadeUp 0.6s ease-out 0.2s both" }}>
              Paste your notes and instantly get a summary, practice questions, and simple explanations — no login, no setup.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-4" style={{ animation: "fadeUp 0.6s ease-out 0.3s both" }}>
              <Link href={APP_URL} rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all hover:-translate-y-1 text-base">
                🚀 Try the App
              </Link>
              <a href="#demo"
                className="bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all hover:shadow-md text-base">
                ✨ Try Sample Note
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-4 rounded-xl hover:bg-slate-800 transition-all text-base">
                <GhIcon /> GitHub
              </a>
            </div>

            <p className="text-slate-400 text-xs" style={{ animation: "fadeUp 0.6s ease-out 0.35s both" }}>
              No login required · Single-session · No data stored · Open source
            </p>
          </div>

          {/* Mock UI */}
          <div className="flex-1 w-full max-w-lg" style={{ animation: "floatY 3s ease-in-out infinite" }}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-indigo-100 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="w-3 h-3 rounded-full bg-red-400" /><span className="w-3 h-3 rounded-full bg-yellow-400" /><span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-slate-400 text-xs font-medium">AI Study Helper</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Notes</span>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">Paste here</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-600 leading-relaxed">
                  Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose...
                  <span className={`text-indigo-500 font-bold transition-opacity duration-100 ${tick ? "opacity-100" : "opacity-0"}`}>|</span>
                </div>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {["📝 Summarize", "❓ Quiz Me", "💡 Explain"].map((l, i) => (
                  <button key={l} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${i === 0 ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>{l}</button>
                ))}
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white text-xs">✦</span></div>
                  <span className="text-xs font-semibold text-indigo-700">AI Summary</span>
                  <span className="ml-auto text-xs text-green-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Ready</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed"><strong>Photosynthesis</strong> converts sunlight + CO₂ + H₂O → glucose + O₂. Occurs in <strong>chloroplasts</strong>. Key stages: Light reactions and Calvin cycle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes blob { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(20px,-20px) scale(1.05); } 66% { transform:translate(-15px,15px) scale(0.97); } }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
}

// ── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  const cards = [
    { emoji: "😵", bg: "bg-red-50", title: "Drowning in Long Notes", desc: "Struggling to understand pages of dense notes? It's hard to know what actually matters when everything looks important." },
    { emoji: "⏰", bg: "bg-orange-50", title: "Wasting Time Rereading", desc: "Reading the same paragraph five times without retaining anything? Passive rereading is one of the least effective study methods." },
    { emoji: "🎯", bg: "bg-yellow-50", title: "No Way to Test Yourself", desc: "Without practice questions, you don't discover what you don't know until it's exam day. Testing yourself is proven to work better." },
  ];

  return (
    <section id="problem" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3 block">The Problem</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Sound familiar?</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">These are the real challenges students face when studying from notes.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 h-full">
                <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mb-4 text-2xl`}>{c.emoji}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{c.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Solution ─────────────────────────────────────────────────────────────────
function Solution() {
  const items = [
    { emoji: "📋", title: "Summarize Notes Instantly", desc: "Paste any amount of text and get a clean, concise summary in seconds. Focus on what matters most." },
    { emoji: "❓", title: "Generate Practice Questions", desc: "AI creates questions from your notes. Answer them and get instant feedback to identify knowledge gaps." },
    { emoji: "💡", title: "Explain in Simple Terms", desc: "Any concept broken down into plain language. No jargon — just a clear explanation that makes sense." },
  ];

  return (
    <section id="solution" className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-3 block">The Solution</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">AI Study Helper has you covered</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Three core tools, one simple interface — built spec-first.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 100} className="text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl shadow-md hover:scale-110 transition-transform duration-300">{item.emoji}</div>
              <h3 className="font-bold text-slate-900 text-xl mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { emoji: "📝", title: "AI Summary", desc: "Condense any notes into key points. Paste and go — no configuration needed.", cta: "Try it now" },
    { emoji: "🧠", title: "Quiz Generator", desc: "AI generates practice questions directly from your notes.", cta: "Generate quiz" },
    { emoji: "🔍", title: "Simple Explanation", desc: "Get any concept explained clearly — no jargon, just plain language.", cta: "Explain this" },
    { emoji: "✅", title: "Answer Grading", desc: "Type your answer to a practice question and get instant AI feedback.", cta: "Try a question" },
  ];

  return (
    <section id="features" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3 block">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What the app actually does</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Four core features — all within the defined v1 scope.</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="group bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-200 hover:bg-white transition-all duration-300 h-full flex flex-col">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">{f.emoji}</div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{f.desc}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-indigo-600 text-xs font-semibold group-hover:underline">→ {f.cta}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: 1, emoji: "📋", title: "Paste Your Notes", desc: 'Copy and paste your lecture notes or textbook content into the input box. Or tap "Try Sample Note" to test instantly — no typing required.' },
    { n: 2, emoji: "⚙️", title: "Choose an Action", desc: "Select Summarize, Generate Questions, or Explain Simply. One click — no account, no setup." },
    { n: 3, emoji: "🎉", title: "Get Instant Results", desc: "AI processes your notes and returns results in seconds. For questions, type your answer and get graded on the spot." },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready in 3 simple steps</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">No login, no learning curve. Just paste your notes and go.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 150}>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200 mx-auto mb-6">{s.n}</div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Demo ─────────────────────────────────────────────────────────────────────
function Demo() {
  const [mode, setMode] = useState<DemoMode>("summary");
  const tabs: { key: DemoMode; label: string }[] = [
    { key: "summary", label: "📝 Summary" },
    { key: "quiz",    label: "❓ Quiz" },
    { key: "explain", label: "💡 Explain" },
  ];

  return (
    <section id="demo" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3 block">Live Demo</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">See it in action</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">A representative example of each mode. Switch tabs to explore.</p>
        </Reveal>

        <Reveal className="max-w-4xl mx-auto">
          {/* Sample note callout */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-2xl">📓</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-800 mb-0.5">Try the sample note in the real app</p>
              <p className="text-xs text-indigo-600">The app has a "Try Sample Note" button that pre-fills this biology note so you can test all three modes instantly — no typing required.</p>
            </div>
            <a href={APP_URL} target="_blank" rel="noopener noreferrer"
              className="shrink-0 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap">
              Open App →
            </a>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setMode(t.key)}
                className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 ${mode === t.key ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700"}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Input: Sample Note</p>
              <p className="text-sm text-slate-600 leading-relaxed">{SAMPLE_NOTE}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center"><span className="text-white text-xs">✦</span></div>
                <span className="text-sm font-semibold text-indigo-700">{DEMO[mode].label}</span>
                <span className="ml-auto text-xs text-green-600 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Generated</span>
              </div>
              <div key={mode} style={{ animation: "fadeUp 0.35s ease-out both" }}>{DEMO[mode].jsx}</div>
            </div>
          </div>
          <p className="text-center text-slate-400 text-xs mt-4">Outputs above are representative examples. The live app generates real AI responses.</p>
        </Reveal>
      </div>
    </section>
  );
}

// ── About / Built With ────────────────────────────────────────────────────────
function About() {
  const artifacts = [
    { emoji: "🗂️", title: "Scope Document", desc: "What's in v1, what's explicitly out of scope, and why." },
    { emoji: "📋", title: "PRD", desc: "User stories and acceptance criteria written before any code." },
    { emoji: "🏗️", title: "Technical Spec", desc: "Architecture decisions made upfront — Next.js, API routes, AI provider." },
    { emoji: "✅", title: "Build Checklist", desc: "Step-by-step tasks derived from the spec and tracked throughout the build." },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <span className="text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3 block">About This Project</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Built spec-first with Claude</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            This app was built for the Devpost <strong>Spec Driven Development</strong> hackathon — where the goal isn't competition,
            it's learning the habit of planning before building.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Reveal>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
              <h3 className="font-bold text-slate-900 text-lg mb-4">🛠️ The Process</h3>
              <ol className="space-y-3">
                {[
                  "Used the Devpost Claude Code plugin to plan with an AI learning partner",
                  "Defined scope: single-session, no auth, three core AI actions",
                  "Wrote user stories and acceptance criteria before touching any UI",
                  "Made architecture decisions upfront: Next.js, API routes, prompt design",
                  "Built feature-by-feature against the checklist, not vibes",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 h-full">
              <h3 className="font-bold text-slate-900 text-lg mb-4">💡 What I Learned</h3>
              <ul className="space-y-3">
                {[
                  { t: "Spec-driven development", d: "Planning before building produced cleaner code and a clearer scope." },
                  { t: "Flipped prompting", d: "Having the AI interview me surfaced requirements I'd have missed going the other way." },
                  { t: "Context management", d: "Keeping AI productive across sessions requires deliberate state in your prompts." },
                  { t: "Scope discipline", d: "Explicitly deciding what's out (file upload, auth, history) saved hours of scope creep." },
                ].map((item) => (
                  <li key={item.t} className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">{item.t}</span> — {item.d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Planning Artifacts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {artifacts.map((a) => (
              <div key={a.title} className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                <div className="text-2xl mb-2">{a.emoji}</div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{a.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="text-center">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors text-sm">
            <GhIcon />View Source Code &amp; Docs on GitHub
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-white/10 animate-pulse" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-white text-xs font-semibold">🏆 Devpost Hackathon Project</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">Ready to try it?</h2>
          <p className="text-indigo-200 text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
            Paste your own notes or use the sample note. No account required — results in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={APP_URL} rel="noopener noreferrer"
              className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all hover:shadow-lg hover:-translate-y-1 inline-block">
              🚀 Try the App
            </Link>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="bg-white/15 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 transition-all inline-flex items-center justify-center gap-2">
              <GhIcon />View on GitHub
            </a>
          </div>
          <p className="text-indigo-300 text-sm mt-5">No login required · No data stored · Open source</p>
        </Reveal>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <span className="font-bold text-white text-lg">Study<span className="text-indigo-400">Helper</span></span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[["Features","#features"],["How It Works","#how-it-works"],["Demo","#demo"],["About","#about"]].map(([l,h]) => (
              <a key={l} href={h} className="text-slate-400 text-sm hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <GhIcon />GitHub
          </a>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">Built for the Devpost Spec Driven Development Hackathon · 2025</p>
          <p className="text-slate-600 text-xs">No login · No data stored · Open source</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <Demo />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}