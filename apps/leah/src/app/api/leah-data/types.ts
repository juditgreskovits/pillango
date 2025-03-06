// Define the type for a single row in your CSV
export interface LeahDataRow {
  category: string;
  subCategory: string;
  startDate: string;
  finishDate: string;
  details: string;
}

// Define the type for the processed data
export interface ProcessedLeahData {
  rows: LeahDataRow[];
  // Add any additional processed data structures you need
  // For example:
  // weeklyStats: WeeklyStats[];
  // monthlyStats: MonthlyStats[];
}
