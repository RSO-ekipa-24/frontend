import {Component, computed, input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-tag',
  imports: [
    NgClass
  ],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  name = input<string>('')
  color = input<string>('#334155')
  size = input<string>('sm')

  backgroundColor = computed(() => {
    const color = this.color();

    if (color.startsWith('rgba(') || color.startsWith('hsla(')) {
      return color.replace(/[\d.]+(?=\))/, '0.4');
    }

    if (color.startsWith('rgb(') || color.startsWith('hsl(')) {
      return color.replace(')', ', 0.4)').replace('rgb(', 'rgba(').replace('hsl(', 'hsla(');
    }

    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.2)`;
    }

    return color;
  });
}
