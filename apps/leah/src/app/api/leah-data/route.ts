import { NextResponse } from 'next/server';
import { processLeahData } from './process';

export async function GET() {
  try {
    const processedData = await processLeahData();
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error processing Leah data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}
