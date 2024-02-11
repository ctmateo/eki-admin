import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metrics-course',
  templateUrl: './metrics-course.component.html',
  styleUrls: ['./metrics-course.component.sass']
})
export class MetricsCourseComponent {
  @Input() course;

  ngOnInit(){
    console.log(this.course);
  }
}
