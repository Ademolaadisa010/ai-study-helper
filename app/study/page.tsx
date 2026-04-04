"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────
type Mode = "summary" | "questions" | "explain";
type GradeResult = "correct" | "partial" | "incorrect" | null;

interface Question {
  question: string;
  answer: string;
}

interface QuestionState {
  userAnswer: string;
  grade: GradeResult;
  feedback: string;
  loading: boolean;
  submitted: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const SAMPLE_NOTE = `The mitochondria is the powerhouse of the cell. It produces ATP through a process called cellular respiration. This involves three main stages: glycolysis (in the cytoplasm), the Krebs cycle (in the mitochondrial matrix), and the electron transport chain (on the inner mitochondrial membrane). Oxygen is required for aerobic respiration, producing 36–38 ATP molecules per glucose molecule.

Mitochondria have a double-membrane structure: an outer membrane and a highly folded inner membrane called cristae, which increases the surface area for ATP production. They also contain their own DNA and ribosomes, supporting the endosymbiotic theory that they evolved from ancient bacteria.

Key functions beyond energy production include: calcium signalling, heat production, and apoptosis (programmed cell death). Without mitochondria, complex life as we know it would not be possible.`;

const MODES: { key: Mode; icon: string; label: string; shortDesc: string; longDesc: string; color: string; bg: string }[] = [
  {
    key: "summary",
    icon: "📋",
    label: "Summarize Notes",
    shortDesc: "Get key points fast",
    longDesc: "AI reads your notes and pulls out the most important ideas in a clear, concise bullet-point summary. Perfect for quick review before an exam.",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
  },
  {
    key: "questions",
    icon: "❓",
    label: "Practice Questions",
    shortDesc: "Test your knowledge",
    longDesc: "AI generates 3 practice questions from your notes. Type your answers and get instant grading with detailed feedback — like having a personal tutor.",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    key: "explain",
    icon: "💡",
    label: "Explain Simply",
    shortDesc: "Plain-language breakdown",
    longDesc: "AI rewrites complex notes in simple, everyday language using analogies and examples — ideal when you're confused and need a fresh perspective.",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseQuestions(text: string): Question[] {
  const parts = text.split(/---ANSWERS---|---answers---/);
  const qPart = parts[0] || "";
  const aPart = parts[1] || "";
  const qLines = qPart.split("\n").filter((l) => /^Q\d+[:.]/i.test(l.trim()));
  const aLines = aPart.split("\n").filter((l) => /^A\d+[:.]/i.test(l.trim()));
  return qLines.map((q, i) => ({
    question: q.replace(/^Q\d+[:.]\s*/i, "").trim(),
    answer: (aLines[i] || "").replace(/^A\d+[:.]\s*/i, "").trim(),
  }));
}

// ── API call ──────────────────────────────────────────────────────────────────
async function callClaude(prompt: string): Promise<string> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GhIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
}

function TipBadge({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <span className="text-amber-500 text-base mt-0.5">💡</span>
      <p className="text-amber-800 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function SummaryResult({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const isBullet = line.startsWith("•") || line.startsWith("-") || line.startsWith("*");
        const clean = line.replace(/^[•\-*]\s*/, "");
        return isBullet ? (
          <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</span>
            <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: clean.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
          </div>
        ) : (
          <p key={i} className="text-sm text-slate-700 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
        );
      })}
    </div>
  );
}

function ExplainResult({ text }: { text: string }) {
  const paragraphs = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return (
    <div className="space-y-3">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-sm text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
      ))}
    </div>
  );
}

function QuestionCard({
  q,
  index,
  state,
  onChange,
  onSubmit,
}: {
  q: Question;
  index: number;
  state: QuestionState;
  onChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const gradeStyles: Record<string, string> = {
    correct: "bg-green-50 border-green-300 text-green-800",
    partial: "bg-amber-50 border-amber-300 text-amber-800",
    incorrect: "bg-red-50 border-red-300 text-red-800",
  };
  const gradeLabel: Record<string, string> = {
    correct: "✅ Correct!",
    partial: "🟡 Partially Correct",
    incorrect: "❌ Needs Improvement",
  };

  return (
    <div className={`border rounded-2xl p-5 transition-all duration-300 ${state.submitted && state.grade === "correct" ? "border-green-200 bg-green-50/30" : "border-slate-200 bg-white"}`}>
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {index + 1}
        </div>
        <p className="text-slate-800 font-semibold text-sm leading-relaxed pt-1">{q.question}</p>
      </div>

      {/* Answer input */}
      {!state.submitted || state.grade !== "correct" ? (
        <>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Answer</label>
          <textarea
            value={state.userAnswer}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here — be as detailed as you like…"
            rows={3}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all bg-slate-50 hover:bg-white"
            disabled={state.loading}
          />
          <button
            onClick={onSubmit}
            disabled={state.loading || !state.userAnswer.trim()}
            className="mt-3 flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
          >
            {state.loading ? <><Spinner /> Grading…</> : "Check my answer →"}
          </button>
        </>
      ) : null}

      {/* Feedback */}
      {state.submitted && state.grade && state.feedback && (
        <div className={`mt-3 border rounded-xl px-4 py-3 ${gradeStyles[state.grade]}`}>
          <p className="font-bold text-sm mb-1">{gradeLabel[state.grade]}</p>
          <p className="text-sm leading-relaxed">{state.feedback}</p>
          {state.grade !== "correct" && (
            <button
              onClick={() => onChange("")}
              className="mt-2 text-xs font-semibold underline underline-offset-2 opacity-70 hover:opacity-100"
            >
              Try again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StudyPage() {
  const [notes, setNotes] = useState("");
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Results
  const [summaryText, setSummaryText] = useState("");
  const [explainText, setExplainText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qStates, setQStates] = useState<QuestionState[]>([]);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setCharCount(notes.length); }, [notes]);

  const loadSample = () => setNotes(SAMPLE_NOTE);
  const clearAll = () => {
    setNotes("");
    setSummaryText("");
    setExplainText("");
    setQuestions([]);
    setQStates([]);
    setActiveMode(null);
    setError("");
  };

  const scrollToResult = () => {
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const generate = async (mode: Mode) => {
    if (!notes.trim()) {
      setError("Please paste some notes first — or click 'Try Sample Note' to get started!");
      return;
    }
    if (notes.trim().length < 50) {
      setError("Your notes look too short. Paste at least a paragraph so the AI has enough to work with.");
      return;
    }
    setError("");
    setLoading(true);
    setActiveMode(mode);
    setSummaryText("");
    setExplainText("");
    setQuestions([]);
    setQStates([]);
    scrollToResult();

    const prompts: Record<Mode, string> = {
      summary: `You are a helpful study assistant. Read the following notes and produce a clear, concise summary.\n\nFormat your response as:\n- A one-sentence overview at the top\n- Then 5-8 bullet points (use • symbol) covering the key concepts\n- Bold (**like this**) the most important terms\n\nNotes:\n\n${notes}`,
      questions: `You are a study assistant. Generate exactly 3 practice questions from the notes below.\n\nFormat EXACTLY like this (no deviation):\nQ1: [question]\nQ2: [question]\nQ3: [question]\n\n---ANSWERS---\nA1: [detailed answer, 2-3 sentences]\nA2: [detailed answer, 2-3 sentences]\nA3: [detailed answer, 2-3 sentences]\n\nNotes:\n\n${notes}`,
      explain: `You are a friendly study assistant. Explain the following notes in simple, plain language as if talking to a curious 15-year-old who is encountering this topic for the first time.\n\n- Use everyday analogies and real-world examples\n- Break it into short paragraphs (3-5 sentences each)\n- Avoid jargon — define any technical terms you must use\n- Keep it engaging and friendly\n\nNotes:\n\n${notes}`,
    };

    try {
      const text = await callClaude(prompts[mode]);
      if (mode === "summary") setSummaryText(text);
      else if (mode === "explain") setExplainText(text);
      else {
        const parsed = parseQuestions(text);
        setQuestions(parsed);
        setQStates(parsed.map(() => ({ userAnswer: "", grade: null, feedback: "", loading: false, submitted: false })));
      }
    } catch {
      setError("Something went wrong connecting to the AI. Please try again.");
      setActiveMode(null);
    } finally {
      setLoading(false);
    }
  };

  const gradeAnswer = async (idx: number) => {
    const q = questions[idx];
    const userAnswer = qStates[idx].userAnswer;
    if (!userAnswer.trim()) return;

    setQStates((prev) => prev.map((s, i) => i === idx ? { ...s, loading: true } : s));

    try {
      const prompt = `Grade this student answer. Be encouraging and educational.\n\nQuestion: ${q.question}\nExpected answer: ${q.answer}\nStudent's answer: ${userAnswer}\n\nRespond with EXACTLY this format:\nVERDICT: [CORRECT / PARTIAL / INCORRECT]\nFEEDBACK: [2-3 sentences of specific, constructive feedback. If wrong, explain why and give a hint.]`;
      const text = await callClaude(prompt);

      const verdictMatch = text.match(/VERDICT:\s*(CORRECT|PARTIAL|INCORRECT)/i);
      const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i);
      const grade = verdictMatch
        ? (verdictMatch[1].toLowerCase() as GradeResult)
        : text.toUpperCase().includes("CORRECT") ? "correct" : text.toUpperCase().includes("PARTIAL") ? "partial" : "incorrect";
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : text.replace(/VERDICT:.*\n?/i, "").replace(/FEEDBACK:/i, "").trim();

      setQStates((prev) => prev.map((s, i) => i === idx ? { ...s, grade, feedback, loading: false, submitted: true } : s));
    } catch {
      setQStates((prev) => prev.map((s, i) => i === idx ? { ...s, loading: false, feedback: "Could not grade. Please try again." } : s));
    }
  };

  const updateQAnswer = (idx: number, val: string) => {
    setQStates((prev) => prev.map((s, i) => i === idx ? { ...s, userAnswer: val, submitted: false, grade: null, feedback: "" } : s));
  };

  const hasResult = summaryText || explainText || questions.length > 0;
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 font-sans antialiased">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 select-none group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-300 transition-shadow">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                Study<span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Helper</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors hidden sm:block">
                ← Back to Home
              </Link>
              <span className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                AI Ready
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* ── Page header ── */}
        <div className="text-center mb-10" style={{ animation: "fadeUp 0.5s ease-out both" }}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Your AI Study{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              Session
            </span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Paste your notes below, choose what you need, and let AI do the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT: Input + Actions ── */}
          <div className="lg:col-span-2 space-y-5" style={{ animation: "fadeUp 0.55s ease-out 0.05s both" }}>

            {/* Step 1: Notes input */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
                <h2 className="font-bold text-slate-900 text-sm">Paste Your Notes</h2>
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your lecture notes, textbook content, or anything you want to study here…"
                rows={10}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all bg-slate-50 hover:bg-white leading-relaxed"
              />

              {/* Stats row */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{wordCount} words</span>
                  <span>{charCount} chars</span>
                  {charCount > 0 && charCount < 50 && <span className="text-amber-500 font-medium">⚠ Too short</span>}
                  {charCount >= 50 && <span className="text-green-500 font-medium">✓ Good length</span>}
                </div>
                <div className="flex items-center gap-2">
                  {notes && (
                    <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={loadSample}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ✦ Try sample note
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Step 2: Choose action */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                <h2 className="font-bold text-slate-900 text-sm">Choose What You Need</h2>
              </div>

              <div className="space-y-3">
                {MODES.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => generate(mode.key)}
                    disabled={loading}
                    className={`w-full text-left border rounded-xl p-4 transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none ${
                      activeMode === mode.key && !loading
                        ? `${mode.bg} shadow-md -translate-y-0.5`
                        : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0">{mode.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{mode.label}</span>
                          {loading && activeMode === mode.key && <Spinner />}
                          {activeMode === mode.key && !loading && hasResult && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Done ✓</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{mode.shortDesc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-2">
              <TipBadge text="Beginner tip: Click 'Try sample note' first to see how it works — then paste your own notes!" />
            </div>
          </div>

          {/* ── RIGHT: Info panel + Results ── */}
          <div className="lg:col-span-3 space-y-5" style={{ animation: "fadeUp 0.55s ease-out 0.1s both" }}>

            {/* What each feature does — shown before results */}
            {!hasResult && !loading && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 text-base mb-4">What can this app do?</h3>
                <div className="space-y-4">
                  {MODES.map((mode) => (
                    <div key={mode.key} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-2xl shrink-0">{mode.icon}</div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm mb-1">{mode.label}</p>
                        <p className="text-slate-500 text-sm leading-relaxed">{mode.longDesc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center">
                    No login required · Your notes are never stored · Powered by Claude AI
                  </p>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div ref={resultRef} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center animate-pulse">
                    <span className="text-white text-sm">✦</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">AI is working on it…</p>
                    <p className="text-xs text-slate-400">Usually takes 5–10 seconds</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[90, 75, 85, 60, 80].map((w, i) => (
                    <div
                      key={i}
                      className="h-4 bg-slate-100 rounded-full animate-pulse"
                      style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Summary result */}
            {!loading && summaryText && activeMode === "summary" && (
              <div ref={resultRef} className="bg-white border border-indigo-200 rounded-2xl p-6 shadow-sm" style={{ animation: "fadeUp 0.4s ease-out both" }}>
                <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-sm">✦</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Your Summary</p>
                      <p className="text-xs text-slate-400">Key points extracted from your notes</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">📋 Summary</span>
                </div>
                <SummaryResult text={summaryText} />
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Want to go deeper?</p>
                  <div className="flex gap-2">
                    <button onClick={() => generate("questions")} className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">❓ Make questions</button>
                    <button onClick={() => generate("explain")} className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">💡 Explain simply</button>
                  </div>
                </div>
              </div>
            )}

            {/* Explain result */}
            {!loading && explainText && activeMode === "explain" && (
              <div ref={resultRef} className="bg-white border border-purple-200 rounded-2xl p-6 shadow-sm" style={{ animation: "fadeUp 0.4s ease-out both" }}>
                <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-sm">💡</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Simple Explanation</p>
                      <p className="text-xs text-slate-400">Plain language — no jargon</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">💡 Explain</span>
                </div>
                <ExplainResult text={explainText} />
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Ready to test yourself?</p>
                  <div className="flex gap-2">
                    <button onClick={() => generate("summary")} className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">📋 Summarize</button>
                    <button onClick={() => generate("questions")} className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors">❓ Make questions</button>
                  </div>
                </div>
              </div>
            )}

            {/* Questions result */}
            {!loading && questions.length > 0 && activeMode === "questions" && (
              <div ref={resultRef} className="space-y-4" style={{ animation: "fadeUp 0.4s ease-out both" }}>
                <div className="bg-white border border-violet-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-sm">❓</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Practice Questions</p>
                        <p className="text-xs text-slate-400">{questions.length} questions from your notes</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">❓ Quiz</span>
                  </div>
                  <TipBadge text="Answer each question in your own words, then click 'Check my answer' for AI feedback. No peeking at your notes first!" />
                </div>

                {questions.map((q, i) => (
                  <QuestionCard
                    key={i}
                    q={q}
                    index={i}
                    state={qStates[i]}
                    onChange={(val) => updateQAnswer(i, val)}
                    onSubmit={() => gradeAnswer(i)}
                  />
                ))}

                {/* Progress summary */}
                {qStates.some((s) => s.submitted) && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="font-bold text-slate-900 text-sm mb-3">Your Progress</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {(["correct", "partial", "incorrect"] as GradeResult[]).map((grade) => {
                        const count = qStates.filter((s) => s.grade === grade).length;
                        const labels = { correct: { label: "Correct", color: "text-green-700", bg: "bg-green-50 border-green-200" }, partial: { label: "Partial", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" }, incorrect: { label: "Incorrect", color: "text-red-700", bg: "bg-red-50 border-red-200" } };
                        const l = labels[grade!];
                        return (
                          <div key={grade} className={`border rounded-xl p-3 ${l.bg}`}>
                            <p className={`text-xl font-bold ${l.color}`}>{count}</p>
                            <p className={`text-xs font-medium ${l.color}`}>{l.label}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => generate("questions")} className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-4 py-2 rounded-lg hover:bg-violet-100 transition-colors">
                        🔄 Generate new questions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}