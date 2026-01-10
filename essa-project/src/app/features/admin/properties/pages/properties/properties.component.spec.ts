import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesComponent } from './properties.component';
import { TranslateModule } from '@ngx-translate/core';
import { PropertyStore } from '@core/store/property.store';
import { ToastService } from '../../../../../shared/services/toast.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TagStore } from '@core/store/tag.store';

describe('PropertiesComponent', () => {
  let component: PropertiesComponent;
  let fixture: ComponentFixture<PropertiesComponent>;

  const mockPropertyStore = {
    load: jasmine.createSpy('load'),
    filteredProperties: jasmine.createSpy('filteredProperties').and.returnValue([]),
    createProperty: jasmine.createSpy('createProperty'),
    updateProperty: jasmine.createSpy('updateProperty')
  };

  const mockTagStore = {
    load: jasmine.createSpy('load'),
    filteredTags: jasmine.createSpy('filteredTags').and.returnValue([]),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(false)
  };

  const mockToastService = jasmine.createSpyObj('ToastService', ['showSuccessToast']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PropertiesComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: TagStore, useValue: mockTagStore },
        { provide: ToastService, useValue: mockToastService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open add property dialog when command is executed', () => {
    const actions = component.gridActions();
    actions[0].command!({ item: actions[0] });
    expect(component['addPropertyDialogVisible']).toBeTrue();
  });
});
