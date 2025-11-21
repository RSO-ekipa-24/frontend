import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SplitButtonModule} from 'primeng/splitbutton';

import {PageHeaderComponent} from '../../../../../shared/components/page-header/page-header.component';
import {FluidLayoutComponent} from '../../../../../shared/components/fluid-layout/fluid-layout.component';

@Component({
  selector: 'app-properties',
  imports: [CommonModule, TranslateModule, SplitButtonModule, PageHeaderComponent, FluidLayoutComponent],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent {
  private translateService = inject(TranslateService);

  constructor() {
  }
}
