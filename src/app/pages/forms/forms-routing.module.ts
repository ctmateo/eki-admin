import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFormComponent } from './list-form/list-form.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';

const routes: Routes = [
  { path: '', component: ListFormComponent, pathMatch: 'full' },
  { path: 'detail/:formID', component: DetailFormComponent, pathMatch: 'full' },
  { path: 'edit/:formID', component: EditFormComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
