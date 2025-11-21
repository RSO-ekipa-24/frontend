import {effect, inject, Injectable, signal, untracked} from '@angular/core';
import Keycloak from 'keycloak-js';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, of, tap, timer} from 'rxjs';
import {KEYCLOAK_EVENT_SIGNAL, KeycloakEventType} from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak: Keycloak = inject(Keycloak);
  private http: HttpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private keycloakEventSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  private _isAuthenticated = signal<boolean | undefined>(undefined);
  private _hasInitialized = signal(false);
  private _checkToken = signal(false);

  private checkInterval = 240000; // 4 minutes
  private refreshWindow = 70; // Refresh when token has 70s left

  constructor() {
    this.handleSilentTokenRefresh();
    this.handleKeycloakEvents();
  }

  private handleSilentTokenRefresh() {
    effect((onCleanup) => {
      if (this._checkToken()) {
        const subscription = timer(0, this.checkInterval).subscribe(() => {
          untracked(() => this.silentTokenRefresh());
        });
        onCleanup(() => subscription.unsubscribe());
      }
    });
  }

  private handleKeycloakEvents() {
    effect(() => {
      const event = this.keycloakEventSignal();

      switch (event.type) {
        case KeycloakEventType.Ready:
        case KeycloakEventType.AuthSuccess:
          this.handleAuthSuccess();
          break;

        case KeycloakEventType.AuthRefreshSuccess:
          this._isAuthenticated.set(true);
          break;

        case KeycloakEventType.AuthLogout:
        case KeycloakEventType.TokenExpired:
        case KeycloakEventType.AuthError:
        case KeycloakEventType.AuthRefreshError:
          this.handleAuthFailure(event.type);
          break;

        default:
          console.warn('Unhandled Keycloak event:', event.type);
      }
    });
  }

  private handleAuthSuccess() {
    if (!this._hasInitialized() && !this.keycloak.token) {
      this._isAuthenticated.set(false);
    } else {
      if (!this._hasInitialized()) {
        this.authenticate().subscribe();
      } else {
        this._isAuthenticated.set(true);
      }
    }
    this._checkToken.set(true);
  }

  private async silentTokenRefresh(): Promise<void> {
    if (!this._isAuthenticated() || !this.keycloak.tokenParsed) return;

    try {
      const timeRemaining = this.getTokenRemainingTime();

      // Only refresh if token is within refresh window (70s) or already expired
      if (timeRemaining > this.refreshWindow && timeRemaining > 0) {
        return;
      }

      const refreshed = await this.keycloak.updateToken(this.refreshWindow);
      if (refreshed) {
        console.debug('Token refreshed successfully');
        this._isAuthenticated.set(true);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }

  private getTokenRemainingTime(): number {
    if (!this.keycloak.tokenParsed?.exp) return 0;
    return ((this.keycloak.tokenParsed.exp * 1000) - Date.now()) / 1000;
  }

  private handleAuthFailure(eventType: string) {
    this._isAuthenticated.set(false);
    this._hasInitialized.set(false);
    this._checkToken.set(false);
  }

  private authenticate() {
    return this.http.post(`${this.apiUrl}/users/authenticate`, null).pipe(
      tap(() => {
        this._isAuthenticated.set(true);
        this._hasInitialized.set(true);
      }),
      catchError(error => {
        console.error('Authentication API error:', error);
        this._isAuthenticated.set(false);
        return of(null);
      })
    );
  }

  get authenticated() {
    return this._isAuthenticated.asReadonly();
  }

  get userId() {
    return this.keycloak.tokenParsed?.sub ?? '';
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.handleAuthFailure('userLogout');
    this.keycloak.logout();
  }
}
