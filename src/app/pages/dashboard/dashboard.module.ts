import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlatformComponent } from './platform/platform.component';
import { TransactionalComponent } from './transactional/transactional.component';
import { AcademicComponent } from './academic/academic.component';
import { DashboardRouting } from './dashboard-routing.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';



@NgModule({
  declarations: [
    DashboardComponent,
    PlatformComponent,
    TransactionalComponent,
    AcademicComponent
  ],
  imports: [
    CommonModule,
    DashboardRouting,
    SharedComponentsModule
  ]
})
export class DashboardModule { }
