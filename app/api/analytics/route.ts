
import { NextResponse } from 'next/server';
import analytics from '@/data/mht_cet_analytics.json';

export async function GET() {
  return NextResponse.json(analytics);
}
