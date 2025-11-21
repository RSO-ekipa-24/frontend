import {Component} from '@angular/core';
import {IconField} from "primeng/iconfield";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-search-box',
  imports: [
    IconField,
    InputIcon,
    InputText,
    TranslatePipe
  ],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent {

}
