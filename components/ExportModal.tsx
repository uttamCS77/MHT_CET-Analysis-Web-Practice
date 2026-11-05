'use client';

import React, { useState } from 'react';
import { X, FileSpreadsheet, FileText, Download, Check, Sparkles, BookOpen } from 'lucide-react';
import { TopicStat, PaperRecord, exportToExcel, exportToPDF, exportToCSV } from '@/lib/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTopics: TopicStat[];
  top20: {
    physics: TopicStat[];
    chemistry: TopicStat[];
    mathematics: TopicStat[];
  };
  manifest: PaperRecord[];
}

export function ExportModal({
  isOpen,
  onClose,
  allTopics,
  top20,
  manifest
}: ExportModalProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerExcel = (subject?: string) => {
    setDownloadingFormat(`excel-${subject || 'all'}`);
    setTimeout(() => {
      exportToExcel(allTopics, top20, manifest, subject);
      setDownloadingFormat(null);
    }, 400);
  };

  const triggerPDF = (subject: string) => {
    setDownloadingFormat(`pdf-${subject}`);
    setTimeout(() => {
      const filtered = subject === 'all' ? allTopics : allTopics.filter(t => t.subject === subject);
      const topList = subject === 'all' ? top20.physics : (top20 as any)[subject] || [];
      exportToPDF(subject, filtered, topList, manifest.length);
      setDownloadingFormat(null);
    }, 400);
  };

  const triggerCSV = (subject: string) => {
    setDownloadingFormat(`csv-${subject}`);
    setTimeout(() => {
      const filtered = subject === 'all' ? allTopics : allTopics.filter(t => t.subject === subject);
      const filename = subject === 'all' ? 'MHT_CET_2022_2026_Complete_Analysis' : `MHT_CET_${subject}_2022_2026_Analysis`;
      exportToCSV(filtered, filename);
      setDownloadingFormat(null);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" />
              <span>MHT CET Analysis Export Center</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Download complete 5-year empirical data across 83 examination shifts (2022–2026).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Combined Complete Report */}
          <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-slate-50 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Full Suite · All 3 Subjects
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Complete MHT CET 5-Year PYQ Analysis
                </h3>
              </div>
              <span className="text-xs text-slate-500">12,422 Questions</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Includes comprehensive chapter rankings, topic density metrics, Top 20 subtopics for
              Physics, Chemistry & Math, and the complete 83-shift Paper Coverage Manifest.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => triggerExcel()}
                disabled={!!downloadingFormat}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>
                  {downloadingFormat === 'excel-all' ? 'Generating...' : 'Excel (.xlsx) · 8 Sheets'}
                </span>
              </button>

              <button
                onClick={() => triggerPDF('all')}
                disabled={!!downloadingFormat}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {downloadingFormat === 'pdf-all' ? 'Generating...' : 'Printable PDF Report'}
                </span>
              </button>

              <button
                onClick={() => triggerCSV('all')}
                disabled={!!downloadingFormat}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Full CSV</span>
              </button>
            </div>
          </div>

          {/* Section 2: Subject-Wise Downloads */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Subject-Wise Specialized Exports
            </h4>

            {/* Physics */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Physics Analysis Report</span>
                  <span className="text-xs text-slate-500 font-normal">· 28 Chapters, 4,138 PYQs</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Includes Top 20 Physics Subtopics and annual shift density metrics.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerExcel('physics')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => triggerPDF('physics')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => triggerCSV('physics')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Chemistry */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Chemistry Analysis Report</span>
                  <span className="text-xs text-slate-500 font-normal">· 34 Chapters, 4,137 PYQs</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Includes Top 20 Chemistry Subtopics and annual shift density metrics.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerExcel('chemistry')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => triggerPDF('chemistry')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => triggerCSV('chemistry')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  CSV
                </button>
              </div>
            </div>

            {/* Mathematics */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Mathematics Analysis Report</span>
                  <span className="text-xs text-slate-500 font-normal">· 29 Chapters, 4,147 PYQs</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Includes Top 20 Math Subtopics and annual shift density metrics.
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerExcel('mathematics')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => triggerPDF('mathematics')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => triggerCSV('mathematics')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
