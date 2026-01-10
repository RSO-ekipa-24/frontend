import {Component, computed, effect, input, signal} from '@angular/core';
import {NgClass} from '@angular/common';
import {replaceLod} from '../../utils/file.utils';
import {FastAverageColor} from 'fast-average-color';

@Component({
  selector: 'app-tag',
  imports: [
    NgClass
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  name = input<string>('');
  color = input<string>('#334155');
  nameColor = input<string | null>(null);
  imageUrl = input<string | null>(null);
  size = input<string>('sm');
  darkenPercentage = input<string>('70%');
  backgroundOpacity = input<number>(0.2)

  private generatedAverageColor = signal<string | null>(null);

  finalColor = computed(() => this.generatedAverageColor() ?? this.color());
  textColor = computed(() => this.nameColor() ?? this.finalColor());

  constructor() {
    effect(() => {
      const url = this.imageUrl();
      if (!url) {
        this.generatedAverageColor.set(null);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = replaceLod(url, 'LOW') || url;

      img.onload = () => {
        const fac = new FastAverageColor();
        try {
          const color = fac.getColor(img);
          const darkened = this.darkenColor(
            color.hex,
            parseInt(this.darkenPercentage().replace('%', ''), 10)
          );
          this.generatedAverageColor.set(darkened);
        } catch (e) {
          this.generatedAverageColor.set(null);
        }
      };

      img.onerror = () => this.generatedAverageColor.set(null);
    });
  }

  backgroundColor = computed(() => {
    const color = this.finalColor();

    if (color.startsWith('rgba(') || color.startsWith('hsla(')) {
      return color.replace(/[\d.]+(?=\))/, '0.4');
    }
    if (color.startsWith('rgb(') || color.startsWith('hsl(')) {
      return color.replace(')', ', 0.4)').replace('rgb(', 'rgba(').replace('hsl(', 'hsla(');
    }
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const fullHex = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
      const r = parseInt(fullHex.substring(0, 2), 16);
      const g = parseInt(fullHex.substring(2, 4), 16);
      const b = parseInt(fullHex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${this.backgroundOpacity()})`;
    }
    return color;
  });

  containerClasses = computed(() => {
    const base = 'd-flex flex-row text-center inline-flex items-center justify-center';
    return this.size() === 'lg' ? `${base} rounded-4xl` : `${base} rounded-xl`;
  });

  sizeClasses = computed(() => {
    switch (this.size()) {
      case 'lg': return 'px-3 py-1 text-sm';
      case 'sm': return 'px-2 py-1 text-xs';
      default: return 'px-[0.4rem] py-[0.1rem] text-[0.65rem]';
    }
  });

  private darkenColor(hex: string, percent: number): string {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}
