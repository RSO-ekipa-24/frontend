import {Component, input} from '@angular/core';

@Component({
  selector: 'app-medium-layout',
  standalone: true,
  imports: [],
  templateUrl: './medium-layout.component.html',
  styleUrl: './medium-layout.component.scss'
})
export class MediumLayoutComponent {
  fullHeight = input<boolean>(false);
}
