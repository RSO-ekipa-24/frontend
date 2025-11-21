import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {canActivateAuth} from '@core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home.component').then(c => c.HomeComponent),
    data: {
      label: 'General.Pages.Home',
      icon: 'pi pi-home',
      navbar: false,
      sidebar: false,
    },
  },
  {
    path: '',
    children: [
      {
        path: 'browsing',
        loadComponent: () => import('./features/browsing/pages/browsing/browsing.component').then(c => c.BrowsingComponent),
        data: {
          label: 'General.Pages.Browse',
          icon: 'pi pi-map-marker',
          navbar: true,
          sidebar: false,
        }
      },
      {
        path: 'messaging',
        loadComponent: () => import('./features/messaging/pages/messaging.component').then(c => c.MessagingComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Messaging',
          icon: 'pi pi-inbox',
          navbar: true,
          sidebar: true,
        }
      },
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Dashboard',
          icon: 'pi pi-home',
          navbar: true,
          sidebar: true,
        }
      },
      {
        path: 'properties',
        loadComponent: () => import('./features/admin/properties/pages/properties/properties.component').then(c => c.PropertiesComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Properties',
          icon: 'pi pi-building',
          navbar: false,
          sidebar: true,
        }
      },
      {
        path: 'tenants',
        loadComponent: () => import('./features/admin/tenants/pages/tenants/tenants.component').then(c => c.TenantsComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Tenants',
          icon: 'pi pi-users',
          navbar: false,
          sidebar: true,
        }
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/admin/payments/pages/payments/payments.component').then(c => c.PaymentsComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Payments',
          icon: 'pi pi-wallet',
          navbar: false,
          sidebar: true,
        }
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/admin/documents/pages/documents/documents.component').then(c => c.DocumentsComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Documents',
          icon: 'pi pi-file',
          navbar: false,
          sidebar: true,
        }
      },
      {
        path: 'organization',
        loadComponent: () => import('./features/admin/organization/pages/organization/organization.component').then(c => c.OrganizationComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Organization',
          icon: 'pi pi-sitemap',
          navbar: false,
          sidebar: true,
        }
      },
      {
        path: 'settings',
        redirectTo: 'settings/tags',
        data: {
          label: 'General.Pages.Settings',
          icon: 'pi pi-cog',
          navbar: false,
          sidebar: true,
        }
      },
      {
        path: 'settings/tags',
        loadComponent: () => import('./features/admin/settings/tags/pages/tags/tags.component').then(c => c.TagsComponent),
        canActivate: [canActivateAuth],
        data: {
          label: 'General.Pages.Tags',
          icon: 'pi pi-tag',
          navbar: false,
          sidebar: true,
        }
      }
    ]
  },
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes, {
  enableTracing: false,
  initialNavigation: 'enabledNonBlocking',
});
