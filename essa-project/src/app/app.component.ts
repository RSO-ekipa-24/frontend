import {Component, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SidebarComponent} from './shared/components/sidebar/sidebar.component';
import {AuthService} from '@core/auth/services/auth.service';
import {NavbarComponent} from './shared/components/navbar/navbar.component';
import {filter} from 'rxjs/operators';
import {FooterComponent} from './shared/components/footer/footer.component';
import {Toast, ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, TranslateModule, SidebarComponent, NavbarComponent, FooterComponent, ToastModule],
})
export class AppComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  public authService: AuthService = inject(AuthService);
  title = 'essa-project';
  isAdminRoute: boolean = false;

  ngOnInit() {
    this.translate.addLangs(['en', 'sl']);
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    // Check initial route
    this.checkAdminRoute(this.router.url);

    // Subscribe to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkAdminRoute(event.urlAfterRedirects);
      });
  }

  private checkAdminRoute(url: string) {
    this.isAdminRoute = url.includes('admin');
  }
}
