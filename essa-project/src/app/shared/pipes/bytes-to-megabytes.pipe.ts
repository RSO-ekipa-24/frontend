import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToMb',
  standalone: true,
})
export class BytesToMegabytesPipe implements PipeTransform {
  transform(value: number | null | undefined, fixed: number = 2): string {
    if (value == null || isNaN(value) || value < 0) {
      return '';
    }

    const megabytes = value / (1024 * 1024);
    return `${megabytes.toFixed(fixed)} MB`;
  }
}
