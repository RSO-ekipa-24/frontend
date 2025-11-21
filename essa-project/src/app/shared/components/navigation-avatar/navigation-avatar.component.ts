import {Component, inject} from '@angular/core';
import {Avatar} from "primeng/avatar";
import {ButtonDirective} from "primeng/button";
import {Popover} from "primeng/popover";
import {TranslatePipe} from "@ngx-translate/core";
import {AuthService} from '@core/auth/services/auth.service';
import {UserService} from '../../services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {RouterLink} from '@angular/router';
import {Divider} from 'primeng/divider';
import {DarkModeSwitchComponent} from '../dark-mode-switch/dark-mode-switch.component';

@Component({
  selector: 'app-navigation-avatar',
  imports: [
    Avatar,
    ButtonDirective,
    Popover,
    TranslatePipe,
    RouterLink,
    Divider,
    DarkModeSwitchComponent
  ],
  templateUrl: './navigation-avatar.component.html',
  styleUrl: './navigation-avatar.component.scss'
})
export class NavigationAvatarComponent {
  public authService = inject(AuthService);
  public userService = inject(UserService);

  public currentUsername = toSignal(
    this.userService.getCurrentUser().pipe(
      map((user: any) => user.username)
    ),
    {initialValue: ''}
  );
}
