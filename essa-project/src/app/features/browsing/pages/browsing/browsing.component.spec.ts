import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsingComponent } from './browsing.component';

describe('BrowsingComponent', () => {
  let component: BrowsingComponent;
  let fixture: ComponentFixture<BrowsingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowsingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowsingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
