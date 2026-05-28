import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-internal-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './internal-header.html',
  styleUrl: './internal-header.css'
})
export class InternalHeader {
  constructor(private auth: Auth, public uiService: UiService) {}

  logout() {
    this.auth.logout();
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.uiService.toggleMenu();
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
    // If sidebar is open and not pinned, and click is outside sidebar, close it.
    // We already stop propagation on hamburger button.
    const sidebar = document.querySelector('.sidebar');
    if (this.uiService.isSidebarOpen() && !this.uiService.isSidebarPinned()) {
      if (sidebar && !sidebar.contains(event.target as Node)) {
        this.closeMenu();
      }
    }
  }
}
