import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InternalHeader } from '../../components/internal-header/internal-header';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-internal-layout',
  standalone: true,
  imports: [RouterOutlet, InternalHeader],
  templateUrl: './internal-layout.html',
  styleUrl: './internal-layout.css'
})
export class InternalLayout {
  constructor(public uiService: UiService) {}
}
