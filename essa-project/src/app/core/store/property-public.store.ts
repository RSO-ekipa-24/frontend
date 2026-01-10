import { patchState, signalStore, type, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { entityConfig, setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, of, pipe, switchMap, tap, forkJoin } from 'rxjs';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';

import { Property } from '../../features/admin/properties/models/property.model';
import { PropertyService } from '../../features/admin/properties/services/property.service';
import { withLoadingState } from './extensions/loading';
import { ImageService } from '../../shared/services/image.service';
import { replaceLod } from '../../shared/utils/file.utils';

const PUBLIC_PROPERTY_COLLECTION = '_publicProperty';

const publicPropertyEntityConfig = entityConfig({
  entity: type<Property>(),
  collection: PUBLIC_PROPERTY_COLLECTION,
  selectId: (property) => property.id,
});

export const PropertyPublicStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withEntities({ entity: type<Property>(), collection: PUBLIC_PROPERTY_COLLECTION }),
  withState({ searchTerm: '' }),
  withLoadingState(),
  withComputed(({ _publicPropertyEntities, searchTerm, isLoading, isLoaded, error }) => {
    return {
      // Logic for the public browsing grid
      filteredProperties: computed(() => {
        const term = searchTerm()?.toLowerCase() ?? '';
        const properties = _publicPropertyEntities();
        return term
          ? properties.filter((p) => p.name.toLowerCase().includes(term))
          : properties;
      }),
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
        patchState(store, { searchTerm });
      },

      loadAll: rxMethod<void>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true, error: null })),
          // Call the new getAll endpoint
          switchMap(() => propertyService.getAll()),
          switchMap((properties) => {
            if (properties.length === 0) return of([]);

            // Fetch images for every public property found
            const propertyWithImages$ = properties.map(prop =>
              imageService.getImagesForProperty(Number(prop.id)).pipe(
                map(images => ({
                  ...prop,
                  images: images.map(img => ({
                    ...img,
                    imageUrl: replaceLod(img.imageUrl, 'LOW') // Use low-res for the grid
                  }))
                }))
              )
            );
            return forkJoin(propertyWithImages$);
          }),
          tapResponse({
            next: (properties) => {
              patchState(
                store,
                { isLoading: false, isLoaded: true },
                setAllEntities(properties, publicPropertyEntityConfig)
              );
            },
            error: (error) => patchState(store, { isLoading: false, error }),
          })
        )
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  })
);
