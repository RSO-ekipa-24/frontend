import {Component, OnDestroy, OnInit, inject, Signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject, takeUntil, filter, combineLatest } from 'rxjs';
import { computed } from '@angular/core';

import { SplitButton } from 'primeng/splitbutton';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

import {FluidLayoutComponent} from '../../../../shared/components/fluid-layout/fluid-layout.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';
import {ToastService} from '../../../../shared/services/toast.service';

import { PropertyStore } from '@core/store/property.store';
import {
  PropertyDetailsDataComponent
} from '../../../admin/properties/components/property-details-data/property-details-data.component';
import {MediumLayoutComponent} from '../../../../shared/components/medium-layout/medium-layout.component';
@Component({
  selector: 'app-property-details-public',
  standalone: true,
  imports: [
    FluidLayoutComponent,
    PageHeaderComponent,
    SplitButton,
    TranslatePipe,
    PropertyDetailsDataComponent,
    MediumLayoutComponent,
  ],
  templateUrl: './property-details-public.component.html',
  styleUrl: './property-details-public.component.scss',
})
export class PropertyDetailsPublicComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private translateService = inject(TranslateService);
  private toastService = inject(ToastService);
  private propertyStore = inject(PropertyStore);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  propertyId: string | null = null;

  property = computed(() => {
    if (!this.propertyId) return null;
    return this.propertyStore.filteredProperties().find(p => p.id == this.propertyId) ?? null;
  });


  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.propertyId = params.get('propertyId');

      if (this.propertyId) {
        if (!this.propertyStore.isLoaded() && !this.propertyStore.isLoading()) {
          this.propertyStore.load();
        }
      }

      if (!this.property()) {
        this.router.navigate([`/browse`])
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
