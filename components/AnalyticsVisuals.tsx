'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, ShieldAlert } from 'lucide-react';
import { TopicStat } from '@/lib/exportUtils';
import { ChapterGroup } from './SubjectDashboard';

interface AnalyticsVisualsProps {
  chapters: ChapterGroup[];
  allTopics: TopicStat[];
  onJumpToTopic: (topic: string, chapterSlug: string, subject: string) => void;
}

export function AnalyticsVisuals({ chapters, allTopics, onJumpToTopic }: AnalyticsVisualsProps) {
  const [selectedSubj, setSelectedSubj] = useState<'all' | 'physics' | 'chemistry' | 'mathematics'>('all');

  // Filter topics
  const topics = selectedSubj === 'all' ? allTopics : allTopics.filter(t => t.subject === selectedSubj);

  // Top 8 topics by frequency
  const topTopics = [...topics].sort((a, b) => b.totalQuestions - a.totalQuestions).slice(0, 8);
  const maxTopCount = topTopics[0]?.totalQuestions || 1;

  // Year-wise trend
  const yearDistribution = [
    { year: '2022', count: topics.reduce((acc, t) => acc + t.y2022, 0), papers: 12 },
    { year: '2023', count: topics.reduce((acc, t) => acc + t.y2023, 0), papers: 12 },
    { year: '2024', count: topics.reduce((acc, t) => acc + t.y2024, 0), papers: 16 },
    { year: '2025', count: topics.reduce((acc, t) => acc + t.y2025, 0), papers: 16 },
    { year: '2026', count: topics.reduce((acc, t) => acc + t.y2026, 0), papers: 27 }
  ];
  const maxYearCount = Math.max(...yearDistribution.map(y => y.count), 1);

  // Priority breakdown
  const priorityCounts = {
    'Very High': topics.filter(t => t.priority === 'Very High').length,
    'High': topics.filter(t => t.priority === 'High').length,
    'Moderate': topics.filter(t => t.priority === 'Moderate').length,
    'Low': topics.filter(t => t.priority === 'Low').length
  };
  const totalTopicsCount = topics.length || 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Visual Empirical Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical comparisons and 5-year longitudinal question trends.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          {(['all', 'physics', 'chemistry', 'mathematics'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubj(s)}
              className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                selectedSubj === s
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s === 'all' ? 'All Subjects' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Chart: Top 8 Subtopics in Scope */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Highest-Yield Subtopics</span>
            <span className="text-[11px] text-slate-400 font-normal">5-Year Occurrences</span>
          </h4>

          <div className="space-y-3.5">
            {topTopics.map((topic, i) => {
              const pct = (topic.totalQuestions / maxTopCount) * 100;

              return (
                <div key={topic.topicName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      onClick={() => onJumpToTopic(topic.topicName, topic.chapterSlug, topic.subject)}
                      className="font-semibold text-slate-800 hover:text-indigo-600 cursor-pointer truncate max-w-[280px]"
                      title={`${topic.topicName} (${topic.chapterName})`}
                    >
                      {i + 1}. {topic.topicName}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {topic.totalQuestions} Qs{' '}
                      <span className="text-[11px] text-slate-400 font-normal">
                        ({topic.fiveYearAvg} / shift)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        topic.subject === 'physics'
                          ? 'bg-sky-500'
                          : topic.subject === 'chemistry'
                          ? 'bg-teal-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chart: Year-to-Year Shift Density & Priority Distribution */}
        <div className="space-y-6">
          {/* Year-by-year Trend */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Annual Question Distribution (2022–2026)</span>
              <span className="text-[11px] text-slate-400 font-normal">Indexed by Papers</span>
            </h4>

            <div className="grid grid-cols-5 gap-2 text-center items-end h-36 pt-4 pb-2">
              {yearDistribution.map(y => {
                const barHeight = Math.max(12, (y.count / maxYearCount) * 100);
                const avgPerShift = (y.count / y.papers).toFixed(1);

                return (
                  <div key={y.year} className="flex flex-col items-center justify-end h-full group">
                    <div className="text-[11px] font-bold text-slate-700 tabular-nums mb-1">
                      {y.count}
                    </div>
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                      <div
                        className="w-full bg-slate-800 group-hover:bg-indigo-600 rounded-t-sm transition-all"
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-2">{y.year}</div>
                    <div className="text-[10px] text-slate-400 tabular-nums">
                      {y.papers} papers
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Tiers */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Subtopic Priority Classification Breakdown
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                <div className="text-lg font-bold text-rose-700 tabular-nums">
                  {priorityCounts['Very High']}
                </div>
                <div className="text-[11px] text-rose-800 font-medium">Very High</div>
                <div className="text-[10px] text-rose-600 mt-0.5">≥0.8 Qs/paper</div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                <div className="text-lg font-bold text-amber-700 tabular-nums">
                  {priorityCounts['High']}
                </div>
                <div className="text-[11px] text-amber-800 font-medium">High</div>
                <div className="text-[10px] text-amber-600 mt-0.5">≥0.45 Qs/paper</div>
              </div>

              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                <div className="text-lg font-bold text-sky-700 tabular-nums">
                  {priorityCounts['Moderate']}
                </div>
                <div className="text-[11px] text-sky-800 font-medium">Moderate</div>
                <div className="text-[10px] text-sky-600 mt-0.5">≥0.2 Qs/paper</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-lg font-bold text-slate-700 tabular-nums">
                  {priorityCounts['Low']}
                </div>
                <div className="text-[11px] text-slate-700 font-medium">Low</div>
                <div className="text-[10px] text-slate-500 mt-0.5">&lt;0.2 Qs/paper</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
