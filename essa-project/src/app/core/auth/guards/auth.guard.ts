import {AuthGuardData, createAuthGuard} from 'keycloak-angular';
import {ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree} from '@angular/router';

const isAccessAllowed = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot, authData: AuthGuardData): Promise<boolean | UrlTree> => {
  if (!authData.authenticated) {
    // await authData.keycloak.login({
    //   redirectUri: window.location.origin + environment.appBasePath + state.url
    // });
    return false;
  }
  return true;
};

export const canActivateAuth: CanActivateFn = createAuthGuard(isAccessAllowed);
