import {Component, input} from '@angular/core';

@Component({
  selector: 'app-compact-layout',
  imports: [],
  templateUrl: './compact-layout.component.html',
  styleUrl: './compact-layout.component.scss'
})
export class CompactLayoutComponent {
  fullHeight = input<boolean>(false);
}
