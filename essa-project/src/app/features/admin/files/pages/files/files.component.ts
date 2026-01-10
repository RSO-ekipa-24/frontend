import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

import { FluidLayoutComponent } from '../../../../../shared/components/fluid-layout/fluid-layout.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FileGridComponent } from '../../components/file-grid/file-grid.component';
import { FileDialogComponent } from '../../components/file-dialog/file-dialog.component'; // <-- Add this

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SplitButtonModule,
    FluidLayoutComponent,
    PageHeaderComponent,
    FileGridComponent,
    FileDialogComponent,
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
})
export class FilesComponent {
  private translateService = inject(TranslateService);

  protected addFileDialogVisible = false;

  public gridActions: Signal<MenuItem[]> = computed(() => {
    return [
      {
        label: this.translateService.instant('Files.AddFile'), // e.g. "Add File"
        icon: 'pi pi-plus',
        command: () => {
          this.addFileDialogVisible = true;
        },
      },
    ];
  });

  constructor() {}
}
