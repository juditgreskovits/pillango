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
  const csvPath = path.join(process.cwd(), 'src/data/leah.csv');

  console.log('*** csvPath = ', csvPath);

  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `CSV file not found at ${csvPath}. Please ensure the file exists in the src/data directory.`
    );
  }

  return fs.readFileSync(csvPath, 'utf-8');
}

/**
 * Filters and extracts headache dates from the data
 */
function extractHeadacheDates(rows: LeahDataRow[]): string[] {
  return rows
    .filter(
      (row) =>
        row.RecordCategory === 'Health' &&
        row.RecordSubCategory === 'Medication' &&
        row.Details.toLowerCase().includes('headache')
    )
    .map((row) => row.StartDate);
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
    download: false, // Explicitly tell PapaParse we're passing a string
  });

  if (errors.length > 0) {
    console.warn('CSV parsing errors:', errors);
  }

  return {
    headacheDates: extractHeadacheDates(data),
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
    console.log('*** csvContent = ', csvContent);
    const processedData = processLeahData(csvContent);

    // Cache the processed data
    cachedData = processedData;

    return processedData;
  } catch (error) {
    console.error('Error processing Leah data:', error);
    throw error;
  }
}
