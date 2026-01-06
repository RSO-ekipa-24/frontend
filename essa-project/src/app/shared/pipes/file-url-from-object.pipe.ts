import {OnDestroy, Pipe, PipeTransform} from '@angular/core';


@Pipe({ name: 'fileUrlFromObject', pure: true })
export class FileUrlFromObjectPipe implements OnDestroy {
  private cache = new Map<File, string>();

  transform(file: File): string {
    let url = this.cache.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      this.cache.set(file, url);
    }
    return url;
  }

  ngOnDestroy() {
    this.cache.forEach(url => URL.revokeObjectURL(url));
    this.cache.clear();
  }
}
