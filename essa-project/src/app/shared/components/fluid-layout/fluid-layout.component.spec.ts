import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidLayoutComponent } from './fluid-layout.component';

describe('FluidLayoutComponent', () => {
  let component: FluidLayoutComponent;
  let fixture: ComponentFixture<FluidLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FluidLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FluidLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
