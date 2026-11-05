'use client';

import React, { useState } from 'react';
import { Play, Sparkles, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';
import { TopicStat } from '@/lib/exportUtils';

interface Top20RankingsProps {
  top20: {
    physics: TopicStat[];
    chemistry: TopicStat[];
    mathematics: TopicStat[];
  };
  onJumpToTopic: (topic: string, chapterSlug: string, subject: string) => void;
}

export function Top20Rankings({ top20, onJumpToTopic }: Top20RankingsProps) {
  const [activeTab, setActiveTab] = useState<'physics' | 'chemistry' | 'mathematics'>('physics');

  const currentList = top20[activeTab] || [];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Very High':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Moderate':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Top 20 Most Important Subtopics</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Independently ranked for Physics, Chemistry, and Mathematics based on 83 shifts (2022–2026).
          </p>
        </div>

        {/* Subject switcher tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          {(['physics', 'chemistry', 'mathematics'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => setActiveTab(sub)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors capitalize ${
                activeTab === sub
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub} (Top 20)
            </button>
          ))}
        </div>
      </div>

      {/* Methodology note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed flex items-start gap-3">
        <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-800">Data-Driven Ranking Methodology:</strong> Rankings are strictly
          derived from historical question counts across all 83 shifts from 2022 through 2026.
          Ties are broken by paper coverage percentage and annual appearance consistency across the 5 years.
        </div>
      </div>

      {/* Top 20 Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-3.5 px-4 w-14 text-center">Rank</th>
                <th className="py-3.5 px-3 min-w-[140px]">Chapter</th>
                <th className="py-3.5 px-3 min-w-[220px]">High-Yield Subtopic</th>
                <th className="py-3.5 px-2 text-center w-12" title="2022 (12 papers)">&apos;22</th>
                <th className="py-3.5 px-2 text-center w-12" title="2023 (12 papers)">&apos;23</th>
                <th className="py-3.5 px-2 text-center w-12" title="2024 (16 papers)">&apos;24</th>
                <th className="py-3.5 px-2 text-center w-12" title="2025 (16 papers)">&apos;25</th>
                <th className="py-3.5 px-2 text-center w-12" title="2026 (27 papers)">&apos;26</th>
                <th className="py-3.5 px-3 text-center min-w-[70px]">Total</th>
                <th className="py-3.5 px-3 text-center min-w-[80px]">Avg/Paper</th>
                <th className="py-3.5 px-3 text-center min-w-[90px]">Coverage</th>
                <th className="py-3.5 px-3 text-center min-w-[95px]">Priority</th>
                <th className="py-3.5 px-4 min-w-[250px]">Analytical Strategic Reason</th>
                <th className="py-3.5 px-4 text-right min-w-[140px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentList.map((item, idx) => (
                <tr key={`${item.chapterSlug}-${item.topicName}`} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900 tabular-nums">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-900 font-extrabold'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-800'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.rank || idx + 1}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-medium text-slate-900">
                    {item.chapterName}
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-900">
                    {item.topicName}
                  </td>

                  <td className="py-3.5 px-2 text-center tabular-nums text-slate-600 font-medium">
                    {item.y2022}
                  </td>
                  <td className="py-3.5 px-2 text-center tabular-nums text-slate-600 font-medium">
                    {item.y2023}
                  </td>
                  <td className="py-3.5 px-2 text-center tabular-nums text-slate-600 font-medium">
                    {item.y2024}
                  </td>
                  <td className="py-3.5 px-2 text-center tabular-nums text-slate-600 font-medium">
                    {item.y2025}
                  </td>
                  <td className="py-3.5 px-2 text-center tabular-nums text-slate-600 font-medium">
                    {item.y2026}
                  </td>

                  <td className="py-3.5 px-3 text-center font-extrabold text-indigo-700 tabular-nums">
                    {item.totalQuestions}
                  </td>

                  <td className="py-3.5 px-3 text-center tabular-nums text-slate-800 font-semibold">
                    {item.fiveYearAvg.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-3 text-center tabular-nums text-slate-600">
                    {item.paperCoveragePct}%
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getPriorityStyle(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-600 leading-normal">
                    {item.reason}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onJumpToTopic(item.topicName, item.chapterSlug, item.subject)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>JUMP TO PYQs</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
