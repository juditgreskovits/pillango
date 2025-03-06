import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import type { LeahDataRow, ProcessedLeahData } from './types';

// Cache the processed data
let cachedData: ProcessedLeahData | null = null;

/**
 * Reads the CSV file
 */
export function readLeahCsv(): string {
  const csvPath = path.join(process.cwd(), 'public/data/leah.csv');
  return fs.readFileSync(csvPath, 'utf-8');
}

/**
 * Pure function to process CSV data
 */
export function processLeahData(csvContent: string): ProcessedLeahData {
  // Parse the CSV
  const { data, errors } = Papa.parse<LeahDataRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (errors.length > 0) {
    console.warn('CSV parsing errors:', errors);
  }

  // Process the data
  return {
    rows: data,
    // Add additional processing here
    // For example:
    // weeklyStats: calculateWeeklyStats(data),
    // monthlyStats: calculateMonthlyStats(data),
  };
}

/**
 * Main function that handles caching
 */
export async function getLeahData(): Promise<ProcessedLeahData> {
  try {
    // Return cached data if available
    if (cachedData) {
      return cachedData;
    }

    // Read and process the data
    const csvContent = readLeahCsv();
    const processedData = processLeahData(csvContent);

    // Cache the processed data
    cachedData = processedData;

    return processedData;
  } catch (error) {
    console.error('Error processing Leah data:', error);
    throw error;
  }
}
