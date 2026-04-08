/**
 * Utility functions for text processing and optimization
 */

// Remove Tamil text while keeping English
export const removeNonEnglishText = (text) => {
  if (!text) return '';
  
  // Remove Tamil Unicode characters (Tamil range: 0x0B80-0x0BFF)
  let cleaned = text.replace(/[\u0B80-\u0BFF]/g, ' ');
  
  // Remove text in parentheses that are often translations
  cleaned = cleaned.replace(/\([^\)]*[\u0B80-\u0BFF][^\)]*\)/g, '');
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};

// Extract only English parts when there's bilingual content
export const extractEnglishOnly = (text) => {
  if (!text) return '';
  
  // Split by common Tamil markers and take English parts
  const parts = text.split(/[\u0B80-\u0BFF]+/);
  const english = parts
    .map(p => p.trim())
    .filter(p => p && /[A-Za-z]/.test(p))
    .join(' ');
  
  return english || text;
};

// Performance: Simple response caching
class ResponseCache {
  constructor(maxSize = 50) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

export const responseCache = new ResponseCache();

// Generate cache key from request
export const generateCacheKey = (systemPrompt, messages) => {
  const lastMessage = messages[messages.length - 1];
  return `${lastMessage?.content?.substring(0, 100)}`;
};
