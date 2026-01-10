import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizeImageTag',
  standalone: true,
  pure: false
})
export class LocalizeImageTagPipe implements PipeTransform {
  private translateService = inject(TranslateService);

  private readonly tagMap: Record<string, string> = {
    'Kitchen': 'Images.Tags.Kitchen',
    'Living room': 'Images.Tags.LivingRoom',
    'Bedroom': 'Images.Tags.Bedroom',
    'Bathroom': 'Images.Tags.Bathroom',
    'Dining room': 'Images.Tags.DiningRoom',
    'Office': 'Images.Tags.Office',
    'Outdoor': 'Images.Tags.Outdoor'
  };

  transform(value: string | undefined | null): string {
    if (!value) return '';
    const translationKey = this.tagMap[value];
    return translationKey
      ? this.translateService.instant(translationKey)
      : value;
  }
}
