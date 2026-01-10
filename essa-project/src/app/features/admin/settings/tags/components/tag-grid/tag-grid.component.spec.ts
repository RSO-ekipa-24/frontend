import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagGridComponent } from './tag-grid.component';
import { TagStore } from '@core/store/tag.store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TagGridComponent', () => {
  let component: TagGridComponent;
  let fixture: ComponentFixture<TagGridComponent>;

  const mockTagStore = {
    load: jasmine.createSpy('load'),
    deleteTag: jasmine.createSpy('deleteTag'),
    filteredTags: jasmine.createSpy('filteredTags').and.returnValue([]),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(false),
    isLoaded: jasmine.createSpy('isLoaded').and.returnValue(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TagGridComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: TagStore, useValue: mockTagStore }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TagGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call tagStore.load on init', () => {
    expect(mockTagStore.load).toHaveBeenCalled();
  });

  it('should call tagStore.deleteTag with selected tag id', () => {
    const testTag = { id: 'tag-123', name: 'Test Tag', color: '#ff0000' };
    component.selectedTag = testTag;

    component.deleteSelectedTag();

    expect(mockTagStore.deleteTag).toHaveBeenCalledWith('tag-123');
  });
});
