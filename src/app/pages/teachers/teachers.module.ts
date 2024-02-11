import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTeachersComponent } from './list-teachers/list-teachers.component';
import { TeachersRouting } from './teachers-routing.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { CreateTeacherComponent } from './create-teacher/create-teacher.component';



@NgModule({
  declarations: [
    ListTeachersComponent,
    CreateTeacherComponent
  ],
  imports: [
    CommonModule,
    TeachersRouting,
    SharedComponentsModule
  ]
})
export class TeachersModule { }
