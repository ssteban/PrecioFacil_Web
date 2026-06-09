import { Component } from '@angular/core';
import { Data } from '../../services/data';

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class Sales {
  constructor(public dataService: Data) {}
}
