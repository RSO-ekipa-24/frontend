import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationAvatarComponent } from './navigation-avatar.component';

describe('NavigationAvatarComponent', () => {
  let component: NavigationAvatarComponent;
  let fixture: ComponentFixture<NavigationAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
