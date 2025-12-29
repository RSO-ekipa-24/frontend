import {Component} from '@angular/core';
import {FluidLayoutComponent} from "../../../../shared/components/fluid-layout/fluid-layout.component";
import {PageHeaderComponent} from "../../../../shared/components/page-header/page-header.component";
import {TranslatePipe} from "@ngx-translate/core";
import {PropertyGridComponent} from "../../../admin/properties/components/property-grid/property-grid.component";
import {SplitButton} from "primeng/splitbutton";
import {PropertyGridPublicComponent} from '../../components/property-grid-public/property-grid-public.component';

@Component({
  selector: 'app-browsing',
    imports: [
        FluidLayoutComponent,
        PageHeaderComponent,
        TranslatePipe,
        PropertyGridPublicComponent
    ],
  templateUrl: './browsing.component.html',
  styleUrl: './browsing.component.scss'
})
export class BrowsingComponent {

}
