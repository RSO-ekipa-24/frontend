import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrganziationComponent} from './organization.component';

describe('OrganziationComponent', () => {
  let component: OrganziationComponent;
  let fixture: ComponentFixture<OrganziationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganziationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrganziationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
