import {Component, computed, effect, inject, input, signal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FastAverageColor} from 'fast-average-color';
import {Property} from '../../../features/admin/properties/models/property.model';
import {Router} from '@angular/router';
import {replaceLod} from '../../utils/file.utils';

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

  private currentImageUrl = signal<string>('');
  private averageColor = signal<string>('#000000'); // Consistent hex default

  backgroundGradient = computed(() => {
    const gradientColor = this.gradientStartColor() || this.averageColor();
    const imageUrl = this.currentImageUrl();

    let bg = `linear-gradient(${this.gradientDirection()},
      rgba(0, 0, 0, 0) ${this.gradientStartPosition()},
      ${gradientColor} ${this.gradientEndPosition()}
    )`;

    if (imageUrl) {
      bg += `, url("${imageUrl}")`;
    }

    return bg;
  });

  cardStyles = computed(() => ({
    backgroundImage: this.backgroundGradient(),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }));

  constructor() {
    effect(() => {
      this.currentImageUrl.set('');
      this.averageColor.set('#000000');

      const primary = this.cssSafeUrl(replaceLod(this.imageUrl(), 'LOW') ?? '');
      const fallback = this.cssSafeUrl(this.imageUrl());

      if (!primary && !fallback) {
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      let tryingFallback = false;

      img.onload = () => {
        const fac = new FastAverageColor();
        const color = fac.getColor(img);
        const darkened = this.darkenColor(
          color.hex,
          parseInt(this.darkenPercentage().replace('%', ''), 10)
        );
        this.averageColor.set(darkened);
        this.currentImageUrl.set(img.src);
      };

      img.onerror = () => {
        if (!tryingFallback && fallback) {
          tryingFallback = true;
          img.src = fallback;
        } else {
          // Both failed (or no fallback) → use default dark color, no image
          this.averageColor.set('#333333');
          this.currentImageUrl.set('');
        }
      };

      // Start with primary if available, otherwise directly try fallback
      img.src = primary || fallback || '';
    });
  }

  public openDetails() {
    if (!this.isPublic()) {
      this.router.navigate([`/admin/properties/${this.property()?.id ?? ''}`]);
    } else {
      this.router.navigate([`/browsing/${this.property()?.id ?? ''}`]);
    }
  }

  private darkenColor(hex: string, percent: number): string {
    const factor = (100 - percent) / 100;
    const [r, g, b] = hex.match(/\w\w/g)!.map(x => Math.floor(parseInt(x, 16) * factor));
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  private cssSafeUrl(url: string): string {
    if (!url) return '';
    try {
      return new URL(url).toString();
    } catch {
      return '';
    }
  }
}
