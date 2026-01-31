export const safeStorage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") {
      return fallback;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error("Storage read failed", error);
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage write failed", error);
    }
  },
  remove(key: string) {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage remove failed", error);
    }
  },
};
