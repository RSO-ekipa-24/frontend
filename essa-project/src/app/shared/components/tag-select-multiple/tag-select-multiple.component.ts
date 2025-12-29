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
  public selectedTags = input<Tag[]>([]);
  // Output signal for selected tag IDs changes
  public selectedTagsChange = output<Tag[]>();

  // Property for selected tags (used in MultiSelect)
  public currentTags: Tag[] = [];

  // Dialog visibility
  public addTagDialogVisible: boolean = false;

  // ControlValueAccessor callbacks
  private onChange: (value: Tag[]) => void = () => {
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
      const tagIds = this.selectedTags()?.map(x => x.id) || [];
      const availableTags = this.tagStore.filteredTags(); // ← this line is critical
      this.currentTags =  availableTags.filter((tag) => tagIds.includes(tag.id)) ?? [];
      console.log(tagIds)
      console.log(availableTags)
      console.log(this.currentTags)
    });
  }

  // Handle MultiSelect changes
  onTagsChange(tags: Tag[]) {
    this.selectedTagsChange.emit(tags);
    this.onChange(tags);
    this.onTouched();
  }

  // Open the add tag dialog
  openAddTagDialog() {
    this.addTagDialogVisible = true;
  }

  // ControlValueAccessor: Write value from form control
  writeValue(value: Tag[]): void {
    const tagIds = value?.map(x => x.id) || [];
    this.currentTags = this.tagStore.filteredTags().filter((tag) => tagIds?.includes(tag.id));
  }

  // ControlValueAccessor: Register change callback
  registerOnChange(fn: (value: Tag[]) => void): void {
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
