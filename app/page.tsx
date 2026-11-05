'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { SubjectOverviewCards } from '@/components/SubjectOverviewCards';
import { SubjectDashboard, ChapterGroup } from '@/components/SubjectDashboard';
import { Top20Rankings } from '@/components/Top20Rankings';
import { PaperManifestView } from '@/components/PaperManifestView';
import { QuizModal } from '@/components/QuizModal';
import { ExportModal } from '@/components/ExportModal';
import { AnalyticsVisuals } from '@/components/AnalyticsVisuals';
import { TopicStat, PaperRecord } from '@/lib/exportUtils';
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  FileSpreadsheet, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export default function Home() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [analytics, setAnalytics] = useState<any>(null);
  const [manifest, setManifest] = useState<PaperRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz Modal State
  const [quizState, setQuizState] = useState<{
    isOpen: boolean;
    topic: string;
    chapterSlug: string;
    subject: string;
  }>({
    isOpen: false,
    topic: '',
    chapterSlug: '',
    subject: ''
  });

  // Export Modal State
  const [exportOpen, setExportOpen] = useState(false);

  // Load analytics and manifest on mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch('/api/analytics').then(res => res.json()),
      fetch('/api/manifest').then(res => res.json())
    ])
      .then(([analyticsData, manifestData]) => {
        if (!isMounted) return;
        setAnalytics(analyticsData);
        setManifest(manifestData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load dataset:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleJumpToTopic = (topic: string, chapterSlug: string, subject: string) => {
    setQuizState({
      isOpen: true,
      topic,
      chapterSlug,
      subject
    });
  };

  const handleSelectSubject = (subject: string) => {
    setActiveView(subject.toLowerCase());
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-base font-semibold text-slate-800">
            Loading MHT CET 2022–2026 PYQ Database...
          </h2>
          <p className="text-xs text-slate-500">
            Initializing 12,422 verified questions across 83 examination shifts
          </p>
        </div>
      </div>
    );
  }

  const { chapters, top20, allTopics, metadata } = analytics;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenExport={() => setExportOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section (Always visible on dashboard, concise breadcrumb elsewhere) */}
        {activeView === 'dashboard' ? (
          <HeroBanner
            totalQuestions={metadata.totalQuestionsAnalyzed}
            totalPapers={metadata.totalPapers}
            totalChapters={metadata.totalChapters}
            totalTopics={metadata.totalTopics}
            onExploreTop20={() => setActiveView('top20')}
            onOpenExport={() => setExportOpen(true)}
          />
        ) : (
          <div className="bg-slate-900 text-white py-6 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  MHT CET 2022–2026 Shift Analytics
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight capitalize mt-0.5">
                  {activeView === 'manifest'
                    ? 'Paper Coverage Manifest (83 Shifts)'
                    : activeView === 'top20'
                    ? 'Top 20 Most Frequent Subtopics'
                    : `${activeView} Chapter & Topic Breakdown`}
                </h1>
              </div>

              <button
                onClick={() => setActiveView('dashboard')}
                className="self-start sm:self-auto text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                ← Back to Overview
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-12">
          {/* VIEW 1: DASHBOARD / OVERVIEW */}
          {activeView === 'dashboard' && (
            <>
              {/* Subject Cards */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Subject Core Weightage (PCM)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Even 50-50-50 question distribution per paper across all analyzed shifts.
                    </p>
                  </div>
                </div>

                <SubjectOverviewCards
                  onSelectSubject={handleSelectSubject}
                  onJumpToTopic={handleJumpToTopic}
                />
              </section>

              {/* Visual Analytics */}
              <section className="space-y-4">
                <AnalyticsVisuals
                  chapters={chapters}
                  allTopics={allTopics}
                  onJumpToTopic={handleJumpToTopic}
                />
              </section>

              {/* Quick Jump to Top 20 Preview */}
              <section className="space-y-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Highest-Yield Subtopics At a Glance
                    </h3>
                    <p className="text-xs text-slate-500">
                      The top 5 recurring subtopics in each subject. Crucial for last-minute revisions.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView('top20')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>View All Top 20 Rankings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Physics Highlights */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Physics Highlights</span>
                      <span className="text-slate-400 font-normal">Top 5</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {top20.physics.slice(0, 5).map((t: TopicStat, i: number) => (
                        <div key={t.topicName} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="truncate max-w-[210px]">
                            <span className="font-bold text-slate-700 mr-1.5">{i + 1}.</span>
                            <span className="font-medium text-slate-900">{t.topicName}</span>
                          </div>
                          <button
                            onClick={() => handleJumpToTopic(t.topicName, t.chapterSlug, 'physics')}
                            className="px-2 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded text-[11px] font-semibold text-slate-700 transition-colors shrink-0"
                          >
                            Quiz ({t.totalQuestions})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chemistry Highlights */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Chemistry Highlights</span>
                      <span className="text-slate-400 font-normal">Top 5</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {top20.chemistry.slice(0, 5).map((t: TopicStat, i: number) => (
                        <div key={t.topicName} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="truncate max-w-[210px]">
                            <span className="font-bold text-slate-700 mr-1.5">{i + 1}.</span>
                            <span className="font-medium text-slate-900">{t.topicName}</span>
                          </div>
                          <button
                            onClick={() => handleJumpToTopic(t.topicName, t.chapterSlug, 'chemistry')}
                            className="px-2 py-1 bg-slate-100 hover:bg-teal-600 hover:text-white rounded text-[11px] font-semibold text-slate-700 transition-colors shrink-0"
                          >
                            Quiz ({t.totalQuestions})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mathematics Highlights */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Mathematics Highlights</span>
                      <span className="text-slate-400 font-normal">Top 5</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {top20.mathematics.slice(0, 5).map((t: TopicStat, i: number) => (
                        <div key={t.topicName} className="py-2.5 flex items-center justify-between gap-2">
                          <div className="truncate max-w-[210px]">
                            <span className="font-bold text-slate-700 mr-1.5">{i + 1}.</span>
                            <span className="font-medium text-slate-900">{t.topicName}</span>
                          </div>
                          <button
                            onClick={() => handleJumpToTopic(t.topicName, t.chapterSlug, 'mathematics')}
                            className="px-2 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded text-[11px] font-semibold text-slate-700 transition-colors shrink-0"
                          >
                            Quiz ({t.totalQuestions})
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Research Methodology & Academic Integrity */}
              <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Analytical Methodology & Syllabus Integrity Standards
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed pt-2">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">1. Exact Syllabus Alignment</h4>
                    <p>
                      MHT CET strictly tests Maharashtra State Board HSC (Class 12 - 80% weightage)
                      and select Class 11 chapters (20% weightage). Questions are preserved within
                      their actual syllabus boundaries without mixing JEE Main or NEET topics.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">2. Complete Paper Denominators</h4>
                    <p>
                      Shift averages use true paper denominators: 12 papers (2022), 12 papers (2023),
                      16 papers (2024), 16 papers (2025), and 27 papers (2026) totaling 83 papers.
                      Never approximated or scaled artificially.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">3. Official Verification</h4>
                    <p>
                      Answers and step-by-step explanations reflect official MHT CET answer keys
                      scraped from ExamSide. Every question retains its original shift name and direct
                      verification URL for auditability.
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* VIEW 2, 3, 4: PHYSICS / CHEMISTRY / MATHEMATICS DASHBOARDS */}
          {(activeView === 'physics' || activeView === 'chemistry' || activeView === 'mathematics') && (
            <SubjectDashboard
              chapters={chapters}
              selectedSubject={activeView}
              onSelectSubject={setActiveView}
              onJumpToTopic={handleJumpToTopic}
            />
          )}

          {/* VIEW 5: TOP 20 RANKINGS */}
          {activeView === 'top20' && (
            <Top20Rankings
              top20={top20}
              onJumpToTopic={handleJumpToTopic}
            />
          )}

          {/* VIEW 6: PAPER COVERAGE MANIFEST */}
          {activeView === 'manifest' && (
            <PaperManifestView
              manifest={manifest}
              onOpenExport={() => setExportOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-800 text-sm">
              MHT CET 2022–2026 PYQ Analytics Platform
            </div>
            <div className="mt-0.5 text-slate-500">
              Primary source: ExamSide MHT CET Repository · 83 Shifts · 12,422 Extracted Questions
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveView('dashboard')}
              className="hover:text-slate-900 transition-colors"
            >
              Overview
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveView('top20')}
              className="hover:text-slate-900 transition-colors"
            >
              Top 20 Subtopics
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveView('manifest')}
              className="hover:text-slate-900 transition-colors"
            >
              Paper Manifest
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setExportOpen(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Export Reports
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Topic-Wise PYQ Quiz Modal */}
      <QuizModal
        isOpen={quizState.isOpen}
        topic={quizState.topic}
        chapterSlug={quizState.chapterSlug}
        subject={quizState.subject}
        onClose={() => setQuizState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Download Center Modal */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        allTopics={allTopics}
        top20={top20}
        manifest={manifest}
      />
    </div>
  );
}
