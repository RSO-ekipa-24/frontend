import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '@core/auth/services/auth.service';
import { UserService } from '../../../../shared/services/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockAuthService = {
    logout: jasmine.createSpy('logout')
  };

  const mockUserService = {
    getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue(of({ username: 'Alex' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username from the UserService', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const usernameElement = compiled.querySelector('h1');

    expect(usernameElement?.textContent).toContain('Alex');
  });

  it('should call logout on AuthService when logout button is clicked', () => {
    const logoutBtn = fixture.nativeElement.querySelector('p-button');
    logoutBtn.click();

    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
