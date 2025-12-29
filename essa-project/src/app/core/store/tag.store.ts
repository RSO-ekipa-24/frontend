import {patchState, signalStore, type, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {entityConfig, removeEntity, setAllEntities, setEntity, withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, of, pipe, switchMap, tap} from 'rxjs';
import {computed, inject} from '@angular/core';
import {tapResponse} from '@ngrx/operators';

import {Tag} from '../../features/admin/settings/tags/models/tag.model';
import {TagService} from '../../features/admin/settings/tags/services/tag.service';
import {withLoadingState} from './extensions/loading';
import {withEntityCache} from '@core/store/extensions/entity-cache';

// Constants
const TAG_COLLECTION = '_tag';
const TAG_CACHE_KEY = 'tag';
const CACHE_MAX_AGE = 5 * 60; // 5 minutes

const tagEntityConfig = entityConfig({
  entity: type<Tag>(),
  collection: TAG_COLLECTION,
  selectId: (tag) => tag.id,
});

// State Type
type TagState = {
  searchTerm: string;
};

// Initial State
const initialState: TagState = {
  searchTerm: '',
};

export const TagStore = signalStore(
  {providedIn: 'root', protectedState: true},
  withEntities({entity: type<Tag>(), collection: TAG_COLLECTION}),
  withState(initialState),
  withLoadingState(),
  withEntityCache<Tag>({cacheKey: TAG_CACHE_KEY, maxAge: CACHE_MAX_AGE}),
  withComputed(({_tagEntities, searchTerm, cacheEntry, isLoading, isLoaded, error}) => {
    // Memoized sorted tags
    const sortedTags = computed(() => {
      const tags = _tagEntities();
      return tags.length ? [...tags].sort((a, b) => a.name.localeCompare(b.name)) : tags;
    });

    return {
      filteredTags: computed(() => {
        const term = searchTerm()?.toLowerCase() ?? '';
        return term
          ? sortedTags().filter((tag) => tag.name.toLowerCase().includes(term))
          : sortedTags();
      }),
      tags: _tagEntities,
      isDataLoaded: computed(() => !!cacheEntry()),
      isLoading,
      isLoaded,
      error,
    };
  }),
  withMethods((store) => {
    const tagService = inject(TagService);

    return {
      updateSearchTerm: (searchTerm: string) => {
        if (store.searchTerm() !== searchTerm) {
          patchState(store, {searchTerm});
        }
      },

      load: rxMethod<void>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap(() => {
            const cachedTags = store.getCache();
            if (cachedTags) {
              if (cachedTags !== store._tagEntities()) {
                patchState(store, {
                  isLoading: false,
                  isLoaded: true,
                  error: null
                }, setAllEntities(cachedTags, tagEntityConfig));
              }
              return of(cachedTags);
            }
            return tagService.getAll().pipe(
              tapResponse({
                next: (tags) => {
                  patchState(store, {
                    isLoading: false,
                    isLoaded: true,
                    error: null
                  }, setAllEntities(tags, tagEntityConfig));
                  store.setCache(tags);
                },
                error: (error: unknown) => {
                  patchState(store, {isLoading: false, isLoaded: false, error});
                },
              })
            );
          })
        )
      ),

      deleteTag: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap((tagId) =>
            tagService.delete(tagId).pipe(
              tapResponse({
                next: () => {
                  patchState(
                    store,
                    {isLoading: false, isLoaded: true, error: null},
                    removeEntity(tagId, {collection: TAG_COLLECTION})
                  );
                  store.clearCache();
                },
                error: (error: unknown) => {
                  patchState(store, {isLoading: false, isLoaded: false, error});
                  store.clearCache();
                },
              })
            )
          )
        )
      ),

      createTag: rxMethod<{ tag: Tag; callback: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap(({tag, callback}) =>
            tagService.create(tag).pipe(
              tapResponse({
                next: (savedTag) => {
                  patchState(store, {
                    isLoading: false,
                    isLoaded: true,
                    error: null
                  }, setEntity(savedTag, tagEntityConfig));
                  callback();
                  store.clearCache();
                },
                error: (error: unknown) => {
                  patchState(store, {isLoading: false, isLoaded: false, error});
                  store.clearCache();
                },
              })
            )
          )
        )
      ),

      updateTag: rxMethod<{ tag: Tag; callback: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap(({tag, callback}) =>
            tagService.update(tag).pipe(
              tapResponse({
                next: (savedTag) => {
                  patchState(store, {
                    isLoading: false,
                    isLoaded: true,
                    error: null
                  }, setEntity(savedTag, tagEntityConfig));
                  callback();
                  store.clearCache();
                },
                error: (error: unknown) => {
                  patchState(store, {isLoading: false, isLoaded: false, error});
                  store.clearCache();
                },
              })
            )
          )
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      performance.mark('TagStore_Init_Start');
      const cachedTags = store.getCache();
      if (cachedTags) {
        patchState(store, {isLoading: false, isLoaded: true, error: null}, setAllEntities(cachedTags, tagEntityConfig));
      } else {
        store.load();
      }
      performance.mark('TagStore_Init_End');
      performance.measure('TagStore_Init', 'TagStore_Init_Start', 'TagStore_Init_End');
    },
  })
);
