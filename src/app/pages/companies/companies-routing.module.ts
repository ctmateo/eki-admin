import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { BussinesManagerComponent } from './bussines-manager/bussines-manager.component';
import { BussinesProfileComponent } from './bussines-manager/bussines-profile/bussines-profile.component';
import { BussinesMetricsComponent } from './bussines-manager/bussines-metrics/bussines-metrics.component';
import { BussinesTeamsComponent } from './bussines-manager/bussines-teams/bussines-teams.component';
import { BussinesCollaboratorsComponent } from './bussines-manager/bussines-collaborators/bussines-collaborators.component';
import { BussinesPathComponent } from './bussines-manager/bussines-path/bussines-path.component';
import { FlowPathComponent } from './bussines-manager/bussines-path/flow-path/flow-path.component';

const routes: Routes = [
  { path: '', component: ListCompaniesComponent, pathMatch: 'full' },
  {
    path: 'dashboard',
    component: BussinesManagerComponent,
    children: [
      { path: ':id/profile', component: BussinesProfileComponent, pathMatch: 'full' },
      { path: ':id/metrics', component: BussinesMetricsComponent, pathMatch: 'full' },
      { path: ':id/teams', component: BussinesTeamsComponent, pathMatch: 'full' },
      { path: ':id/collaborators', component: BussinesCollaboratorsComponent, pathMatch: 'full' },
      { path: ':id/path', component: BussinesPathComponent, pathMatch: 'full' },
      { path: ':id/path/:flowCompanyId', component: FlowPathComponent, pathMatch: 'full' },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRouting { }