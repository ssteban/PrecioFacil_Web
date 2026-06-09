import { Injectable, signal } from '@angular/core';

export type DialogType = 'success' | 'warning' | 'error' | 'info';
export type DialogMode = 'alert' | 'confirm';

export interface DialogOptions {
  title: string;
  message: string;
  type?: DialogType;
  mode?: DialogMode;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isOpen = signal<boolean>(false);
  
  options = signal<DialogOptions>({
    title: '',
    message: '',
    type: 'info',
    mode: 'alert',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar'
  });

  private resolveCallback: ((value: boolean) => void) | null = null;

  alert(title: string, message: string, type: DialogType = 'info'): Promise<boolean> {
    this.options.set({
      title,
      message,
      type,
      mode: 'alert',
      confirmText: 'Entendido'
    });
    this.isOpen.set(true);

    return new Promise(resolve => {
      this.resolveCallback = resolve;
    });
  }

  confirm(title: string, message: string, confirmText: string = 'Si, continuar', type: DialogType = 'warning'): Promise<boolean> {
    this.options.set({
      title,
      message,
      type,
      mode: 'confirm',
      confirmText,
      cancelText: 'Cancelar'
    });
    this.isOpen.set(true);

    return new Promise(resolve => {
      this.resolveCallback = resolve;
    });
  }

  close(result: boolean) {
    this.isOpen.set(false);
    if (this.resolveCallback) {
      this.resolveCallback(result);
      this.resolveCallback = null;
    }
  }
}
