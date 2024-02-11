import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ChatReportsComponent } from './chat-reports/chat-reports.component';
import { ReportsComponent } from './reports.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { ReusableButtonComponent } from 'src/app/shared-components/resuble-button/resuble-button.component';


@NgModule({
  declarations: [
    ReportsComponent,
    ChatReportsComponent,
    ReusableButtonComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedComponentsModule
  ]
})
export class ReportsModule { }
