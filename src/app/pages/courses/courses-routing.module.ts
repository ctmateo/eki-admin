import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListCoursesComponent } from "./list-courses/list-courses.component";
import { CreateCourseComponent } from "./create-course/create-course.component";
import { DetailCourseComponent } from "./detail-course/detail-course.component";

const routes: Routes = [
  { path: 'list-courses', component: ListCoursesComponent, pathMatch: 'full' },
  { path: 'create-course', component: CreateCourseComponent, pathMatch: 'full' },
  { path: 'detail-course/:id', component: DetailCourseComponent, pathMatch: 'full' }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CoursesRouting { }