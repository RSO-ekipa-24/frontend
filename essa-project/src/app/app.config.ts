import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {provideTranslateService, TranslateLoader} from '@ngx-translate/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import {MyCustomTheme} from './theme';
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak
} from 'keycloak-angular';
import {environment} from '../environments/environment';
import {MessageService} from 'primeng/api';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.appBasePath + '/assets/i18n/', '.json');
}

const apiUrlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp(`^${environment.apiUrl}(?!/public)`, 'i'),
});

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideKeycloak({
      config: {
        url: environment.keyCloakUrl,
        realm: 'quarkus',
        clientId: 'frontend',
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + environment.appBasePath + '/assets/silent-check-sso.html',
        checkLoginIframe: true,
        checkLoginIframeInterval: 30,
        pkceMethod: 'S256',
      },
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [apiUrlCondition]
    },
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyCustomTheme,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind, primeng',
          },
          darkModeSelector: '.dark'
        }
      }
    }),
    MessageService
  ]
};
