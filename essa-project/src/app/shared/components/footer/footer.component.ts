import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  imports: [
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  protected readonly Date = Date;
}
