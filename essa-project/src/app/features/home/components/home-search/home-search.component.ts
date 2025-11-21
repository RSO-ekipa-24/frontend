import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {TranslateModule} from '@ngx-translate/core';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';

@Component({
  selector: 'app-home-search',
  imports: [
    CommonModule,
    TranslateModule,
    InputTextModule,
    IconField,
    InputIcon
  ],
  templateUrl: './home-search.component.html',
  styleUrl: './home-search.component.scss'
})
export class HomeSearchComponent {

}
