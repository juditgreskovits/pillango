import { getLeahData, processLeahData, readLeahCsv } from './process';
import fs from 'fs';
import path from 'path';

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

describe('readLeahCsv', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read CSV file', () => {
    const mockCsvData = `Category,SubCategory,StartDate,FinishDate,Details
test,subtest,2024-01-01,2024-01-02,test details`;

    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    const result = readLeahCsv();

    expect(result).toBe(mockCsvData);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining('public/data/leah.csv'),
      'utf-8'
    );
  });

  it('should handle file read errors', () => {
    // Mock fs.readFileSync to throw error
    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => readLeahCsv()).toThrow('File not found');
  });
});

describe('processLeahData', () => {
  it('should process valid CSV data', () => {
    const mockCsvData = `Category,SubCategory,StartDate,FinishDate,Details
test,subtest,2024-01-01,2024-01-02,test details
test2,subtest2,2024-01-03,2024-01-04,more details`;

    const result = processLeahData(mockCsvData);

    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual({
      Category: 'test',
      SubCategory: 'subtest',
      StartDate: '2024-01-01',
      FinishDate: '2024-01-02',
      Details: 'test details',
    });
  });

  it('should handle empty CSV data', () => {
    const mockCsvData = `Category,SubCategory,StartDate,FinishDate,Details`;

    const result = processLeahData(mockCsvData);

    expect(result.rows).toHaveLength(0);
  });
});

describe('getLeahData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read and process CSV file and cache the data', async () => {
    const mockCsvData = `Category,SubCategory,StartDate,FinishDate,Details
test,subtest,2024-01-01,2024-01-02,test details`;

    // Mock fs.readFileSync
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);

    const result = await getLeahData();

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toEqual({
      Category: 'test',
      SubCategory: 'subtest',
      StartDate: '2024-01-01',
      FinishDate: '2024-01-02',
      Details: 'test details',
    });

    // Process data second time
    const cachedResult = await getLeahData();

    // Verify the data is the same
    expect(cachedResult).toEqual(result);
    // Verify fs.readFileSync was only called once
    expect(fs.readFileSync).toHaveBeenCalledTimes(1);
  });
});
