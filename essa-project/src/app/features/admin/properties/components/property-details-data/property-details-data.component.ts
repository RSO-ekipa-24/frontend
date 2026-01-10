import {
  Component,
  computed,
  input,
  signal,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {Galleria, GalleriaModule} from 'primeng/galleria';
import {Property} from '../../models/property.model';
import {Card} from 'primeng/card';
import {TagComponent} from '../../../../../shared/components/tag/tag.component';
import {TranslateModule} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {replaceLod} from '../../../../../shared/utils/file.utils';
import {ImagePreloadDirective} from '../../../../../shared/directives/image-preload.directive';
import {LocalizeImageTagPipe} from '../../pipes/localize-image-tag.pipe';

@Component({
  selector: 'app-property-details-data',
  templateUrl: './property-details-data.component.html',
  imports: [
    Card,
    TagComponent,
    GalleriaModule,
    TranslateModule,
    Button,
    ImagePreloadDirective,
    LocalizeImageTagPipe
  ],
  styleUrl: './property-details-data.component.scss'
})
export class PropertyDetailsDataComponent implements OnDestroy {

  property = input<Property | null>();

  fullscreen = signal(false);
  activeIndex = signal(0);

  @ViewChild('galleria') galleria?: Galleria;

  private fullscreenListener = () => this.onFullscreenChange();

  imagesMid = computed(() =>
    this.property()?.images?.map(x => ({
      imageUrl: replaceLod(x.imageUrl, 'MEDIUM'),
      thumbnailImageUrl: replaceLod(x.imageUrl, 'LOW'),
      fallbackUrl: x.imageUrl,
      tags: x.tags
    })) ?? []
  );

  imagesHigh = computed(() =>
    this.property()?.images?.map(x => ({
      imageUrl: replaceLod(x.imageUrl, 'HIGH'),
      thumbnailImageUrl: replaceLod(x.imageUrl, 'LOW'),
      fallbackUrl: x.imageUrl,
      tags: x.tags
    })) ?? []
  );

  images = computed(() =>
    this.fullscreen() ? this.imagesHigh() : this.imagesMid()
  );

  constructor(private cd: ChangeDetectorRef) {
    document.addEventListener('fullscreenchange', this.fullscreenListener);
  }

  toggleFullscreen() {
    if (this.fullscreen()) {
      document.exitFullscreen();
    } else {
      const el = this.galleria?.el.nativeElement.querySelector('.p-galleria');
      el?.requestFullscreen();
    }
  }

  onFullscreenChange() {
    this.fullscreen.set(!!document.fullscreenElement);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    document.removeEventListener('fullscreenchange', this.fullscreenListener);
  }
}
