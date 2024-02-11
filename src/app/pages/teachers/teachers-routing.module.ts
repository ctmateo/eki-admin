import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTeachersComponent } from './list-teachers/list-teachers.component';


const routes: Routes = [
  { path: 'list-teachers', component: ListTeachersComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRouting { }