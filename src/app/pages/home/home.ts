import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Hero } from '../../components/hero/hero';
import { Features } from '../../components/features/features';
import { MissionVision } from '../../components/mission-vision/mission-vision';
import { Pricing } from '../../components/pricing/pricing';
import { Cta } from '../../components/cta/cta';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, Features, MissionVision, Pricing, Cta, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
}
