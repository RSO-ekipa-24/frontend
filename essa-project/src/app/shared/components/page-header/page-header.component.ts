import {Component, ContentChild, input, TemplateRef} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-page-header',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  title = input<string>('');

  @ContentChild('toolbar') toolbarTemplateRef?: TemplateRef<any>;
}
