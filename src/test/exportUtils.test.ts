import { describe, it, expect, vi } from 'vitest';
import { escapeCSV, downloadCSV, downloadJSON } from '../../exportUtils';

describe('exportUtils', () => {
  describe('escapeCSV', () => {
    it('should return an empty string for null or undefined input', () => {
      expect(escapeCSV(null)).toBe('');
      expect(escapeCSV(undefined)).toBe('');
    });

    it('should return the original string if no special characters are present', () => {
      expect(escapeCSV('hello')).toBe('hello');
      expect(escapeCSV(123)).toBe('123');
    });

    it('should enclose the string in double quotes if it contains a comma', () => {
      expect(escapeCSV('hello,world')).toBe('"hello,world"');
    });

    it('should enclose the string in double quotes and escape existing quotes', () => {
      expect(escapeCSV('hello"world')).toBe('"hello""world"');
    });

    it('should enclose the string in double quotes if it contains a newline', () => {
      expect(escapeCSV('hello\nworld')).toBe('"hello\nworld"');
    });

    it('should handle a combination of special characters', () => {
      expect(escapeCSV('hello,"world"\nfoo')).toBe('"hello,""world""\nfoo"');
    });
  });

  describe('downloadCSV', () => {
    it('should not do anything if data is empty', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      downloadCSV([], 'test.csv');
      expect(createElementSpy).not.toHaveBeenCalled();
    });

    it('should generate a CSV and trigger a download', () => {
      const data = [
        { name: 'John Doe', age: 30 },
        { name: 'Jane, Doe', age: 25 },
      ];
      const link = document.createElement('a');
      const linkClickSpy = vi.spyOn(link, 'click').mockImplementation(() => {});
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(link);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock');

      downloadCSV(data, 'test.csv');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(link.href).toContain('blob:mock');
      expect(link.download).toBe('test.csv');
      expect(link.style.visibility).toBe('hidden');
      expect(appendChildSpy).toHaveBeenCalledWith(link);
      expect(linkClickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(link);
    });
  });

  describe('downloadJSON', () => {
    it('should generate a JSON file and trigger a download', () => {
      const data = { name: 'John Doe', age: 30 };
      const link = document.createElement('a');
      const linkClickSpy = vi.spyOn(link, 'click').mockImplementation(() => {});
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(link);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      const createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock');

      downloadJSON(data, 'test.json');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(link.href).toContain('blob:mock');
      expect(link.download).toBe('test.json');
      expect(link.style.visibility).toBe('hidden');
      expect(appendChildSpy).toHaveBeenCalledWith(link);
      expect(linkClickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(link);
    });
  });
});
