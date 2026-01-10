import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilesComponent } from './files.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '@core/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { FileStore } from '@core/store/file.store';
import { PropertyStore } from '@core/store/property.store';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import {provideHttpClient} from '@angular/common/http';

describe('FilesComponent', () => {
  let component: FilesComponent;
  let fixture: ComponentFixture<FilesComponent>;

  const mockAuthService = { isAuthenticated: () => true };
  const mockMessageService = { add: () => {}, messageObserver: new Subject() };
  const mockFileStore = {
    activeFiles: signal([]),
    deletedFiles: signal([]),
    isLoading: signal(false),
    loadActiveFiles: jasmine.createSpy(),
    loadDeletedFiles: jasmine.createSpy()
  };
  const mockPropertyStore = {
    load: jasmine.createSpy(),
    filteredProperties: signal([]),
    properties: signal([]),
    isLoading: signal(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilesComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: FileStore, useValue: mockFileStore },
        { provide: PropertyStore, useValue: mockPropertyStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
