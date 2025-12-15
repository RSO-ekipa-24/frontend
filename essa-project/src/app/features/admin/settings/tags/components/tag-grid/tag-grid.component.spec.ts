import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagGridComponent } from './tag-grid.component';

describe('TagGridComponent', () => {
  let component: TagGridComponent;
  let fixture: ComponentFixture<TagGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
