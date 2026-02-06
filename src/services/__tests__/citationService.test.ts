import { describe, it, expect, vi } from 'vitest';
import { 
  fetchCrossRefCitations, 
  fetchSemanticScholarCitations,
  fetchCitationCount 
} from '../citationService';

// Mock fetch globally
global.fetch = vi.fn();

describe('Citation Service', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCrossRefCitations', () => {
    it('should fetch citation count from CrossRef API', async () => {
      const mockResponse = {
        message: {
          'is-referenced-by-count': 42
        }
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchCrossRefCitations('10.1234/example');
      
      expect(result).toBe(42);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.crossref.org/works/10.1234%2Fexample'
      );
    });

    it('should return null on API error', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const result = await fetchCrossRefCitations('invalid-doi');
      expect(result).toBeNull();
    });

    it('should return 0 if citation count is missing', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: {} })
      });

      const result = await fetchCrossRefCitations('10.1234/example');
      expect(result).toBe(0);
    });
  });

  describe('fetchSemanticScholarCitations', () => {
    it('should fetch citation count using DOI', async () => {
      const mockResponse = {
        citationCount: 123,
        paperId: 'abc123'
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchSemanticScholarCitations({
        doi: '10.1234/example',
        title: 'Test Paper'
      });

      expect(result).toEqual({
        count: 123,
        paperId: 'abc123'
      });
    });

    it('should search by title if no DOI', async () => {
      const mockSearchResponse = {
        data: [{
          citationCount: 56,
          paperId: 'xyz789',
          title: 'Test Paper',
          year: 2024
        }]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse
      });

      const result = await fetchSemanticScholarCitations({
        title: 'Test Paper',
        year: 2024
      });

      expect(result).toEqual({
        count: 56,
        paperId: 'xyz789'
      });
    });

    it('should return null if no results found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      });

      const result = await fetchSemanticScholarCitations({
        title: 'Nonexistent Paper'
      });

      expect(result).toBeNull();
    });
  });

  describe('fetchCitationCount', () => {
    it('should return highest count from multiple sources', async () => {
      // Mock CrossRef response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: { 'is-referenced-by-count': 50 }
        })
      });

      // Mock Semantic Scholar response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          citationCount: 75,
          paperId: 'abc123'
        })
      });

      const result = await fetchCitationCount({
        doi: '10.1234/example',
        title: 'Test Paper',
        year: 2024
      });

      expect(result).toBeDefined();
      expect(result?.count).toBe(75);
      expect(result?.source).toBe('semanticscholar');
    });

    it('should return null if all sources fail', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const result = await fetchCitationCount({
        title: 'Test Paper'
      });

      expect(result).toBeNull();
    });
  });
});
