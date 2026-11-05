
import { NextResponse } from 'next/server';
import manifest from '@/data/paper_manifest.json';

export async function GET() {
  return NextResponse.json(manifest);
}
