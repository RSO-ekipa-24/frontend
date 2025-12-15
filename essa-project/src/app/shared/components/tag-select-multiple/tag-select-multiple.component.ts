import {Component, effect, forwardRef, inject, input, output} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {ButtonModule} from 'primeng/button';
import {TagStore} from '@core/store/tag.store';
import {Tag} from '../../../features/admin/settings/tags/models/tag.model';
import {TagComponent} from '../tag/tag.component';
import {TranslateModule} from '@ngx-translate/core';
import {TagDialogComponent} from '../../../features/admin/settings/tags/components/tag-dialog/tag-dialog.component';

@Component({
  selector: 'app-tag-select-multiple',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    TagComponent,
    TagDialogComponent,
  ],
  templateUrl: './tag-select-multiple.component.html',
  styleUrls: ['./tag-select-multiple.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagSelectMultipleComponent),
      multi: true,
    },
  ],
})
export class TagSelectMultipleComponent implements ControlValueAccessor {
  public tagStore = inject(TagStore);

  // Input signal for selected tag IDs
  public selectedTagIds = input<string[]>([]);
  // Output signal for selected tag IDs changes
  public selectedTagIdsChange = output<string[]>();

  // Property for selected tags (used in MultiSelect)
  public selectedTags: Tag[] = [];

  // Dialog visibility
  public addTagDialogVisible: boolean = false;

  // ControlValueAccessor callbacks
  private onChange: (value: string[]) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  // Track disabled state
  private isDisabled: boolean = false;

  constructor() {
    // Ensure tags are loaded
    this.tagStore.load();

    // Sync selectedTags with selectedTagIds changes
    effect(() => {
      const tagIds = this.selectedTagIds() || [];
      this.selectedTags = this.tagStore.filteredTags().filter((tag) => tagIds.includes(tag.id));
    });
  }

  // Handle MultiSelect changes
  onTagsChange(tags: Tag[]) {
    const tagIds = tags.map((tag) => tag.id);
    this.selectedTagIdsChange.emit(tagIds);
    this.onChange(tagIds);
    this.onTouched();
  }

  // Open the add tag dialog
  openAddTagDialog() {
    this.addTagDialogVisible = true;
  }

  // ControlValueAccessor: Write value from form control
  writeValue(value: string[]): void {
    this.selectedTags = this.tagStore.filteredTags().filter((tag) => value?.includes(tag.id));
  }

  // ControlValueAccessor: Register change callback
  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  // ControlValueAccessor: Register touched callback
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // ControlValueAccessor: Set disabled state
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
