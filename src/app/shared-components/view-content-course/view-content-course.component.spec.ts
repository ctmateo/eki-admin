import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContentCourseComponent } from './view-content-course.component';

describe('ViewContentCourseComponent', () => {
  let component: ViewContentCourseComponent;
  let fixture: ComponentFixture<ViewContentCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContentCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewContentCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
