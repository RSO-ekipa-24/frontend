import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSelectMultipleComponent } from './tag-select-multiple.component';

describe('TagSelectMultipleComponent', () => {
  let component: TagSelectMultipleComponent;
  let fixture: ComponentFixture<TagSelectMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagSelectMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagSelectMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
