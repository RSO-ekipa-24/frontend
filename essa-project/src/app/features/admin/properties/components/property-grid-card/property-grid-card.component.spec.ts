import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGridCardComponent } from './property-grid-card.component';

describe('PropertyGridCardComponent', () => {
  let component: PropertyGridCardComponent;
  let fixture: ComponentFixture<PropertyGridCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyGridCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyGridCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
