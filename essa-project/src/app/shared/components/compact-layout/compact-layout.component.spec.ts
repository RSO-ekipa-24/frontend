import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactLayoutComponent } from './compact-layout.component';

describe('CompactLayoutComponent', () => {
  let component: CompactLayoutComponent;
  let fixture: ComponentFixture<CompactLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompactLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompactLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
