import {Component} from '@angular/core';
import {HomeSearchComponent} from '../../components/home-search/home-search.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeSearchComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
