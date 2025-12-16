import {Component, ContentChild, inject, input, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tab-view',
  standalone: true,
  imports: [
    CommonModule,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
  ],
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent<T extends Record<string, any>> {
  private translateService: TranslateService = inject(TranslateService);

  placeholderTab = [
    {title: this.translateService.instant("General.Buttons.All"), value: 0},
  ];
  tabs = input<T[]>(this.placeholderTab as unknown as T[]);
  activeTab = input(0);
  rounded = input<boolean>(false)

  titleProperty = input<string>('title'); // Default property name for tab title

  @ContentChild('tab') tabTemplateRef?: TemplateRef<{ $implicit: T }>;
  @ContentChild('toolbar') toolbarTemplateRef?: TemplateRef<any>;
  @ContentChild('content') contentTemplateRef?: TemplateRef<{ $implicit: T }>;
}
