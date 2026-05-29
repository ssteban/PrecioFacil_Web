import { Component } from '@angular/core';
import { Data } from '../../services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produccion',
  imports: [CommonModule],
  templateUrl: './produccion.html',
  styleUrl: './produccion.css'
})
export class Produccion {
  constructor(public dataService: Data) {}
}

