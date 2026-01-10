import {
  Component,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { PropertySelectSingleComponent } from '../../../../../shared/components/property-select-single/property-select-single.component';
import { TagSelectMultipleComponent } from '../../../../../shared/components/tag-select-multiple/tag-select-multiple.component';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FileUploadChange } from '../../../files/models/file.model';
import { FileMetadataResponse } from '../../../files/models/file.model';

import {FileStore} from '@core/store/file.store';
import { PropertyStore } from '@core/store/property.store';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-file-dialog',
  standalone: true,
  imports: [
    DialogModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    PropertySelectSingleComponent,
    TagSelectMultipleComponent,
    FileUploadComponent,
  ],
  templateUrl: './file-dialog.component.html',
  styleUrls: ['./file-dialog.component.scss'],
})
export class FileDialogComponent {
  fileUpload = viewChild<FileUploadComponent>('fileUpload');

  file = input<FileMetadataResponse | null>(null);
  header = input<string>('Files.AddFile');
  visible = input<boolean>(false);
  visibleChange = output<boolean>();

  protected fileForm: FormGroup;
  protected isVisible = false;
  protected isViewOnly = false;

  translateService = inject(TranslateService);
  fileStore = inject(FileStore);
  propertyStore = inject(PropertyStore);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  constructor() {
    this.fileForm = this.fb.group({
      fileName: ['', Validators.required],
      property: [null],
      tags: [[]],
      uploadFile: [[], Validators.required],
    });

    effect(() => {
      this.isVisible = this.visible();

      const currentFile = this.file();
      this.isViewOnly = !!currentFile;

      if (this.isViewOnly && currentFile) {
        this.fileForm.patchValue({
          fileName: currentFile.fileName,
          tags: currentFile.tags ?? [],
        });

        this.fileForm.disable();
      } else {
        this.resetForm();
        this.fileForm.enable();
      }
    });
  }

  onFilesSelected(change: FileUploadChange) {
    this.fileForm.get('uploadFile')?.setValue(change.addedFiles[0]);
  }

  onHide() {
    this.isVisible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  saveFile() {
    if (this.fileForm.invalid || this.isViewOnly) return;

    this.fileStore.createFile({
      file: this.fileForm.value.uploadFile,
      fileName: this.fileForm.value.fileName,
      propertyId: this.fileForm.value.property.id,
      successCallback: () => {
        this.toastService.showSuccessToast(this.translateService.instant('General.Buttons.Success'), this.translateService.instant('Files.CreateFileSuccessMessage'));
        this.onHide();
      },
      errorCallback: () => {
        this.toastService.showErrorToast(this.translateService.instant('General.Buttons.Error'), this.translateService.instant('Files.CreateFileErrorMessage'));
        this.onHide();
      },
    });
  }

  private resetForm() {
    this.fileForm.reset({
      fileName: '',
      property: null,
      tags: [],
      uploadFiles: [],
    });
    this.fileUpload()?.reset();
  }
}
