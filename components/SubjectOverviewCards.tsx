'use client';

import React from 'react';
import { ArrowRight, BookOpen, Atom, FlaskConical, Calculator, Flame } from 'lucide-react';

interface SubjectCardInfo {
  subject: string;
  name: string;
  totalQuestions: number;
  totalChapters: number;
  topChapter: string;
  topChapterCount: number;
  highestYieldTopic: string;
  avgPerPaper: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    button: string;
  };
}

interface SubjectOverviewCardsProps {
  onSelectSubject: (subject: string) => void;
  onJumpToTopic: (topic: string, chapterSlug: string, subject: string) => void;
}

export function SubjectOverviewCards({ onSelectSubject, onJumpToTopic }: SubjectOverviewCardsProps) {
  const subjects: SubjectCardInfo[] = [
    {
      subject: 'physics',
      name: 'Physics',
      totalQuestions: 4138,
      totalChapters: 28,
      topChapter: 'Heat & Thermodynamics',
      topChapterCount: 487,
      highestYieldTopic: "Young's Double Slit Experiment (YDSE)",
      avgPerPaper: '49.85',
      colorScheme: {
        bg: 'bg-sky-50/50',
        border: 'border-sky-200',
        text: 'text-sky-700',
        badgeBg: 'bg-sky-100 text-sky-800',
        button: 'bg-sky-700 hover:bg-sky-800 text-white'
      }
    },
    {
      subject: 'chemistry',
      name: 'Chemistry',
      totalQuestions: 4137,
      totalChapters: 34,
      topChapter: 'Solid State & Liquid Solution',
      topChapterCount: 492,
      highestYieldTopic: 'Unit Cell Calculations & Density',
      avgPerPaper: '49.84',
      colorScheme: {
        bg: 'bg-teal-50/50',
        border: 'border-teal-200',
        text: 'text-teal-700',
        badgeBg: 'bg-teal-100 text-teal-800',
        button: 'bg-teal-700 hover:bg-teal-800 text-white'
      }
    },
    {
      subject: 'mathematics',
      name: 'Mathematics',
      totalQuestions: 4147,
      totalChapters: 29,
      topChapter: 'Vectors & 3D Geometry',
      topChapterCount: 778,
      highestYieldTopic: 'Dot Product & Cross Product of Vectors',
      avgPerPaper: '49.96',
      colorScheme: {
        bg: 'bg-indigo-50/50',
        border: 'border-indigo-200',
        text: 'text-indigo-700',
        badgeBg: 'bg-indigo-100 text-indigo-800',
        button: 'bg-indigo-700 hover:bg-indigo-800 text-white'
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {subjects.map(s => (
        <div
          key={s.subject}
          className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
        >
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${s.colorScheme.bg} border ${s.colorScheme.border}`}>
                  {s.subject === 'physics' && <Atom className="w-5 h-5 text-sky-600" />}
                  {s.subject === 'chemistry' && <FlaskConical className="w-5 h-5 text-teal-600" />}
                  {s.subject === 'mathematics' && <Calculator className="w-5 h-5 text-indigo-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{s.name}</h3>
                  <div className="text-xs text-slate-500">{s.totalChapters} Analyzed Chapters</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-slate-900 tabular-nums">
                  {s.totalQuestions.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">PYQs Scanned</div>
              </div>
            </div>

            <div className="mt-5 space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Top Chapter:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {s.topChapter} <span className="text-slate-400 font-normal tabular-nums">({s.topChapterCount} Qs)</span>
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Highest Yield Topic:</span>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[210px]" title={s.highestYieldTopic}>
                  {s.highestYieldTopic}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Shift Average:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {s.avgPerPaper} Qs / Paper
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onSelectSubject(s.subject)}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>View Chapters & Topics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectSubject(s.subject)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${s.colorScheme.button} transition-colors whitespace-nowrap`}
            >
              Full Analysis
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
