import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedQuestions: any[] = [];
let hasLoaded = false;

function getQuestions(): any[] {
  if (!hasLoaded) {
    const filePath = path.join(process.cwd(), 'data', 'mht_cet_questions.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      cachedQuestions = JSON.parse(data);
    } else {
      cachedQuestions = [];
    }
    hasLoaded = true;
  }
  return cachedQuestions;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const chapter = searchParams.get('chapter');
    const subject = searchParams.get('subject');
    const year = searchParams.get('year');
    const shift = searchParams.get('shift');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const all = getQuestions();
    let filtered = all;

    if (subject) {
      filtered = filtered.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }
    if (chapter) {
      filtered = filtered.filter(q => q.chapterSlug.toLowerCase() === chapter.toLowerCase());
    }
    if (topic) {
      filtered = filtered.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    }
    if (year) {
      const y = parseInt(year, 10);
      filtered = filtered.filter(q => q.year === y);
    }
    if (shift) {
      filtered = filtered.filter(q => q.shift.toLowerCase().includes(shift.toLowerCase()));
    }

    return NextResponse.json({
      total: filtered.length,
      questions: filtered.slice(0, limit)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
