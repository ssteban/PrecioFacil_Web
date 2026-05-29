import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../services/dialog';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css'
})
export class DialogComponent {
  constructor(public dialogService: DialogService) {}

  onConfirm() {
    this.dialogService.close(true);
  }

  onCancel() {
    this.dialogService.close(false);
  }

  onOverlayClick(event: MouseEvent) {
    if (this.dialogService.options().mode === 'alert') {
      this.dialogService.close(true);
    }
  }
}
