import { Pipe, PipeTransform } from '@angular/core';
import {format, isValid, parseISO} from 'date-fns';

@Pipe({
  name: 'stringToFormattedDate',
  standalone: true,
})
export class StringToFormattedDateStringPipe implements PipeTransform {
  transform(value: string | null | undefined, formatStr: string = 'd MMMM yyyy'): string {
    if (!value) {
      return '';
    }

    const date = parseISO(value);

    if (!isValid(date)) {
      return '';
    }

    return format(date, formatStr);
  }
}
