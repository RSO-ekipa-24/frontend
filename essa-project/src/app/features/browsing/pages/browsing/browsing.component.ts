import {Component} from '@angular/core';
import {FluidLayoutComponent} from "../../../../shared/components/fluid-layout/fluid-layout.component";
import {PageHeaderComponent} from "../../../../shared/components/page-header/page-header.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-browsing',
  imports: [
    FluidLayoutComponent,
    PageHeaderComponent,
    TranslatePipe
  ],
  templateUrl: './browsing.component.html',
  styleUrl: './browsing.component.scss'
})
export class BrowsingComponent {

}
