import { GET } from './route';
import { getLeahData } from './process';

// Mock the process function
jest.mock('./process', () => ({
  getLeahData: jest.fn(),
}));

describe('GET /api/leah-data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return processed data', async () => {
    // Mock processed data
    const mockData = {
      rows: [
        {
          category: 'test',
          subCategory: 'subtest',
          startDate: '2024-01-01',
          finishDate: '2024-01-02',
          details: 'test details',
        },
      ],
    };

    // Mock getLeahData
    (getLeahData as jest.Mock).mockResolvedValue(mockData);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockData);
  });

  it('should handle processing errors', async () => {
    // Mock getLeahData to throw error
    (getLeahData as jest.Mock).mockRejectedValue(new Error('Processing error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to process data');
  });
});
