import { NextResponse } from 'next/server';
import { getLeahData } from './process';

export async function GET() {
  try {
    const processedData = await getLeahData();
    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error processing Leah data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}
