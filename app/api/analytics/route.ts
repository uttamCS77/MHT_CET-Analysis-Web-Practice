import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedAnalytics: any = null;

export async function GET() {
  try {
    if (!cachedAnalytics) {
      const filePath = path.join(process.cwd(), 'data', 'mht_cet_analytics.json');
      const data = fs.readFileSync(filePath, 'utf8');
      cachedAnalytics = JSON.parse(data);
    }
    return NextResponse.json(cachedAnalytics);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
