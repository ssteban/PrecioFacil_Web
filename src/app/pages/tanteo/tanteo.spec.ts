import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tanteo } from './tanteo';

describe('Tanteo', () => {
  let component: Tanteo;
  let fixture: ComponentFixture<Tanteo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tanteo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tanteo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
