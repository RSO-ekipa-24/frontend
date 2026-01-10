import {Component, computed, inject, model, signal, Signal} from '@angular/core';
import {TabViewComponent} from '../../../../../shared/components/tab-view/tab-view.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FileStore} from '@core/store/file.store';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {MenuItem, PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {StringToFormattedDateStringPipe} from '../../../../../shared/pipes/string-to-formatted-date-string.pipe';
import {BytesToMegabytesPipe} from '../../../../../shared/pipes/bytes-to-megabytes.pipe';
import {FileMetadataResponse} from '../../models/file.model';
import {FileService} from '../../services/file.service';
import {ToastService} from '../../../../../shared/services/toast.service';
import {DeleteDialogComponent} from '../../../../../shared/components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-file-grid',
  standalone: true,
  imports: [
    TabViewComponent,
    Button,
    Menu,
    PrimeTemplate,
    TableModule,
    TranslatePipe,
    StringToFormattedDateStringPipe,
    BytesToMegabytesPipe,
    DeleteDialogComponent
  ],
  templateUrl: './file-grid.component.html',
  styleUrl: './file-grid.component.scss'
})
export class FileGridComponent {
  private translateService: TranslateService = inject(TranslateService);
  fileStore = inject(FileStore);
  toastService = inject(ToastService);
  fileService = inject(FileService);

  tabs: { title: string; value: number; }[] = [];
  activeTab = model<number>(0);

  availableActiveFiles = computed(() => {
    return this.fileStore.activeFiles()?.filter(x => x.status == 'AVAILABLE');
  });

  availableDeletedFiles = computed(() => {
    return this.fileStore.deletedFiles();
  });

  public selectedFile: FileMetadataResponse | null = null;
  protected deleteFileDialogVisible = false;

  public gridActions: Signal<MenuItem[]> = computed(() => {
    if (this.activeTab() == 0) {
      return [
        {
          label: this.translateService.instant('General.Buttons.Download'),
          icon: 'pi pi-download',
          command: () => {
            const file = this.selectedFile;
            if (file) {
              this.fileService.downloadFile(file.id, file.fileName).subscribe({
                error: (err) =>
                  this.toastService.showErrorToast(this.translateService.instant('General.Buttons.Error'), this.translateService.instant('Files.DownloadFileErrorMessage'))
              });
            }
          }
        },
        {
          label: this.translateService.instant('Files.MoveToTrash'),
          icon: 'pi pi-trash',
          command: () => {
            this.deleteFileDialogVisible = true;
          }
        }
      ]
    } else {
      return [
        {
          label: this.translateService.instant('General.Buttons.Restore'),
          icon: 'pi pi-sync',
          command: () => {
            this.restoreSelectedFile();
          }
        },
      ]
    }
  });

  ngOnInit() {
    this.tabs = [
      { title: this.translateService.instant('Files.Active'), value: 0 },
      { title: this.translateService.instant('Files.Trash'), value: 1 },
    ];

    this.fileStore.loadDeletedFiles();
    this.fileStore.loadActiveFiles();
  }

  deleteSelectedFile() {
    this.deleteFileDialogVisible = false;
    this.fileStore.deleteFile({
      id: this.selectedFile?.id ?? '',
      successCallback: () => {
        this.toastService.showSuccessToast(this.translateService.instant('General.Buttons.Success'), this.translateService.instant('Files.MoveFileToTrashSuccessMessage'));
      },
      errorCallback: () => {
        this.toastService.showErrorToast(this.translateService.instant('General.Buttons.Error'), this.translateService.instant('Files.MoveFileToTrashErrorMessage'));
      },
    });
  }

  restoreSelectedFile() {
    this.fileStore.restoreFile({
      id: this.selectedFile?.id ?? '',
      successCallback: () => {
        this.toastService.showSuccessToast(this.translateService.instant('General.Buttons.Success'), this.translateService.instant('Files.RestoreFileSuccessMessage'));
      },
      errorCallback: () => {
        this.toastService.showErrorToast(this.translateService.instant('General.Buttons.Error'), this.translateService.instant('Files.RestoreFileErrorMessage'));
      },
    });
  }
}
