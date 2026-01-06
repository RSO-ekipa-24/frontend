import {
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: 'img[default]',
  standalone: true
})
export class ImagePreloadDirective implements OnChanges {
  @Input() src: string = '';
  @Input('default') fallback: string = '';

  @HostBinding('src') currentSrc: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if ('src' in changes) {
      this.currentSrc = this.src;
    }
  }

  @HostListener('error')
  onError(): void {
    if (this.currentSrc !== this.fallback && this.fallback) {
      this.currentSrc = this.fallback;
    }
  }

  @HostBinding('class.image-loaded')
  isLoaded = false;

  @HostListener('load')
  onLoad(): void {
    this.isLoaded = true;
  }
}
