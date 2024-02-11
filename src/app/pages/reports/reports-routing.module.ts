import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ChatReportsComponent } from './chat-reports/chat-reports.component';

const routes: Routes = [
  { path: 'reports', component: ReportsComponent, pathMatch: 'full' },
  {path: 'chat-reports/:idReport', component: ChatReportsComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
