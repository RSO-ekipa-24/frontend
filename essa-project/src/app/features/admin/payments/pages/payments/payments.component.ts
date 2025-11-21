import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FluidLayoutComponent} from '../../../../../shared/components/fluid-layout/fluid-layout.component';
import {PageHeaderComponent} from '../../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, TranslateModule, FluidLayoutComponent, PageHeaderComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class PaymentsComponent {

}
