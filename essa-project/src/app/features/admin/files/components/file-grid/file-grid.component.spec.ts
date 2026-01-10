import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileGridComponent } from './file-grid.component';
import { FileStore } from '@core/store/file.store';
import { FileService } from '../../services/file.service';
import { ToastService } from '../../../../../shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('FileGridComponent', () => {
  let component: FileGridComponent;
  let fixture: ComponentFixture<FileGridComponent>;

  const mockFileStore = {
    activeFiles: signal([{ id: '1', fileName: 'test.pdf', status: 'AVAILABLE', fileSize: 1024 }]),
    deletedFiles: signal([]),
    isLoading: signal(false),
    loadActiveFiles: jasmine.createSpy('loadActiveFiles'),
    loadDeletedFiles: jasmine.createSpy('loadDeletedFiles'),
    deleteFile: jasmine.createSpy('deleteFile'),
    restoreFile: jasmine.createSpy('restoreFile'),
  };

  const mockFileService = {
    downloadFile: jasmine.createSpy('downloadFile').and.returnValue(of(null))
  };

  const mockToastService = jasmine.createSpyObj('ToastService', ['showSuccessToast', 'showErrorToast']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FileGridComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        { provide: FileStore, useValue: mockFileStore },
        { provide: FileService, useValue: mockFileService },
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FileGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load files on init', () => {
    expect(component).toBeTruthy();
    expect(mockFileStore.loadActiveFiles).toHaveBeenCalled();
    expect(mockFileStore.loadDeletedFiles).toHaveBeenCalled();
  });
});
