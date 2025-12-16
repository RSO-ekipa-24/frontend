import {Component, input} from '@angular/core';

@Component({
  selector: 'app-fluid-layout',
  imports: [],
  templateUrl: './fluid-layout.component.html',
  styleUrl: './fluid-layout.component.scss'
})
export class FluidLayoutComponent {
  fullHeight = input<boolean>(false);
}
