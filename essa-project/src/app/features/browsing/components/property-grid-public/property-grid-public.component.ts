import {Component, inject} from '@angular/core';
import {TabsModule} from 'primeng/tabs';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MultiSelectModule} from 'primeng/multiselect';

import {
  PropertyGridCardComponent
} from '../../../../shared/components/property-grid-card/property-grid-card.component';
import {TabViewComponent} from '../../../../shared/components/tab-view/tab-view.component';
import {
  TagSelectMultipleComponent
} from '../../../../shared/components/tag-select-multiple/tag-select-multiple.component';
import {SearchBoxComponent} from '../../../../shared/components/search-box/search-box.component';
import {PropertyPublicStore} from '@core/store/property-public.store';

@Component({
  selector: 'app-property-grid-public',
  imports: [CommonModule, TranslateModule, TabsModule, IconFieldModule, InputIconModule, InputTextModule, PropertyGridCardComponent, MultiSelectModule, TabViewComponent, TagSelectMultipleComponent, SearchBoxComponent],
  templateUrl: './property-grid-public.component.html',
  styleUrl: './property-grid-public.component.scss'
})
export class PropertyGridPublicComponent {
  public propertyPublicStore = inject(PropertyPublicStore);

  private translateService: TranslateService = inject(TranslateService);

  tabs: { title: string; value: number; }[] = [];

  ngOnInit() {
    this.tabs = [
      {title: this.translateService.instant("General.Buttons.All"), value: 0},
    ];

    this.propertyPublicStore.loadAll();
  }
}
