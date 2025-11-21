import {Component, computed, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DrawerModule} from 'primeng/drawer';
import {PanelMenuModule} from 'primeng/panelmenu';
import {CommonModule} from '@angular/common';
import {AvatarModule} from 'primeng/avatar';
import {DropdownModule} from 'primeng/dropdown';
import {routes} from 'app/app.routes';
import {ButtonModule} from 'primeng/button';
import {PopoverModule} from 'primeng/popover';
import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from '@core/auth/services/auth.service';
import {UserService} from '../../services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {NavigationAvatarComponent} from '../navigation-avatar/navigation-avatar.component';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    TranslateModule,
    DrawerModule,
    PanelMenuModule,
    AvatarModule,
    DropdownModule,
    ButtonModule,
    PopoverModule,
    RouterLink,
    RouterLinkActive,
    NavigationAvatarComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public authService = inject(AuthService);
  public userService = inject(UserService);

  public currentUsername = toSignal(
    this.userService.getCurrentUser().pipe(
      map((user: any) => user.username)
    ),
    {initialValue: ''}
  );

  public menuItems = computed(() => this.getMenuItems());

  getMenuItems(): MenuItem[] {
    const allRoutes = routes[2]?.children || [];
    const menuItems: MenuItem[] = [];

    // First find all top-level routes
    const topLevelRoutes = allRoutes.filter(route =>
      route.data?.['sidebar'] &&
      !route.path?.includes('/') // No slashes = top level
    );

    topLevelRoutes.forEach(route => {
      const menuItem: MenuItem = {
        label: route.data?.['label'],
        icon: route.data?.['icon'],
        route: routes[2].path + '/' + route.path
      };

      // Find routes that start with this path (potential children)
      const childRoutes = allRoutes.filter(r =>
        r.data?.['sidebar'] &&
        r.path?.startsWith(`${route.path}/`) &&
        r.path?.split('/').length === 2 // Exactly one level deep
      );

      if (childRoutes.length > 0) {
        menuItem.items = childRoutes.map(child => ({
          label: child.data?.['label'],
          icon: child.data?.['icon'],
          route: routes[2].path + '/' + child.path,
          isChild: true
        }));
      }

      menuItems.push(menuItem);
    });

    return menuItems;
  }


}
