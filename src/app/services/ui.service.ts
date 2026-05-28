import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isSidebarOpen = signal(false);
  isSidebarPinned = signal(false);

  toggleMenu() {
    this.isSidebarOpen.update(v => !v);
  }

  togglePin() {
    this.isSidebarPinned.update(v => !v);
    // If pinned, ensure it stays open
    if (this.isSidebarPinned()) {
      this.isSidebarOpen.set(true);
    }
  }

  closeMenuIfNotPinned() {
    if (!this.isSidebarPinned()) {
      this.isSidebarOpen.set(false);
    }
  }
}
