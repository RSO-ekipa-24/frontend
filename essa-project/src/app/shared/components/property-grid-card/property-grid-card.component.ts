import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FastAverageColor} from 'fast-average-color';
import {Property} from '../../../features/admin/properties/models/property.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-property-grid-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, CardModule, ButtonModule],
  templateUrl: './property-grid-card.component.html',
  styleUrl: './property-grid-card.component.scss'
})
export class PropertyGridCardComponent {
  router = inject(Router);

  cardTitle = input<string>('');
  imageUrl = input<string>('');

  property = input<Property>();
  isPublic = input<boolean>(false);

  gradientDirection = input<'to top' | 'to bottom' | 'to left' | 'to right'>('to bottom');
  gradientStartColor = input<string | undefined>(undefined);
  gradientStartPosition = input<string>('0%');
  gradientEndPosition = input<string>('100%');
  darkenPercentage = input<string>('40%');

  backgroundGradient = computed(() => {
    const gradientColor = this.gradientStartColor() || this.averageColor();
    return `linear-gradient(${this.gradientDirection()},
            rgba(0, 0, 0, 0) ${this.gradientStartPosition()},
            ${gradientColor} ${this.gradientEndPosition()}),
            url(${this.imageUrl()})`;
  });

  cardStyles = computed(() => ({
    backgroundImage: this.backgroundGradient(),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }));

  averageColor = signal('rgba(0, 0, 0, 1)');

  constructor() {
    effect(() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = this.imageUrl();

      img.onload = () => {
        const fac = new FastAverageColor();
        this.averageColor.set(
          this.darkenColor(fac.getColor(img).hex, parseInt(this.darkenPercentage().replace('%', ''), 10))
        );
      };
    });
  }

  private darkenColor(hex: string, percent: number) {
    const factor = (100 - percent) / 100;
    const [r, g, b] = hex.match(/\w\w/g)!.map(x => Math.floor(parseInt(x, 16) * factor));
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  public openDetails() {
    if (!this.isPublic()) {
      this.router.navigate([`/admin/properties/${this.property()?.id ?? ''}`])
    } else {
      this.router.navigate([`/browsing/${this.property()?.id ?? ''}`])
    }
  }
}
