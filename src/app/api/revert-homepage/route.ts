import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, copyFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    
    if (code !== 2000) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 403 });
    }

    const backupPath = path.join(process.cwd(), 'src/app/page.backup-2000.tsx');
    const pagePath = path.join(process.cwd(), 'src/app/page.tsx');

    try {
      await copyFile(backupPath, pagePath);
      return NextResponse.json({ success: true, message: 'Homepage reverted to original version!' });
    } catch {
      return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
