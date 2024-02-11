import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-detail-course',
  templateUrl: './detail-course.component.html',
  styleUrls: ['./detail-course.component.sass']
})
export class DetailCourseComponent {
  courseId;
  course;
  infoReady = false;
  index = 0;
  constructor(private activatedRoute: ActivatedRoute,
    private apiCourse: CoursesService) {
      this.courseId = this.activatedRoute.snapshot.params["id"];
      this.getCourse();
  }


  getCourse() {
    this.apiCourse.GetCourse(this.courseId).then(data => {
      this.course = data;
      this.infoReady = true;
    }).catch(err => console.error(err));
  }
  
  tabChange(index) {
    this.index = index.index;
  }
}
