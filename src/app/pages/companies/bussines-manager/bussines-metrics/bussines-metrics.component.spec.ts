import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesMetricsComponent } from './bussines-metrics.component';

describe('BussinesMetricsComponent', () => {
  let component: BussinesMetricsComponent;
  let fixture: ComponentFixture<BussinesMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesMetricsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinesMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
