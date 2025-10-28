import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class CacheService {
  static async get(key) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('CacheService.get error:', e?.message || e);
      return null;
    }
  }

  static async set(key, data, ttlMs = DEFAULT_TTL_MS) {
    try {
      const payload = { data, timestamp: Date.now(), ttlMs };
      await AsyncStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      console.warn('CacheService.set error:', e?.message || e);
    }
  }

  static isFresh(entry) {
    if (!entry) return false;
    const age = Date.now() - (entry.timestamp || 0);
    const ttl = entry.ttlMs || DEFAULT_TTL_MS;
    return age < ttl;
  }

  static async fetchWithCache(key, apiUrl, options = {}) {
    const { ttlMs = DEFAULT_TTL_MS, transform } = options;
    try {
      const cached = await CacheService.get(key);
      if (CacheService.isFresh(cached)) {
        return cached.data;
      }

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data = await res.json();
      if (typeof transform === 'function') {
        data = transform(data);
      }
      await CacheService.set(key, data, ttlMs);
      return data;
    } catch (e) {
      console.warn('CacheService.fetchWithCache error:', e?.message || e);
      // Fallback to stale cache if available
      const stale = await CacheService.get(key);
      return stale ? stale.data : null;
    }
  }

  static async clear(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('CacheService.clear error:', e?.message || e);
    }
  }
}

export default CacheService;


