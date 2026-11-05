import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'MHT CET 2022–2026 PYQ Analytics & Preparation',
  description: 'Comprehensive 5-year previous year question (PYQ) frequency analysis, chapter-wise topic importance rankings, top 20 high-yield subtopics, and interactive topic-wise quizzes for MHT CET PCM.',
  openGraph: {
    title: 'MHT CET 2022–2026 PYQ Analytics & Preparation',
    description: 'Comprehensive 5-year previous year question (PYQ) frequency analysis, chapter-wise topic importance rankings, top 20 high-yield subtopics, and interactive topic-wise quizzes for MHT CET PCM.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MHT CET 2022–2026 PYQ Analytics & Preparation',
    description: 'Comprehensive 5-year previous year question (PYQ) frequency analysis, chapter-wise topic importance rankings, top 20 high-yield subtopics, and interactive topic-wise quizzes for MHT CET PCM.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
