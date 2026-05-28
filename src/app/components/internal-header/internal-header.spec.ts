import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalHeader } from './internal-header';

describe('InternalHeader', () => {
  let component: InternalHeader;
  let fixture: ComponentFixture<InternalHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
