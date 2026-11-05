'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Play, 
  BookOpen, 
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { TopicStat } from '@/lib/exportUtils';

export interface ChapterGroup {
  subject: string;
  subjectName: string;
  chapterSlug: string;
  chapterName: string;
  totalQuestions: number;
  byYear: { [year: string]: number };
  fiveYearAvg: number;
  papersAppeared: number;
  paperCoveragePct: number;
  topicsCount: number;
  topics: TopicStat[];
}

interface SubjectDashboardProps {
  chapters: ChapterGroup[];
  selectedSubject: string;
  onSelectSubject: (sub: string) => void;
  onJumpToTopic: (topic: string, chapterSlug: string, subject: string) => void;
}

export function SubjectDashboard({
  chapters,
  selectedSubject,
  onSelectSubject,
  onJumpToTopic
}: SubjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'total' | 'avg' | 'coverage' | 'name'>('total');
  const [expandedChapters, setExpandedChapters] = useState<{ [slug: string]: boolean }>({});

  // Filter chapters by subject
  const subjectChapters = useMemo(() => {
    return chapters.filter(c => c.subject.toLowerCase() === selectedSubject.toLowerCase());
  }, [chapters, selectedSubject]);

  // Apply search, filters and sort
  const filteredChapters = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return subjectChapters
      .map(ch => {
        // Filter topics within chapter
        const matchingTopics = ch.topics.filter(t => {
          // Search text
          const matchesSearch =
            !q ||
            t.topicName.toLowerCase().includes(q) ||
            ch.chapterName.toLowerCase().includes(q);

          // Priority filter
          const matchesPriority =
            priorityFilter === 'all' ||
            t.priority.toLowerCase().replace(/\s+/g, '') === priorityFilter.toLowerCase().replace(/\s+/g, '');

          // Year filter (has questions in selected year)
          let matchesYear = true;
          if (yearFilter !== 'all') {
            const yr = parseInt(yearFilter, 10);
            const countInYear = (t as any)[`y${yr}`] || 0;
            matchesYear = countInYear > 0;
          }

          return matchesSearch && matchesPriority && matchesYear;
        });

        return {
          ...ch,
          matchingTopics
        };
      })
      .filter(ch => ch.matchingTopics.length > 0)
      .sort((a, b) => {
        if (sortBy === 'total') return b.totalQuestions - a.totalQuestions;
        if (sortBy === 'avg') return b.fiveYearAvg - a.fiveYearAvg;
        if (sortBy === 'coverage') return b.paperCoveragePct - a.paperCoveragePct;
        if (sortBy === 'name') return a.chapterName.localeCompare(b.chapterName);
        return 0;
      });
  }, [subjectChapters, searchTerm, priorityFilter, yearFilter, sortBy]);

  // Toggle chapter expansion
  const toggleChapter = (slug: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  const expandAll = () => {
    const all: { [slug: string]: boolean } = {};
    for (const c of filteredChapters) {
      all[c.chapterSlug] = true;
    }
    setExpandedChapters(all);
  };

  const collapseAll = () => {
    setExpandedChapters({});
  };

  // Helper for priority badge styling
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
      {/* Subject Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Chapter & Topic Frequency Analysis</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Empirical question counts across 83 MHT CET PCM shifts (2022–2026).
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          {['physics', 'chemistry', 'mathematics'].map(sub => (
            <button
              key={sub}
              onClick={() => onSelectSubject(sub)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors capitalize ${
                selectedSubject === sub
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Search, Filter and Sort Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search chapter or specific topic..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="veryhigh">Very High Priority</option>
              <option value="high">High Priority</option>
              <option value="moderate">Moderate Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="total">Sort: Total Questions (High to Low)</option>
              <option value="avg">Sort: 5-Year Average (High to Low)</option>
              <option value="coverage">Sort: Paper Coverage % (High to Low)</option>
              <option value="name">Sort: Chapter Name (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Action strip & expand/collapse */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-800">{filteredChapters.length}</strong> chapters with{' '}
              <strong className="text-slate-800">
                {filteredChapters.reduce((acc, c) => acc + c.matchingTopics.length, 0)}
              </strong>{' '}
              topics
            </span>
            {searchTerm && (
              <span className="text-indigo-600 font-medium">· matching &quot;{searchTerm}&quot;</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Accordion List */}
      <div className="space-y-4">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No chapters match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try resetting your search query or loosening the priority filters to see all available chapters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setPriorityFilter('all');
                setYearFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredChapters.map(chapter => {
            const isExpanded = expandedChapters[chapter.chapterSlug] ?? true;

            return (
              <div
                key={chapter.chapterSlug}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Chapter Header Card */}
                <div
                  onClick={() => toggleChapter(chapter.chapterSlug)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span>{chapter.chapterName}</span>
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{chapter.matchingTopics.length} Subtopics</span>
                        <span aria-hidden="true">·</span>
                        <span>{chapter.paperCoveragePct}% Paper Coverage</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-right shrink-0">
                    <div>
                      <div className="text-lg font-bold text-slate-900 tabular-nums">
                        {chapter.totalQuestions}
                      </div>
                      <div className="text-xs text-slate-500">Total Questions</div>
                    </div>

                    <div>
                      <div className="text-lg font-bold text-indigo-600 tabular-nums">
                        {chapter.fiveYearAvg}
                      </div>
                      <div className="text-xs text-slate-500">Avg / Paper</div>
                    </div>
                  </div>
                </div>

                {/* Topics Table (Rendered when expanded) */}
                {isExpanded && (
                  <div className="border-t border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200">
                          <th className="py-3 px-4 min-w-[240px]">Topic / Subtopic</th>
                          <th className="py-3 px-2 text-center w-12" title="2022 (12 papers)">&apos;22</th>
                          <th className="py-3 px-2 text-center w-12" title="2023 (12 papers)">&apos;23</th>
                          <th className="py-3 px-2 text-center w-12" title="2024 (16 papers)">&apos;24</th>
                          <th className="py-3 px-2 text-center w-12" title="2025 (16 papers)">&apos;25</th>
                          <th className="py-3 px-2 text-center w-12" title="2026 (27 papers)">&apos;26</th>
                          <th className="py-3 px-3 text-center min-w-[70px]">Total</th>
                          <th className="py-3 px-3 text-center min-w-[90px]">Avg/Paper</th>
                          <th className="py-3 px-3 text-center min-w-[90px]">Coverage %</th>
                          <th className="py-3 px-3 text-center min-w-[100px]">Priority</th>
                          <th className="py-3 px-4 text-right min-w-[140px]">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {chapter.matchingTopics.map(topic => (
                          <tr
                            key={topic.topicName}
                            className="hover:bg-slate-50/70 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium text-slate-900">
                              <div>{topic.topicName}</div>
                              <div className="text-xs text-slate-500 font-normal">
                                {topic.subjectWeightagePct}% of subject questions
                              </div>
                            </td>

                            <td className="py-3 px-2 text-center tabular-nums text-slate-600 font-medium">
                              {topic.y2022}
                            </td>
                            <td className="py-3 px-2 text-center tabular-nums text-slate-600 font-medium">
                              {topic.y2023}
                            </td>
                            <td className="py-3 px-2 text-center tabular-nums text-slate-600 font-medium">
                              {topic.y2024}
                            </td>
                            <td className="py-3 px-2 text-center tabular-nums text-slate-600 font-medium">
                              {topic.y2025}
                            </td>
                            <td className="py-3 px-2 text-center tabular-nums text-slate-600 font-medium">
                              {topic.y2026}
                            </td>

                            <td className="py-3 px-3 text-center font-bold text-slate-900 tabular-nums">
                              {topic.totalQuestions}
                            </td>

                            <td className="py-3 px-3 text-center tabular-nums text-slate-700 font-semibold">
                              {topic.fiveYearAvg.toFixed(2)}
                            </td>

                            <td className="py-3 px-3 text-center tabular-nums text-slate-600">
                              {topic.paperCoveragePct}%
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border ${getPriorityStyle(
                                  topic.priority
                                )}`}
                              >
                                {topic.priority}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() =>
                                  onJumpToTopic(topic.topicName, chapter.chapterSlug, chapter.subject)
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-2xs whitespace-nowrap"
                                title={`Practice all ${topic.totalQuestions} real MHT CET PYQs for ${topic.topicName}`}
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
