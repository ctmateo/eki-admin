import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTicketsComponent } from './list-tickets/list-tickets.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { TicketsRouting } from './tickets-routing.module';
import { TabTicketsComponent } from './tab-tickets/tab-tickets.component';
import { DetailTicketComponent } from './detail-ticket/detail-ticket.component';



@NgModule({
  declarations: [
    ListTicketsComponent,
    TabTicketsComponent,
    DetailTicketComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    TicketsRouting
  ]
})
export class TicketsModule { }
