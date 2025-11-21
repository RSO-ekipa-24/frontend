import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals';

// Loading State Type
export type LoadingState = {
  isLoading: boolean;
  isLoaded: boolean;
  error: unknown | null;
};

/**
 * Signal Store feature that adds loading state management.
 * @returns Signal Store feature with loading state and methods
 */
export function withLoadingState() {
  return signalStoreFeature(
    withState<LoadingState>({isLoading: false, isLoaded: false, error: null}),
    withMethods((store) => ({
      /**
       * Sets the loading state to true, clearing loaded and error states.
       */
      setLoading: () => patchState(store, {isLoading: true, isLoaded: false, error: null}),
      /**
       * Sets the loaded state to true, clearing loading and error states.
       */
      setLoaded: () => patchState(store, {isLoading: false, isLoaded: true, error: null}),
      /**
       * Sets the error state, clearing loading and loaded states.
       * @param error - The error to store
       */
      setError: (error: unknown) => patchState(store, {isLoading: false, isLoaded: false, error}),
    }))
  );
}
