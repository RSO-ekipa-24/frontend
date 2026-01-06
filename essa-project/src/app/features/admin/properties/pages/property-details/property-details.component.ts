import {Component, OnDestroy, OnInit, inject, Signal, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject, takeUntil, filter, combineLatest } from 'rxjs';
import { computed } from '@angular/core';

import { FluidLayoutComponent } from '../../../../../shared/components/fluid-layout/fluid-layout.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { SplitButton } from 'primeng/splitbutton';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import { PropertyStore } from '@core/store/property.store';
import {DeleteDialogComponent} from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import {ToastService} from '../../../../../shared/services/toast.service';
import {PropertyDialogComponent} from '../../components/property-dialog/property-dialog.component';
import {PropertyDetailsDataComponent} from '../../components/property-details-data/property-details-data.component';
import {MediumLayoutComponent} from '../../../../../shared/components/medium-layout/medium-layout.component';
import {Property} from '../../models/property.model';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SplitButton,
    TranslatePipe,
    DeleteDialogComponent,
    PropertyDetailsDataComponent,
    PropertyDialogComponent,
    MediumLayoutComponent,
  ],
  templateUrl: './property-details.component.html',
  styleUrl: './property-details.component.scss',
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  private propertyStore = inject(PropertyStore);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  propertyId = signal<string | null>(null);
  editPropertyDialogVisible = false;
  deletePropertyDialogVisible = false;

  property = computed(() => {
    if (!this.propertyId() && !this.propertyStore.isLoaded()) return null;
    return this.propertyStore.filteredProperties().find(p => p.id == this.propertyId()) ?? null;
  });

  public gridActions = computed(() => {
    return [
      {
        label: this.translateService.instant('Properties.EditProperty'),
        icon: 'pi pi-pencil',
        command: () => {
          this.editPropertyDialogVisible = true;
        }
      },
      {
        label: this.translateService.instant('Properties.DeleteProperty'),
        icon: 'pi pi-trash',
        command: () => {
          this.deletePropertyDialogVisible = true;
        }
      }
    ]
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.propertyId.set(params.get('propertyId'));

      if (this.propertyId()) {
        if (!this.propertyStore.isLoaded() && !this.propertyStore.isLoading()) {
          this.propertyStore.load();
        }
      }

      if (!this.property()) {
        this.router.navigate([`/admin/properties/`])
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public deleteProperty() {
    if (this.propertyId) {
      this.propertyStore.deleteProperty({
        propertyId: this.propertyId() ?? '',
          callback: () => {
          if (this.propertyStore.error()) {
            this.toastService.showErrorToast(this.translateService.instant('General.Buttons.Error'), this.translateService.instant('Properties.DeletePropertyErrorMessage'));
          } else {
            this.toastService.showSuccessToast(this.translateService.instant('General.Buttons.Success'), this.translateService.instant('Properties.DeletePropertySuccessMessage'));
            this.router.navigate([`/admin/properties/`])
          }
        }});
    }
  }
}
