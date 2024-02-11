import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsCourseComponent } from './metrics-course.component';

describe('MetricsCourseComponent', () => {
  let component: MetricsCourseComponent;
  let fixture: ComponentFixture<MetricsCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
