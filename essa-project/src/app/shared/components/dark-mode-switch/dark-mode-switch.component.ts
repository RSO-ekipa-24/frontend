import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SelectButton} from 'primeng/selectbutton';

@Component({
  selector: 'app-dark-mode-switch',
  imports: [FormsModule, SelectButton],
  templateUrl: './dark-mode-switch.component.html',
  styleUrl: './dark-mode-switch.component.scss'
})
export class DarkModeSwitchComponent {

  themeModeOptions: any[] = [{ label: 'Light', value: 'light' },{ label: 'Dark', value: 'dark' }];

  private _value = 'light';

  get value() {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.toggleDarkMode(val);
  }

  toggleDarkMode(mode: string) {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

}
