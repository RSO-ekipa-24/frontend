import {
  Component,
  forwardRef,
  inject,
  input,
  output,
  effect,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import { PropertyStore } from '@core/store/property.store';
import {Property} from '../../../features/admin/properties/models/property.model';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-property-select-single',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    TranslateModule,
    Select,
  ],
  templateUrl: './property-select-single.component.html',
  styleUrl: './property-select-single.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PropertySelectSingleComponent),
      multi: true,
    },
  ],
})
export class PropertySelectSingleComponent implements ControlValueAccessor {
  selectedProperty = input<Property | null>(null);
  selectedPropertyChange = output<Property | null>();

  public currentProperty: Property | null = null;

  private onChange: (value: Property | null) => void = () => {};
  private onTouched: () => void = () => {};

  private isDisabled: boolean = false;

  propertyStore = inject(PropertyStore);

  constructor() {
    this.propertyStore.load();

    effect(() => {
      const selected = this.selectedProperty();
      const available = this.propertyStore.properties();

      if (selected) {
        this.currentProperty =
          available.find((p) => p.id === selected.id) || selected;
      } else {
        this.currentProperty = null;
      }
    });
  }

  onPropertyChange(property: Property | null) {
    this.currentProperty = property;

    this.selectedPropertyChange.emit(property);

    this.onChange(property);
    this.onTouched();
  }

  writeValue(value: Property | null): void {
    const available = this.propertyStore.properties();
    this.currentProperty =
      value ? available.find((p) => p.id === value.id) || value : null;
  }

  registerOnChange(fn: (value: Property | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
