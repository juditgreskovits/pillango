// Define the type for a single row in your CSV
export interface LeahDataRow {
  RecordCategory: string;
  RecordSubCategory: string;
  StartDate: string;
  FinishDate: string;
  Details: string;
}

// Define the type for the processed data
export interface ProcessedLeahData {
  headacheDates: string[]; // Array of dates when headaches occurred
}
