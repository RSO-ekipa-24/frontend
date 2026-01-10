import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagDialogComponent } from './tag-dialog.component';
import { TagStore } from '@core/store/tag.store';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TagDialogComponent', () => {
  let component: TagDialogComponent;
  let fixture: ComponentFixture<TagDialogComponent>;

  const mockTagStore = {
    createTag: jasmine.createSpy('createTag'),
    updateTag: jasmine.createSpy('updateTag')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TagDialogComponent,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TagStore, useValue: mockTagStore }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TagDialogComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('visible', false);
    fixture.componentRef.setInput('tag', {id: '', name: '', color: undefined});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component['tagForm'].get('name')?.value).toBe('');
    expect(component['tagForm'].get('color')?.value).toBe('#000000');
  });

  it('should call createTag when saving a new tag', () => {
    component['tagForm'].patchValue({
      id: '',
      name: 'New Tag',
      color: '#ffffff'
    });

    component.saveTag();

    expect(mockTagStore.createTag).toHaveBeenCalled();
  });

  it('should call updateTag when saving an existing tag', () => {
    component['tagForm'].patchValue({
      id: '123',
      name: 'Existing Tag',
      color: '#ff0000'
    });

    component.saveTag();

    expect(mockTagStore.updateTag).toHaveBeenCalled();
  });
});
