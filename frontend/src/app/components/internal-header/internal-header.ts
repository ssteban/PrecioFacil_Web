import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { UiService } from '../../services/ui.service';
import { DialogService } from '../../services/dialog';

@Component({
  selector: 'app-internal-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './internal-header.html',
  styleUrl: './internal-header.css'
})
export class InternalHeader {
  openMenu = signal<string | null>(null);

  constructor(public auth: Auth, public uiService: UiService, private dialog: DialogService) {}

  async logout() {
    try {
      const confirmed = await this.dialog.confirm(
        'Cerrar Sesion',
        'Estas seguro que deseas salir de tu cuenta?',
        'Si, salir',
        'warning'
      );

      if (confirmed) {
        this.auth.logout();
      }
    } catch (e) {
      console.error(e);
      this.auth.logout();
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.uiService.toggleMenu();
  }

  toggleSubmenu(menuName: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.openMenu.update(current => current === menuName ? null : menuName);
  }

  togglePin() {
    this.uiService.togglePin();
  }

  closeMenu() {
    this.uiService.isSidebarOpen.set(false);
  }

  closeOnNavigate() {
    this.uiService.closeMenuIfNotPinned();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    if (this.uiService.isSidebarOpen() && !this.uiService.isSidebarPinned()) {
      if (sidebar && !sidebar.contains(event.target as Node)) {
        this.closeMenu();
      }
    }
  }
}
