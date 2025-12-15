import {Component, computed, inject, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';

import {PropertyGridComponent} from '../../components/property-grid/property-grid.component';
import {PageHeaderComponent} from '../../../../../shared/components/page-header/page-header.component';
import {FluidLayoutComponent} from '../../../../../shared/components/fluid-layout/fluid-layout.component';
import {PropertyDialogComponent} from "../../components/property-dialog/property-dialog.component";

@Component({
  selector: 'app-properties',
  imports: [CommonModule, TranslateModule, SplitButtonModule, PropertyGridComponent, PageHeaderComponent, FluidLayoutComponent, PropertyDialogComponent],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  private translateService = inject(TranslateService);

  tabs: { title: string; value: number; content: string }[] = [];

  protected addPropertyDialogVisible = false;

  public gridActions: Signal<MenuItem[]> = computed(() => {
    return [
      {
        label: this.translateService.instant('Properties.AddProperty'),
        icon: 'pi pi-plus',
        command: () => {
          this.addPropertyDialogVisible = true;
        }
      }
    ]
  });

  constructor() {
  }
}
