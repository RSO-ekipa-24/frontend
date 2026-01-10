import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowsingComponent } from './browsing.component';
import { TranslateModule } from '@ngx-translate/core';
import { PropertyStore } from '@core/store/property.store';
import { TagStore } from '@core/store/tag.store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';

describe('BrowsingComponent', () => {
  let component: BrowsingComponent;
  let fixture: ComponentFixture<BrowsingComponent>;

  const mockPropertyStore = {
    load: jasmine.createSpy('load'),
    filteredProperties: jasmine.createSpy('filteredProperties').and.returnValue([]),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(false)
  };

  const mockTagStore = {
    load: jasmine.createSpy('load'),
    filteredTags: jasmine.createSpy('filteredTags').and.returnValue([]),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowsingComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: TagStore, useValue: mockTagStore }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrowsingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
