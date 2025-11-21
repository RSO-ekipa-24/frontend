import {Component, effect, input, output} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-delete-dialog',
  imports: [
    Button,
    Dialog,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {
  visible = input<boolean>(false);
  visibleChange = output<boolean>();
  onDelete = output<boolean>();

  header = input<string>('General.Buttons.Delete');
  body = input<string>('');

  protected isVisible = false;

  constructor() {
    effect(() => {
      this.isVisible = this.visible();
    });
  }

  onHide() {
    this.isVisible = false;
    this.visibleChange.emit(false);
  }

  onDeleteClick() {
    this.onDelete.emit(true);
    this.onHide();
  }
}
