import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { FileMetadataResponse } from '../../features/admin/files/models/file.model';
import { FileService } from '../../features/admin/files/services/file.service';
import { withLoadingState } from '@core/store/extensions/loading';
import { withEntityCache } from '@core/store/extensions/entity-cache';

// Cache constants
const FILE_CACHE_KEY = 'user_files';
const CACHE_MAX_AGE = 2 * 60; // 2 minutes

type FilesState = {
  activeFiles: FileMetadataResponse[];
  deletedFiles: FileMetadataResponse[];
};

const initialState: FilesState = {
  activeFiles: [],
  deletedFiles: [],
};

export const FileStore = signalStore(
  { providedIn: 'root', protectedState: true },
  withState(initialState),
  withLoadingState(),
  withEntityCache<FileMetadataResponse>({ cacheKey: FILE_CACHE_KEY, maxAge: CACHE_MAX_AGE }),
  withComputed((store) => ({
    allActiveFiles: computed(() => store.activeFiles()),
    allDeletedFiles: computed(() => store.deletedFiles()),
    hasFiles: computed(() => store.activeFiles().length > 0),
    hasDeletedFiles: computed(() => store.deletedFiles().length > 0),
  })),
  withMethods((store) => {
    const fileService = inject(FileService);

    return {
      loadActiveFiles: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() => {
            const cached: FileMetadataResponse[] | null = store.getCache();
            if (cached) {
              patchState(store, {
                activeFiles: cached,
                isLoading: false,
                isLoaded: true,
              });
              return of(cached);
            }

            return fileService.getAllFiles().pipe(
              tapResponse({
                next: (files) => {
                  patchState(store, {
                    activeFiles: files,
                    isLoading: false,
                    isLoaded: true,
                    error: null,
                  });
                  store.setCache(files);
                },
                error: (error) => {
                  patchState(store, { isLoading: false, error });
                  store.clearCache();
                },
              })
            );
          })
        )
      ),

      loadDeletedFiles: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(() =>
            fileService.getDeletedFiles().pipe(
              tapResponse({
                next: (files) => patchState(store, { deletedFiles: files, isLoading: false }),
                error: (error) => patchState(store, { isLoading: false, error }),
              })
            )
          )
        )
      ),

      createFile: rxMethod<{
        file: File;
        fileName: string;
        propertyId?: string;
        tagNames?: string[];
        successCallback?: () => void;
        errorCallback?: () => void
      }>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap(({ file, fileName, propertyId, tagNames, successCallback, errorCallback }) =>
            fileService.uploadFile(file, fileName, propertyId, tagNames).pipe(
              switchMap((uploadResponse) =>
                fileService.getFileMetadata(uploadResponse.id)
              ),
              tapResponse({
                next: (newFile) => {
                  patchState(store, (state) => ({
                    activeFiles: [...state.activeFiles, newFile],
                    isLoading: false,
                    isLoaded: true,
                  }));
                  store.clearCache();
                  if (successCallback) successCallback();
                },
                error: (error) => {
                  patchState(store, { isLoading: false, error })
                  if (errorCallback) errorCallback();
                },
              })
            )
          )
        )
      ),

      deleteFile: rxMethod<{
        id: string;
        successCallback?: () => void;
        errorCallback?: () => void
      }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ id, successCallback, errorCallback }) =>
            fileService.deleteFile(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => {
                    const fileToDelete = state.activeFiles.find(f => f.id === id);
                    return {
                      activeFiles: state.activeFiles.filter((f) => f.id !== id),
                      deletedFiles: fileToDelete ? [...state.deletedFiles, fileToDelete] : state.deletedFiles,
                      isLoading: false
                    };
                  });
                  store.clearCache();
                  if (successCallback) successCallback();
                },
                error: (error) => {
                  patchState(store, { isLoading: false, error })
                  if (errorCallback) errorCallback();
                },
              })
            )
          )
        )
      ),

      restoreFile: rxMethod<{
        id: string;
        successCallback?: () => void;
        errorCallback?: () => void
      }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(({ id, successCallback, errorCallback }) =>
            fileService.restoreFile(id).pipe(
              tapResponse({
                next: () => {
                  patchState(store, (state) => {
                    const fileToRestore = state.deletedFiles.find(f => f.id === id);
                    return {
                      deletedFiles: state.deletedFiles.filter((f) => f.id !== id),
                      activeFiles: fileToRestore ? [...state.activeFiles, fileToRestore] : state.activeFiles,
                      isLoading: false
                    };
                  });
                  store.clearCache();
                  if (successCallback) successCallback();
                },
                error: (error) => {
                  patchState(store, { isLoading: false, error })
                  if (errorCallback) errorCallback();
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
      const cached: FileMetadataResponse[] | null = store.getCache();
      if (cached) {
        patchState(store, {
          activeFiles: cached,
          isLoading: false,
          isLoaded: true,
        });
      } else {
        store.loadActiveFiles();
      }
    },
  })
);
