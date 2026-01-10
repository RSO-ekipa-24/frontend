import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyGridComponent } from './property-grid.component';
import { PropertyStore } from '@core/store/property.store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('PropertyGridComponent', () => {
  let component: PropertyGridComponent;
  let fixture: ComponentFixture<PropertyGridComponent>;

  let mockPropertyStore: any;
  let mockTranslateService: any;

  beforeEach(async () => {
    mockPropertyStore = {
      load: jasmine.createSpy('load'),
      filteredProperties: jasmine.createSpy('filteredProperties').and.returnValue([])
    };

    mockTranslateService = {
      instant: jasmine.createSpy('instant').and.callFake((key: string) => key)
    };

    await TestBed.configureTestingModule({
      imports: [PropertyGridComponent],
      providers: [
        { provide: PropertyStore, useValue: mockPropertyStore },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyGridComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize tabs and call store.load on init', () => {
    fixture.detectChanges();

    expect(mockPropertyStore.load).toHaveBeenCalled();

    expect(component.tabs.length).toBe(1);
    expect(component.tabs[0].title).toBe('General.Buttons.All');
  });

  it('should render a card for each property in the store', () => {
    const fakeProperties = [
      { id: 1, name: 'Villa A', images: [{ imageUrl: 'test1.jpg' }] },
      { id: 2, name: 'Apartment B', images: [] }
    ];
    mockPropertyStore.filteredProperties.and.returnValue(fakeProperties);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('app-property-grid-card');

    expect(cards.length).toBe(2);
  });
});
