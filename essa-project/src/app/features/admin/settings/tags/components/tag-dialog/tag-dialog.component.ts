import {Component, effect, inject, input, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {TranslateModule} from '@ngx-translate/core';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TagStore} from '@core/store/tag.store';
import {Tag} from '../../models/tag.model';

@Component({
  selector: 'app-tag-dialog',
  standalone: true,
  imports: [
    DialogModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ColorPickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './tag-dialog.component.html',
  styleUrls: ['./tag-dialog.component.scss'],
})
export class TagDialogComponent {
  visible = input<boolean>(false);
  visibleChange = output<boolean>();

  header = input<string>('Settings.Tags.AddTag');

  tag = input<Tag>({id: '', name: '', color: '#000000'});

  protected isVisible = false;
  protected tagForm: FormGroup;
  protected isEditMode = false;

  private tagStore = inject(TagStore);
  private fb = inject(FormBuilder);

  constructor() {
    this.tagForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      color: ['#000000'],
    });

    effect(() => {
      this.isVisible = this.visible();

      const tag = this.tag();
      this.isEditMode = tag.id !== '';
      this.tagForm.setValue({
        id: tag.id,
        name: tag.name,
        color: tag.color ?? '#000000',
      });
    });
  }

  onHide() {
    this.isVisible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  saveTag() {
    if (this.tagForm.valid) {
      const tagData = this.tagForm.value;
      if (tagData.id == '') {
        this.tagStore.createTag({
          tag: tagData,
          callback: () => {
            this.onHide();
          },
        });
      } else {
        this.tagStore.updateTag({
          tag: tagData,
          callback: () => {
            this.onHide();
          },
        });
      }
    }
  }

  private resetForm() {
    this.tagForm.reset({id: 0, name: '', color: '#000000'});
  }
}
