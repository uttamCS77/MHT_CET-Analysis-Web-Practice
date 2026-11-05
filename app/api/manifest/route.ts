import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let cachedManifest: any = null;

export async function GET() {
  try {
    if (!cachedManifest) {
      const filePath = path.join(process.cwd(), 'data', 'paper_manifest.json');
      const data = fs.readFileSync(filePath, 'utf8');
      cachedManifest = JSON.parse(data);
    }
    return NextResponse.json(cachedManifest);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
