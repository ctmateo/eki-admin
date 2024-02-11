import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInfographicsComponent } from './list-infographics/list-infographics.component';

const routes: Routes = [
  {path:"list-infographics", component: ListInfographicsComponent, pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfographicsRoutingModule { }
