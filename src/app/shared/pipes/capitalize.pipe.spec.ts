import { CapitalizePipe } from './capitalize.pipe';

describe('CapitalizePipe', () => {
  let pipe: CapitalizePipe;

  beforeEach(() => {
    pipe = new CapitalizePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('basic capitalization', () => {
    it('should capitalize first letter of lowercase word', () => {
      expect(pipe.transform('hello')).toBe('Hello');
    });

    it('should capitalize first letter and lowercase rest', () => {
      expect(pipe.transform('hELLO')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(pipe.transform('a')).toBe('A');
    });

    it('should handle already capitalized word', () => {
      expect(pipe.transform('Hello')).toBe('Hello');
    });

    it('should handle all uppercase word', () => {
      expect(pipe.transform('HELLO')).toBe('Hello');
    });
  });

  describe('multiple words', () => {
    it('should only capitalize first letter of string with multiple words', () => {
      expect(pipe.transform('hello world')).toBe('Hello world');
    });

    it('should lowercase all but first character in multi-word string', () => {
      expect(pipe.transform('HELLO WORLD')).toBe('Hello world');
    });

    it('should handle mixed case multi-word strings', () => {
      expect(pipe.transform('hELLo WoRLd')).toBe('Hello world');
    });
  });

  describe('special characters', () => {
    it('should handle strings with numbers', () => {
      expect(pipe.transform('hello123')).toBe('Hello123');
    });

    it('should handle strings starting with numbers', () => {
      expect(pipe.transform('123hello')).toBe('123hello');
    });

    it('should handle strings with special characters', () => {
      expect(pipe.transform('hello-world')).toBe('Hello-world');
    });

    it('should handle strings with punctuation', () => {
      expect(pipe.transform('hello!')).toBe('Hello!');
    });

    it('should handle strings with spaces at start', () => {
      expect(pipe.transform(' hello')).toBe(' hello');
    });

    it('should handle strings with accented characters', () => {
      expect(pipe.transform('àbc')).toBe('Àbc');
    });
  });

  describe('null and undefined handling', () => {
    it('should return empty string for null', () => {
      expect(pipe.transform(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(pipe.transform(undefined)).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(pipe.transform('')).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should handle string with only spaces', () => {
      expect(pipe.transform('   ')).toBe('   ');
    });

    it('should handle string with only special characters', () => {
      expect(pipe.transform('!!!')).toBe('!!!');
    });

    it('should handle string with only numbers', () => {
      expect(pipe.transform('123')).toBe('123');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const expected = 'A' + 'a'.repeat(999);
      expect(pipe.transform(longString)).toBe(expected);
    });

    it('should handle unicode characters', () => {
      expect(pipe.transform('日本語')).toBe('日本語');
    });

    it('should handle emoji', () => {
      expect(pipe.transform('👋hello')).toBe('👋hello');
    });

    it('should handle newlines', () => {
      expect(pipe.transform('hello\nworld')).toBe('Hello\nworld');
    });

    it('should handle tabs', () => {
      expect(pipe.transform('hello\tworld')).toBe('Hello\tworld');
    });
  });

  describe('real-world use cases', () => {
    it('should capitalize car brand names', () => {
      expect(pipe.transform('toyota')).toBe('Toyota');
      expect(pipe.transform('FORD')).toBe('Ford');
      expect(pipe.transform('honda')).toBe('Honda');
    });

    it('should capitalize color names', () => {
      expect(pipe.transform('red')).toBe('Red');
      expect(pipe.transform('BLUE')).toBe('Blue');
      expect(pipe.transform('green')).toBe('Green');
    });

    it('should capitalize model names', () => {
      expect(pipe.transform('corolla')).toBe('Corolla');
      expect(pipe.transform('CIVIC')).toBe('Civic');
    });

    it('should handle compound car model names', () => {
      expect(pipe.transform('rav4 hybrid')).toBe('Rav4 hybrid');
    });
  });
});
