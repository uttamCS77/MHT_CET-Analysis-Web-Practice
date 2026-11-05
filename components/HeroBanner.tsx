'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, FileSpreadsheet, Sparkles, Target, Zap } from 'lucide-react';

interface HeroBannerProps {
  totalQuestions: number;
  totalPapers: number;
  totalChapters: number;
  totalTopics: number;
  onExploreTop20: () => void;
  onOpenExport: () => void;
}

export function HeroBanner({
  totalQuestions,
  totalPapers,
  totalChapters,
  totalTopics,
  onExploreTop20,
  onOpenExport
}: HeroBannerProps) {
  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-slate-200 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase mb-3">
            <span>Official 5-Year Empirical Study</span>
            <span aria-hidden="true">·</span>
            <span>2022 – 2026 Shift-Wise Coverage</span>
            <span aria-hidden="true">·</span>
            <span>PCM Engineering Stream</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
            MHT CET 2022–2026 Complete PYQ Frequency Analysis & Smart Preparation
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            A research-grade analysis of every single shift from 2022 to 2026. Discover
            chapter-to-subtopic question frequencies, annual shift averages, and jump directly into
            interactive practice quizzes containing real previous-year questions.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onExploreTop20}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore Top 20 High-Yield Subtopics</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenExport}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg border border-slate-300 shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Download Excel & PDF Reports</span>
            </button>
          </div>
        </div>

        {/* 5-Metric Stat Strip with Tabular Numerals */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-8 border-t border-slate-200">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Exam Shifts Scanned</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalPapers}
            </div>
            <div className="mt-1 text-xs text-slate-500">100% Papers Verified (0 Missing)</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Questions Analyzed</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-indigo-600 tabular-nums">
              {totalQuestions.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500">Physics, Chem & Math</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Classified Chapters</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalChapters}
            </div>
            <div className="mt-1 text-xs text-slate-500">Class 12 (80%) + Class 11 (20%)</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Subtopics Evaluated</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
              {totalTopics}
            </div>
            <div className="mt-1 text-xs text-slate-500">Ranked by 5-Yr Shift Density</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Interactive PYQ Quizzes</div>
            <div className="mt-1 text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums">
              1-Click
            </div>
            <div className="mt-1 text-xs text-slate-500">Instant Jump to Any Topic</div>
          </div>
        </div>
      </div>
    </section>
  );
}
