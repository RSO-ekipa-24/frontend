import {Component, inject} from '@angular/core';
import {FluidLayoutComponent} from "../../../../../../shared/components/fluid-layout/fluid-layout.component";
import {PageHeaderComponent} from "../../../../../../shared/components/page-header/page-header.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {TagGridComponent} from '../../components/tag-grid/tag-grid.component';
import {TagDialogComponent} from '../../components/tag-dialog/tag-dialog.component';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-tags',
  imports: [
    FluidLayoutComponent,
    PageHeaderComponent,
    TranslatePipe,
    TagGridComponent,
    TagDialogComponent,
    Button
  ],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
  private translateService: TranslateService = inject(TranslateService);

  protected addTagDialogVisible = false;

  constructor() {
  }

  openAddTagDialog() {
    this.addTagDialogVisible = true;
  }
}
