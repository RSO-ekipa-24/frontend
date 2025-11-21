import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals';
import {inject} from '@angular/core';
import {AuthService} from '@core/auth/services/auth.service';

// Cache Entry Type
export type CacheEntry<T> = {
  key: string;
  data: T[];
  timestamp: number;
};

// Cache State Type
export type CacheState = {
  cacheEntry: CacheEntry<any> | null;
};

/**
 * Signal Store feature that adds in-memory caching for entities with user-specific localStorage.
 * @param config - Configuration for the cache
 * @param config.cacheKey - Unique key for the cache entry
 * @param config.maxAge - Maximum age of cache in seconds
 * @returns Signal Store feature with cache state and methods
 */
export function withEntityCache<T>({cacheKey, maxAge}: { cacheKey: string; maxAge: number }) {
  return signalStoreFeature(
    withState<CacheState>({cacheEntry: null}),
    withMethods((store) => {
      const authService = inject(AuthService); // Inject AuthService here
      return {
        /**
         * Get cached entities if they exist and are still valid for the current user.
         * @returns The cached entities or null if expired/missing
         */
        getCache: (): T[] | null => {
          const userId = authService.userId; // Get current userId
          const storageKey = `cache_${cacheKey}${userId}`; // User-specific storage key
          const cached = localStorage.getItem(storageKey);
          if (cached) {
            const entry: CacheEntry<T> = JSON.parse(cached);
            if (entry.key === cacheKey && Date.now() - entry.timestamp < maxAge * 1000) {
              return entry.data;
            }
          }
          return null; // Cache is missing or expired
        },
        /**
         * Store entities in the cache for the current user.
         * @param data - The entities to cache
         */
        setCache: (data: T[]) => {
          const userId = authService.userId; // Get current userId
          const storageKey = `cache_${cacheKey}${userId}`; // User-specific storage key
          const entry: CacheEntry<T> = {
            key: cacheKey,
            data,
            timestamp: Date.now(),
          };
          localStorage.setItem(storageKey, JSON.stringify(entry));
          patchState(store, {cacheEntry: entry});
        },
        /**
         * Clear the cache from localStorage and the store for the current user.
         */
        clearCache: () => {
          const userId = authService.userId; // Get current userId
          const storageKey = `cache_${cacheKey}${userId}`; // User-specific storage key
          localStorage.removeItem(storageKey);
          patchState(store, {cacheEntry: null});
        },
      };
    })
  );
}
