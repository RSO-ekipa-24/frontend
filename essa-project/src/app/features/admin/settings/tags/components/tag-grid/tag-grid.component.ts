import {Component, computed, inject, Signal} from '@angular/core';
import {TabViewComponent} from '../../../../../../shared/components/tab-view/tab-view.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {TagStore} from '@core/store/tag.store';
import {TagComponent} from '../../../../../../shared/components/tag/tag.component';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {TagDialogComponent} from '../tag-dialog/tag-dialog.component';
import {MenuItem} from 'primeng/api';
import {Tag} from '../../models/tag.model';
import {DeleteDialogComponent} from '../../../../../../shared/components/delete-dialog/delete-dialog.component';
import {SearchBoxComponent} from '../../../../../../shared/components/search-box/search-box.component';

@Component({
  selector: 'app-tag-grid',
  imports: [
    TabViewComponent,
    TableModule,
    TranslatePipe,
    TagComponent,
    Button,
    Menu,
    TagDialogComponent,
    DeleteDialogComponent,
    SearchBoxComponent
  ],
  templateUrl: './tag-grid.component.html',
  styleUrl: './tag-grid.component.scss'
})
export class TagGridComponent {
  public tagStore = inject(TagStore)

  private translateService: TranslateService = inject(TranslateService);

  public selectedTag: Tag = {id: '', name: '', color: ''};
  protected editTagDialogVisible = false;
  protected deleteTagDialogVisible = false;

  public gridActions: Signal<MenuItem[]> = computed(() => {
    return [
      {
        label: this.translateService.instant('General.Buttons.Edit'),
        icon: 'pi pi-pencil',
        command: () => {
          this.editTagDialogVisible = true;
        }
      },
      {
        label: this.translateService.instant('General.Buttons.Delete'),
        icon: 'pi pi-trash',
        command: () => {
          this.deleteTagDialogVisible = true;
        }
      }
    ]
  });

  ngOnInit() {
    this.tagStore.load();
  }

  deleteSelectedTag() {
    this.tagStore.deleteTag(this.selectedTag.id);
  }
}
