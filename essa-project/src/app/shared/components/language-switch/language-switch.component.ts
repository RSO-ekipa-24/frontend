import {Component, inject} from '@angular/core';
import {SelectButton} from "primeng/selectbutton";
import {TranslateService} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-language-switch',
  imports: [
    SelectButton,
    FormsModule
  ],
  templateUrl: './language-switch.component.html',
  styleUrl: './language-switch.component.scss'
})
export class LanguageSwitchComponent {
  private translate = inject(TranslateService);
  private readonly STORAGE_KEY = 'app_lang';

  languageOptions = [
    { label: 'EN', value: 'en' },
    { label: 'SL', value: 'sl' }
  ];

  private _value = 'en';

  get value() {
    return this._value;
  }

  set value(val: string) {
    if (val && this._value !== val) {
      this._value = val;
      this.translate.use(val);
      localStorage.setItem(this.STORAGE_KEY, val);
    }
  }

  ngOnInit() {
    const savedLang = localStorage.getItem(this.STORAGE_KEY) || 'en';
    this.translate.setDefaultLang('en');
    this.value = savedLang;
  }
}
