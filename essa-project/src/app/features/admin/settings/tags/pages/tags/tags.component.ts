import {Component, inject} from '@angular/core';
import {FluidLayoutComponent} from "../../../../../../shared/components/fluid-layout/fluid-layout.component";
import {PageHeaderComponent} from "../../../../../../shared/components/page-header/page-header.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Button} from 'primeng/button';

@Component({
  selector: 'app-tags',
  imports: [
    FluidLayoutComponent,
    PageHeaderComponent,
    TranslatePipe,
    Button
  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
  private translateService: TranslateService = inject(TranslateService);

  constructor() {
  }
}
