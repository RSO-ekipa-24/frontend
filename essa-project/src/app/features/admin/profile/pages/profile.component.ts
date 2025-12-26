import {Component, inject} from '@angular/core';
import {PageHeaderComponent} from "../../../../shared/components/page-header/page-header.component";
import {TranslatePipe} from "@ngx-translate/core";
import {SplitButton} from 'primeng/splitbutton';
import {Avatar} from 'primeng/avatar';
import {AuthService} from '@core/auth/services/auth.service';
import {UserService} from '../../../../shared/services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {CompactLayoutComponent} from '../../../../shared/components/compact-layout/compact-layout.component';
import {Button} from 'primeng/button';
import {ProfileSettingsComponent} from '../components/profile-settings/profile-settings.component';

@Component({
  selector: 'app-profile',
  imports: [
    CompactLayoutComponent,
    PageHeaderComponent,
    TranslatePipe,
    SplitButton,
    Avatar,
    Button,
    ProfileSettingsComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public authService = inject(AuthService);
  public userService = inject(UserService);

  public currentUsername = toSignal(
    this.userService.getCurrentUser().pipe(
      map((user: any) => user.username)
    ),
    {initialValue: ''}
  );
}
