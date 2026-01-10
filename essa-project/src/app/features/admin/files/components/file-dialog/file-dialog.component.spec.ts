import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDialogComponent } from './file-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FileStore } from '@core/store/file.store';
import { PropertyStore } from '@core/store/property.store';
import { ToastService } from '../../../../../shared/services/toast.service';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

describe('FileDialogComponent', () => {
  let component: FileDialogComponent;
  let fixture: ComponentFixture<FileDialogComponent>;

  const mockFileStore = {
    createFile: jasmine.createSpy('createFile')
  };

  const mockPropertyStore = {
    load: jasmine.createSpy(),
    filteredProperties: signal([]),
    properties: signal([]),
    isLoading: signal(false)
  };

  const mockToastService = jasmine.createSpyObj('ToastService', ['showSuccessToast', 'showErrorToast']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FileDialogComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        { provide: FileStore, useValue: mockFileStore },
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
