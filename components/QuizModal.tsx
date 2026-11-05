'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Shuffle, 
  Filter, 
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface QuizQuestion {
  id: string;
  year: number;
  shift: string;
  paperName: string;
  subject: string;
  chapterSlug: string;
  chapterName: string;
  topic: string;
  questionText: string;
  diagramUrl?: string | null;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  answerSource: string;
  link: string;
}

interface QuizModalProps {
  topic: string;
  chapterSlug: string;
  subject: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QuizModal({
  topic,
  chapterSlug,
  subject,
  isOpen,
  onClose
}: QuizModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <QuizSession
        key={`${subject}-${chapterSlug}-${topic}`}
        topic={topic}
        chapterSlug={chapterSlug}
        subject={subject}
        onClose={onClose}
      />
    </div>
  );
}

function QuizSession({
  topic,
  chapterSlug,
  subject,
  onClose
}: {
  topic: string;
  chapterSlug: string;
  subject: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [id: string]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [id: string]: boolean }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [yearFilter, setYearFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [practiceMode, setPracticeMode] = useState<'all' | 'unanswered' | 'incorrect'>('all');
  const [randomize, setRandomize] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  // Fetch questions for this topic
  useEffect(() => {
    let isMounted = true;

    const query = new URLSearchParams({
      topic,
      chapter: chapterSlug,
      subject,
      limit: '50'
    });

    fetch(`/api/questions?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const fetched: QuizQuestion[] = data.questions || [];
        setQuestions(fetched);
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error('Error fetching quiz questions:', err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [topic, chapterSlug, subject]);

  // Timer effect
  useEffect(() => {
    if (isSubmitted || loading) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, loading]);

  // Filtered and potentially randomized questions
  const displayedQuestions = useMemo(() => {
    let list = [...questions];

    if (yearFilter !== 'all') {
      const yr = parseInt(yearFilter, 10);
      list = list.filter(q => q.year === yr);
    }

    if (shiftFilter !== 'all') {
      list = list.filter(q => q.shift.toLowerCase().includes(shiftFilter.toLowerCase()));
    }

    if (isSubmitted && practiceMode === 'incorrect') {
      list = list.filter(q => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer);
    } else if (practiceMode === 'unanswered') {
      list = list.filter(q => !userAnswers[q.id]);
    }

    if (randomize) {
      list.sort((a, b) => a.id.localeCompare(b.id));
    }

    return list;
  }, [questions, yearFilter, shiftFilter, practiceMode, randomize, isSubmitted, userAnswers]);

  const safeIndex = Math.min(currentIndex, Math.max(0, displayedQuestions.length - 1));
  const currentQ = displayedQuestions[safeIndex];

  const handleSelectOption = (key: string) => {
    if (isSubmitted || !currentQ) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const handleClearAnswer = () => {
    if (isSubmitted || !currentQ) return;
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
  };

  const toggleReview = () => {
    if (!currentQ) return;
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let correct = 0;
    for (const q of displayedQuestions) {
      if (userAnswers[q.id] === q.correctAnswer) correct++;
    }
    const scorePct = displayedQuestions.length > 0 ? (correct / displayedQuestions.length) * 100 : 0;
    if (scorePct >= 70) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestart = () => {
    setIsSubmitted(false);
    setUserAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setSecondsElapsed(0);
  };

  const totalCount = displayedQuestions.length;
  const attemptedCount = displayedQuestions.filter(q => userAnswers[q.id]).length;
  const correctCount = displayedQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const incorrectCount = displayedQuestions.filter(
    q => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer
  ).length;
  const accuracyPct = attemptedCount > 0 ? ((correctCount / attemptedCount) * 100).toFixed(1) : '0';

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            <span>{subject.toUpperCase()}</span>
            <span aria-hidden="true">·</span>
            <span>{chapterSlug.replace(/-/g, ' ')}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 truncate max-w-xl" title={topic}>
            {topic} · PYQ Practice Quiz
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 tabular-nums shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close Quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            disabled={isSubmitted}
            className="bg-white px-2 py-1 border border-slate-200 rounded-md text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Years (2022-2026)</option>
            <option value="2026">2026 Shifts</option>
            <option value="2025">2025 Shifts</option>
            <option value="2024">2024 Shifts</option>
            <option value="2023">2023 Shifts</option>
            <option value="2022">2022 Shifts</option>
          </select>

          <select
            value={shiftFilter}
            onChange={e => setShiftFilter(e.target.value)}
            disabled={isSubmitted}
            className="bg-white px-2 py-1 border border-slate-200 rounded-md text-slate-700 text-xs focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Shifts</option>
            <option value="morning">Morning Shift</option>
            <option value="evening">Evening Shift</option>
          </select>

          <button
            onClick={() => setRandomize(r => !r)}
            disabled={isSubmitted}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-colors ${
              randomize
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium'
                : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Shuffle className="w-3 h-3" />
            <span>Randomize</span>
          </button>
        </div>

        <div className="text-slate-500 font-medium">
          Attempted:{' '}
          <strong className="text-slate-900 tabular-nums">
            {attemptedCount} / {totalCount}
          </strong>
        </div>
      </div>

      {/* Content Body: Left question stage + Right question palette */}
      <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 text-slate-500 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <span>Loading verified previous year questions...</span>
          </div>
        ) : displayedQuestions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-2" />
            <h3 className="text-base font-semibold text-slate-900">No questions match this filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try selecting &quot;All Years&quot; or &quot;All Shifts&quot; to view the complete historical pool of PYQs.
            </p>
            <button
              onClick={() => {
                setYearFilter('all');
                setShiftFilter('all');
              }}
              className="mt-3 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Question Stage (Left) */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-6">
              <div>
                {/* Question Meta bar */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                  <span className="font-semibold text-indigo-700">
                    Question {safeIndex + 1} of {totalCount}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">{currentQ.paperName}</span>
                    <button
                      onClick={toggleReview}
                      disabled={isSubmitted}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                        markedForReview[currentQ.id]
                          ? 'text-purple-700 bg-purple-50 font-medium'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {markedForReview[currentQ.id] ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                      <span>{markedForReview[currentQ.id] ? 'Marked' : 'Mark Review'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="mt-4 text-slate-900 text-sm sm:text-base leading-relaxed font-normal">
                  <p className="whitespace-pre-line">{currentQ.questionText}</p>

                  {/* Diagram / Circuit / Reaction image if present */}
                  {currentQ.diagramUrl && (
                    <div className="mt-4 p-2 bg-slate-50 rounded-lg border border-slate-200 inline-block">
                      <img
                        src={currentQ.diagramUrl}
                        alt="Question diagram"
                        className="max-h-56 object-contain rounded cursor-pointer hover:opacity-95"
                        referrerPolicy="no-referrer"
                        onClick={() => setImageModalUrl(currentQ.diagramUrl || null)}
                      />
                      <div className="text-[11px] text-slate-400 mt-1 text-center">
                        Click image to view full scale
                      </div>
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="mt-6 space-y-2.5">
                  {currentQ.options.map(opt => {
                    const isSelected = userAnswers[currentQ.id] === opt.key;
                    const isCorrect = opt.key === currentQ.correctAnswer;
                    const isUserIncorrect = isSubmitted && isSelected && !isCorrect;

                    let optClasses =
                      'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';

                    if (isSubmitted) {
                      if (isCorrect) {
                        optClasses = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium';
                      } else if (isUserIncorrect) {
                        optClasses = 'border-rose-400 bg-rose-50/70 text-rose-950';
                      }
                    } else if (isSelected) {
                      optClasses = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-600';
                    }

                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleSelectOption(opt.key)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${optClasses}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt.key}
                        </span>

                        <div className="flex-1 leading-snug">{opt.text}</div>

                        {isSubmitted && isCorrect && (
                          <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Correct</span>
                          </span>
                        )}

                        {isSubmitted && isUserIncorrect && (
                          <span className="text-rose-600 font-semibold text-xs flex items-center gap-1 shrink-0">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Your answer</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Post-submission explanation */}
                {isSubmitted && (
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between text-slate-800 font-bold">
                      <span className="flex items-center gap-1.5 text-indigo-700">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Official Solution & Explanation</span>
                      </span>
                      <a
                        href={currentQ.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                      >
                        <span>Verify on ExamSide</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                      {currentQ.explanation}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1">
                      Source: {currentQ.answerSource}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation controls */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={safeIndex === 0}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-700 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={() =>
                      setCurrentIndex(prev => Math.min(displayedQuestions.length - 1, prev + 1))
                    }
                    disabled={safeIndex === displayedQuestions.length - 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-700 flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {!isSubmitted && (
                  <div className="flex items-center gap-2">
                    {userAnswers[currentQ.id] && (
                      <button
                        onClick={handleClearAnswer}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        Clear Selection
                      </button>
                    )}

                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                    >
                      Submit Test
                    </button>
                  </div>
                )}

                {isSubmitted && (
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restart Practice</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right: Question Palette & Scorecard */}
            <div className="w-full md:w-72 bg-slate-50/80 border-t md:border-t-0 md:border-l border-slate-200 p-4 sm:p-5 flex flex-col justify-between shrink-0">
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Question Palette ({totalCount})
                </div>

                {isSubmitted && (
                  <div className="mb-4 p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Test Result:</span>
                      <span className="text-indigo-600 tabular-nums">
                        {correctCount} / {totalCount} ({accuracyPct}%)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-slate-600 pt-1 border-t border-slate-100">
                      <div>Correct: <strong className="text-emerald-700">{correctCount}</strong></div>
                      <div>Incorrect: <strong className="text-rose-700">{incorrectCount}</strong></div>
                      <div>Unattempted: <strong className="text-slate-600">{totalCount - attemptedCount}</strong></div>
                      <div>Time: <strong className="text-slate-800">{formatTimer(secondsElapsed)}</strong></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-6 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-64 md:max-h-80 overflow-y-auto pr-1">
                  {displayedQuestions.map((q, idx) => {
                    const isCurrent = idx === safeIndex;
                    const isAttempted = !!userAnswers[q.id];
                    const isReview = !!markedForReview[q.id];

                    let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                    if (isSubmitted) {
                      if (userAnswers[q.id] === q.correctAnswer) {
                        btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                      } else if (userAnswers[q.id]) {
                        btnStyle = 'bg-rose-600 border-rose-600 text-white font-bold';
                      } else {
                        btnStyle = 'bg-slate-200 text-slate-600 border-slate-300';
                      }
                    } else {
                      if (isReview) {
                        btnStyle = 'bg-purple-100 border-purple-400 text-purple-900 font-bold';
                      } else if (isAttempted) {
                        btnStyle = 'bg-indigo-600 border-indigo-600 text-white font-bold';
                      }
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-8 rounded-lg text-xs font-semibold border flex items-center justify-center transition-all ${btnStyle} ${
                          isCurrent ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5 mt-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
                  <span>Attempted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-purple-200 border border-purple-400 inline-block"></span>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block"></span>
                  <span>Unattempted</span>
                </div>
                {isSubmitted && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
                    <span>Correct</span>
                    <span className="w-3 h-3 rounded bg-rose-600 inline-block ml-2"></span>
                    <span>Incorrect</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {imageModalUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setImageModalUrl(null)}
        >
          <div className="max-w-4xl max-h-[90vh] bg-white p-3 rounded-xl relative">
            <button
              onClick={() => setImageModalUrl(null)}
              className="absolute -top-3 -right-3 bg-white text-slate-800 rounded-full p-1 shadow-md hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={imageModalUrl}
              alt="Diagram enlarged"
              className="max-h-[80vh] object-contain rounded"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
