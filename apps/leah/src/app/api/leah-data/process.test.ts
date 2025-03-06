import { getLeahData, processLeahData, readLeahCsv } from './process';
import fs from 'fs';
import path from 'path';

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
}));

describe('readLeahCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read CSV file when it exists', () => {
    const mockCsvData = `RecordCategory,RecordSubCategory,StartDate,FinishDate,Details
Health,Medication,2024-01-01,2024-01-02,headache medication taken`;

    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    const result = readLeahCsv();

    expect(result).toBe(mockCsvData);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining('src/data/leah.csv'),
      'utf-8'
    );
  });

  it('should throw helpful error when file does not exist', () => {
    // Mock fs.existsSync to return false
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(() => readLeahCsv()).toThrow(
      /CSV file not found.*Please ensure the file exists in the src\/data directory/
    );
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  it('should handle file read errors', () => {
    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => readLeahCsv()).toThrow('File not found');
  });
});

describe('processLeahData', () => {
  it('should extract headache dates', () => {
    const mockCsvData = `RecordCategory,RecordSubCategory,StartDate,FinishDate,Details
Health,Medication,2024-01-01,2024-01-02,headache medication taken
Health,Exercise,2024-01-03,2024-01-04,morning run
Health,Medication,2024-01-05,2024-01-06,headache pills
Other,Medication,2024-01-07,2024-01-08,headache treatment`;

    const result = processLeahData(mockCsvData);

    expect(result.headacheDates).toEqual(['2024-01-01', '2024-01-05']);
  });

  it('should handle empty CSV data', () => {
    const mockCsvData = `RecordCategory,RecordSubCategory,StartDate,FinishDate,Details`;

    const result = processLeahData(mockCsvData);

    expect(result.headacheDates).toHaveLength(0);
  });

  it('should handle CSV data with no headache records', () => {
    const mockCsvData = `RecordCategory,RecordSubCategory,StartDate,FinishDate,Details
Health,Exercise,2024-01-01,2024-01-02,morning run
Other,Medication,2024-01-03,2024-01-04,other medication`;

    const result = processLeahData(mockCsvData);

    expect(result.headacheDates).toHaveLength(0);
  });
});

describe('getLeahData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read and process CSV file and cache the data', async () => {
    const mockCsvData = `RecordCategory,RecordSubCategory,StartDate,FinishDate,Details
Health,Medication,2024-01-01,2024-01-02,headache medication taken
Health,Exercise,2024-01-03,2024-01-04,morning run
Health,Medication,2024-01-05,2024-01-06,headache pills`;

    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    const result = await getLeahData();

    expect(result.headacheDates).toEqual(['2024-01-01', '2024-01-05']);

    // Process data second time
    const cachedResult = await getLeahData();

    // Verify the data is the same
    expect(cachedResult).toEqual(result);
    // Verify fs.readFileSync was only called once
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
  });
});
