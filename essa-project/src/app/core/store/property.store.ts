import {patchState, signalStore, type, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {entityConfig, removeEntity, setAllEntities, setEntity, withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, of, pipe, switchMap, tap} from 'rxjs';
import {computed, inject} from '@angular/core';
import {tapResponse} from '@ngrx/operators';

import {Property} from '../../features/admin/properties/models/property.model';
import {PropertyService} from '../../features/admin/properties/services/property.service';
import {withLoadingState} from './extensions/loading';
import {withEntityCache} from '@core/store/extensions/entity-cache';

// Constants
const PROPERTY_COLLECTION = '_property';
const PROPERTY_CACHE_KEY = 'property';
const CACHE_MAX_AGE = 5 * 60; // 5 minutes

const propertyEntityConfig = entityConfig({
  entity: type<Property>(),
  collection: PROPERTY_COLLECTION,
  selectId: (property) => property.id,
});

// State Type
type PropertyState = {
  searchTerm: string;
};

// Initial State
const initialState: PropertyState = {
  searchTerm: '',
};

export const PropertyStore = signalStore(
  {providedIn: 'root', protectedState: true},
  withEntities({entity: type<Property>(), collection: PROPERTY_COLLECTION}),
  withState(initialState),
  withLoadingState(),
  withEntityCache<Property>({cacheKey: PROPERTY_CACHE_KEY, maxAge: CACHE_MAX_AGE}),
  withComputed(({_propertyEntities, searchTerm, cacheEntry, isLoading, isLoaded, error}) => {
    // Memoized sorted properties
    const sortedProperties = computed(() => {
      const properties = _propertyEntities();
      return properties.length ? [...properties].sort((a, b) => a.name.localeCompare(b.name)) : properties;
    });

    return {
      filteredProperties: computed(() => {
        const term = searchTerm()?.toLowerCase() ?? '';
        return term
          ? sortedProperties().filter((property) => property.name.toLowerCase().includes(term))
          : sortedProperties();
      }),
      properties: _propertyEntities,
      isDataLoaded: computed(() => !!cacheEntry()),
      isLoading,
      isLoaded,
      error,
    };
  }),
  withMethods((store) => {
    const propertyService = inject(PropertyService);

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
            const cachedProperties = store.getCache();
            if (cachedProperties) {
              if (cachedProperties !== store._propertyEntities()) {
                patchState(store, {
                  isLoading: false,
                  isLoaded: true,
                  error: null,
                }, setAllEntities(cachedProperties, propertyEntityConfig));
              }
              return of(cachedProperties);
            }
            return propertyService.getPersonal().pipe(
              tapResponse({
                next: (properties) => {
                  patchState(store, {
                    isLoading: false,
                    isLoaded: true,
                    error: null,
                  }, setAllEntities(properties, propertyEntityConfig));
                  store.setCache(properties);
                },
                error: (error: unknown) => {
                  patchState(store, {isLoading: false, isLoaded: false, error});
                },
              })
            );
          })
        )
      ),

      deleteProperty: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap((propertyId) =>
            propertyService.delete(propertyId).pipe(
              tapResponse({
                next: () => {
                  patchState(
                    store,
                    {isLoading: false, isLoaded: true, error: null},
                    removeEntity(propertyId, {collection: PROPERTY_COLLECTION})
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

      createProperty: rxMethod<{ property: Property; callback: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap(({property, callback}) =>
            propertyService.create(property).pipe(
              tapResponse({
                next: (savedProperty) => {
                  patchState(store, {
                    isLoading: false,
                    isLoaded: true,
                    error: null,
                  }, setEntity(savedProperty, propertyEntityConfig));
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

      updateProperty: rxMethod<{ property: Property; callback: () => void }>(
        pipe(
          tap(() => patchState(store, {isLoading: true, isLoaded: false, error: null})),
          switchMap(({property, callback}) =>
            propertyService.update(property).pipe(
              tapResponse({
                next: (savedProperty) => {
                  patchState(store, {
                    isLoading: false,
                    isLoaded: true,
                    error: null,
                  }, setEntity(savedProperty, propertyEntityConfig));
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
      performance.mark('PropertyStore_Init_Start');
      const cachedProperties = store.getCache();
      if (cachedProperties) {
        patchState(store, {
          isLoading: false,
          isLoaded: true,
          error: null
        }, setAllEntities(cachedProperties, propertyEntityConfig));
      } else {
        store.load();
      }
      performance.mark('PropertyStore_Init_End');
      performance.measure('PropertyStore_Init', 'PropertyStore_Init_Start', 'PropertyStore_Init_End');
    },
  })
);
