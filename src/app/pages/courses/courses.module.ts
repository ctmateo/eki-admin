import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesRouting } from './courses-routing.module';
import { ListCoursesComponent } from './list-courses/list-courses.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { CreateCourseComponent } from './create-course/create-course.component';
import { DetailCourseComponent } from './detail-course/detail-course.component';
import { MetricsCourseComponent } from './detail-course/metrics-course/metrics-course.component';
import { ContentCourseComponent } from './detail-course/content-course/content-course.component';
import { DescriptionCourseComponent } from './detail-course/description-course/description-course.component';
import { PopUpRequerimentsComponent } from './pop-up-requeriments/pop-up-requeriments.component';



@NgModule({
  declarations: [
    ListCoursesComponent,
    CreateCourseComponent,
    DetailCourseComponent,
    MetricsCourseComponent,
    ContentCourseComponent,
    DescriptionCourseComponent,
    PopUpRequerimentsComponent
  ],
  imports: [
    CommonModule,
    CoursesRouting,
    SharedComponentsModule
  ]
})
export class CoursesModule { }
