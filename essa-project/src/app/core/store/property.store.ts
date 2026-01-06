import {patchState, signalStore, type, withComputed, withHooks, withMethods, withState} from '@ngrx/signals';
import {entityConfig, removeEntity, setAllEntities, setEntity, withEntities} from '@ngrx/signals/entities';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, map, of, pipe, switchMap, tap, forkJoin} from 'rxjs';
import {computed, inject} from '@angular/core';
import {tapResponse} from '@ngrx/operators';

import {Property} from '../../features/admin/properties/models/property.model';
import {PropertyService} from '../../features/admin/properties/services/property.service';
import {withLoadingState} from './extensions/loading';
import {withEntityCache} from '@core/store/extensions/entity-cache';
import {ImageService} from '../../shared/services/image.service';
import {replaceLod} from '../../shared/utils/file.utils';
import {ImagePreviewResponse} from '../../shared/models/file.model';

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
    const imageService = inject(ImageService);

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
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() => propertyService.getPersonal()),
          switchMap((properties) => {
            if (properties.length === 0) return of([]);

            const propertyWithImages$ = properties.map(prop =>
              imageService.getImagesForProperty(Number(prop.id)).pipe(
                map(images => ({
                  ...prop,
                  images: images.map(img => ({
                    ...img,
                    imageUrl: replaceLod(img.imageUrl, 'LOW')
                  }))
                }))
              )
            );
            return forkJoin(propertyWithImages$);
          }),
          tapResponse({
            next: (properties) => {
              patchState(store, { isLoading: false, isLoaded: true }, setAllEntities(properties, propertyEntityConfig));
              store.setCache(properties);
            },
            error: (error) => patchState(store, { isLoading: false, error }),
          })
        )
      ),

      deleteProperty: rxMethod<{ propertyId: string; callback?: () => void }>(
        pipe(
          tap(() =>
            patchState(store, { isLoading: true, isLoaded: false, error: null })
          ),
          switchMap(({ propertyId, callback = () => {} }) =>
            imageService.deleteImagesOfProperty(Number(propertyId)).pipe(
              switchMap(() => propertyService.delete(propertyId)),
              tapResponse({
                next: () => {
                  patchState(
                    store,
                    { isLoading: false, isLoaded: true, error: null },
                    removeEntity(propertyId, { collection: PROPERTY_COLLECTION })
                  );
                  store.clearCache();
                  callback();
                },
                error: (error: unknown) => {
                  patchState(store, { isLoading: false, isLoaded: false, error });
                  store.clearCache();
                  callback();
                },
              })
            )
          )
        )
      ),

      createProperty: rxMethod<{ property: Property; files: File[]; callback: () => void }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ property, files, callback }) =>
            propertyService.create(property).pipe(
              switchMap((newProp) => {
                if (files.length === 0) return of({ ...newProp, images: [] });

                const uploads = files.map(file => imageService.uploadImage(file, newProp.id));
                return forkJoin(uploads).pipe(
                  switchMap(() => imageService.getImagesForProperty(Number(newProp.id))),
                  map(images => ({ ...newProp, images }))
                );
              }),
              tapResponse({
                next: (fullProperty) => {
                  patchState(store, { isLoading: false }, setEntity(fullProperty, propertyEntityConfig));
                  store.clearCache();
                  callback();
                },
                error: (error) => patchState(store, { isLoading: false, error }),
              })
            )
          )
        )
      ),

      updateProperty: rxMethod<{
        property: Property;
        addedFiles: File[];
        items: any[];
        callback: () => void;
      }>(
        pipe(
          tap(() =>
            patchState(store, { isLoading: true, isLoaded: false, error: null })
          ),

          switchMap(({ property, addedFiles, items, callback }) =>
            propertyService.update(property).pipe(
              switchMap((savedProperty) => {
                const currentImages =
                  store.properties().find(p => p.id === savedProperty.id)?.images ?? [];

                const keptImageIds = new Set(
                  items
                    .filter((r): r is { id: number | string } => r.id != null)
                    .map(r => r.id)
                );

                const deleted = currentImages.filter(img => !keptImageIds.has(img.id));

                const delete$ = deleted.length > 0
                  ? forkJoin(deleted.map(img => imageService.deleteImage(img.id)))
                  : of(null);

                const filesToUpload: File[] = addedFiles
                  .flat()
                  .filter((file): file is File => file instanceof File && file.size > 0);

                const upload$ = filesToUpload.length > 0
                  ? forkJoin(
                    filesToUpload.map(file =>
                      imageService.uploadImage(file, savedProperty.id)
                    )
                  ).pipe(
                    switchMap(() =>
                      imageService.getImagesForProperty(Number(savedProperty.id))
                    )
                  )
                  : of(items);

                return forkJoin([delete$, upload$]).pipe(
                  map(([, images]) => ({
                    ...savedProperty,
                    images
                  }))
                );
              }),

              tapResponse({
                next: (fullProperty) => {
                  patchState(
                    store,
                    { isLoading: false, isLoaded: true, error: null },
                    setEntity(fullProperty, propertyEntityConfig)
                  );
                  store.clearCache();
                  callback();
                },
                error: (error) => {
                  patchState(store, { isLoading: false, isLoaded: false, error });
                  store.clearCache();
                }
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
