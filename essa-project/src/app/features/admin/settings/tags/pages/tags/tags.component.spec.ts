import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags.component';
import { TranslateModule } from '@ngx-translate/core';
import { TagStore } from '@core/store/tag.store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  const mockTagStore = {
    load: jasmine.createSpy('load'),
    filteredTags: jasmine.createSpy('filteredTags').and.returnValue([]),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(false),
    isLoaded: jasmine.createSpy('isLoaded').and.returnValue(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TagsComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: TagStore, useValue: mockTagStore }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set addTagDialogVisible to true when calling openAddTagDialog', () => {
    component.openAddTagDialog();
    expect(component['addTagDialogVisible']).toBeTrue();
  });
});
