import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {PropertyStore} from '@core/store/property.store';
import {Property} from '../../models/property.model';
import {
  TagSelectMultipleComponent
} from '../../../../../shared/components/tag-select-multiple/tag-select-multiple.component';
import {FileUploadComponent} from '../../../../../shared/components/file-upload/file-upload.component';

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
    FileUploadComponent,
  ],
  templateUrl: './property-dialog.component.html',
  styleUrls: ['./property-dialog.component.scss'],
})
export class PropertyDialogComponent {
  visible = input<boolean>(false);
  visibleChange = output<boolean>();

  header = input<string>('Settings.Properties.AddProperty');

  property = input<Property | null>({id: '', name: '', description: '', tags: []});

  protected isVisible = false;
  protected propertyForm: FormGroup;
  protected isEditMode = false;

  private propertyStore = inject(PropertyStore);
  private fb = inject(FormBuilder);

  constructor() {
    this.propertyForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: [''],
      tags: [[]],
      images: [[]], // <-- new form control to hold File[]
    });

    effect(() => {
      this.isVisible = this.visible();

      const property = this.property() ?? {id: '', name: '', description: '', tags: []};
      this.isEditMode = property.id !== '';

      console.log(property)

      this.propertyForm.patchValue({
        id: property.id,
        name: property.name,
        description: property.description ?? '',
        tags: property.tags ?? [],
        images: [],
      });
    });
  }

  // Called by app-file-upload when files change
  onImagesSelected(files: File[]) {
    this.propertyForm.get('images')?.setValue(files);
  }

  onHide() {
    this.isVisible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  saveProperty() {
    if (this.propertyForm.valid) {
      const propertyData = this.propertyForm.value;
      console.log('Saving property with images:', propertyData);

      if (propertyData.id === '') {
        this.propertyStore.createProperty({
          property: propertyData,
          callback: () => this.onHide(),
        });
      } else {
        this.propertyStore.updateProperty({
          property: propertyData,
          callback: () => this.onHide(),
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
  }
}
