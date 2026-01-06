import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filenameFromUrl',
  standalone: true,
})
export class FilenameFromUrlPipe implements PipeTransform {
  transform(url?: string | null): string {
    if (!url) return '';

    const filename = decodeURIComponent(url.split('/').pop() ?? '');

    return filename.replace(
      /^[0-9a-fA-F-]{36}-/,
      ''
    );
  }
}
