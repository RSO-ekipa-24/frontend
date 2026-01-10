import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyDialogComponent } from './property-dialog.component';
import { PropertyStore } from '@core/store/property.store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {AuthService} from '@core/auth/services/auth.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('PropertyDialogComponent', () => {
  let component: PropertyDialogComponent;
  let fixture: ComponentFixture<PropertyDialogComponent>;

  const mockPropertyStore = jasmine.createSpyObj('PropertyStore', ['createProperty', 'updateProperty']);
  const mockToastService = jasmine.createSpyObj('ToastService', ['showSuccessToast']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PropertyDialogComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ToastService, useValue: mockToastService },
        { provide: AuthService, useValue: { isAuthenticated: () => true } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PropertyDialogComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('visible', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component['propertyForm'].get('name')?.value).toBe('');
    expect(component['isEditMode']).toBeFalse();
  });

  it('should call createProperty when form is valid and id is empty', () => {
    component['propertyForm'].patchValue({
      name: 'New Mansion',
      description: 'Big house'
    });

    component.saveProperty();

    expect(mockPropertyStore.createProperty).toHaveBeenCalled();
  });
});
