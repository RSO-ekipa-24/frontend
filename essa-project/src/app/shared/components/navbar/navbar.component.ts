import {Component, computed, inject} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {DrawerModule} from 'primeng/drawer';
import {CommonModule} from '@angular/common';
import {AvatarModule} from 'primeng/avatar';
import {DropdownModule} from 'primeng/dropdown';
import {routes} from 'app/app.routes';
import {ButtonModule} from 'primeng/button';
import {PopoverModule} from 'primeng/popover';
import {TranslateModule} from '@ngx-translate/core';
import {AuthService} from '@core/auth/services/auth.service';
import {UserService} from '../../services/user.service';
import {MenubarModule} from 'primeng/menubar';
import {RouterLink} from '@angular/router';
import {NavigationAvatarComponent} from '../navigation-avatar/navigation-avatar.component';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    CommonModule,
    TranslateModule,
    DrawerModule,
    MenubarModule,
    AvatarModule,
    DropdownModule,
    ButtonModule,
    PopoverModule,
    RouterLink,
    NavigationAvatarComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public userService = inject(UserService);

  public menuItems = computed(() => this.getMenuItems());
  
  getMenuItems(): MenuItem[] {
    const menuItems: MenuItem[] = [];

    routes
      .filter(route => route.path !== undefined && (route.children || route.data?.['navbar']))
      .forEach(parentRoute => {
        const parentPath = parentRoute.path || '';
        const children = (parentRoute.children || []).filter(
          child =>
            child.data?.['navbar'] &&
            !child.redirectTo &&
            (!child.canActivate || this.authService.authenticated())
        );

        children.forEach(child => {
          const fullPath = parentPath ? `${parentPath}/${child.path}` : child.path;
          const menuItem: MenuItem = {
            label: child.data?.['label'],
            icon: child.data?.['icon'],
            routerLink: fullPath,
            root: true
          };

          const childRoutes = (child.children || []).filter(
            c =>
              c.data?.['navbar'] &&
              !c.redirectTo &&
              (!c.canActivate || this.authService.authenticated())
          );
          if (childRoutes.length > 0) {
            menuItem.items = childRoutes.map(subChild => ({
              label: subChild.data?.['label'],
              icon: subChild.data?.['icon'],
              routerLink: `${fullPath}/${subChild.path}`
            }));
          }

          menuItems.push(menuItem);
        });
      });

    return menuItems;
  }
}
