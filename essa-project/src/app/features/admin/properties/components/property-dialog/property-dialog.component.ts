import {Component, effect, inject, input, output, viewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {PropertyStore} from '@core/store/property.store';
import {Property} from '../../models/property.model';
import {
  TagSelectMultipleComponent
} from '../../../../../shared/components/tag-select-multiple/tag-select-multiple.component';
import {FileUploadComponent} from '../../../../../shared/components/file-upload/file-upload.component';
import {FileUploadChange} from '../../../../../shared/models/file.model';
import {ToastService} from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-property-dialog',
  standalone: true,
  imports: [
    DialogModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    TagSelectMultipleComponent,
    FileUploadComponent
  ],
  templateUrl: './property-dialog.component.html',
  styleUrls: ['./property-dialog.component.scss'],
})
export class PropertyDialogComponent {
  file = viewChild<FileUploadComponent>('file');

  visible = input<boolean>(false);
  visibleChange = output<boolean>();

  header = input<string>('Settings.Properties.AddProperty');

  property = input<Property | null>({id: '', name: '', description: '', tags: [], images: []});

  protected isVisible = false;
  protected propertyForm: FormGroup;
  protected isEditMode = false;

  private translateService = inject(TranslateService);
  private propertyStore = inject(PropertyStore);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  constructor() {
    this.propertyForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      tags: [[]],
      existingImages: [[]],
      newImages: [[]],
    });

    effect(() => {
      this.isVisible = this.visible();

      const property = this.property() ?? {id: '', name: '', description: '', tags: [], images: []};
      this.isEditMode = property.id !== '';

      this.propertyForm.patchValue({
        id: property.id,
        name: property.name,
        description: property.description ?? '',
        tags: property.tags ?? [],
        existingImages: property.images ?? [],
        newImages: [[]],
      });
    });
  }

  onImagesSelected(files: FileUploadChange) {
    this.propertyForm.get('existingImages')?.setValue(files.items);
    this.propertyForm.get('newImages')?.setValue(files.addedFiles);
  }

  onHide() {
    this.isVisible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  saveProperty() {
    if (this.propertyForm.valid) {
      const propertyData = this.propertyForm.value;

      if (propertyData.id === '') {
        this.propertyStore.createProperty({
          property: propertyData,
          files: this.propertyForm.value.newImages,
          callback: () => {
            this.toastService.showSuccessToast(this.translateService.instant('General.Buttons.Success'), this.translateService.instant('Properties.CreatePropertySuccessMessage'));
            this.onHide();
          },
        });
      } else {
        this.propertyStore.updateProperty({
          property: propertyData,
          addedFiles: this.propertyForm.value.newImages,
          items: this.propertyForm.value.existingImages,
          callback: () => {
            this.toastService.showSuccessToast(this.translateService.instant('General.Buttons.Success'), this.translateService.instant('Properties.UpdatePropertySuccessMessage'));
            this.onHide();
          },
        });
      }
    }
  }

  private resetForm() {
    this.propertyForm.reset({
      id: '',
      name: '',
      description: '',
      tags: [],
      images: [],
    });
    this.file()?.reset();
  }
}
