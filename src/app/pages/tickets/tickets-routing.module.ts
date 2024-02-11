import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListTicketsComponent } from "./list-tickets/list-tickets.component";
import { DetailTicketComponent } from "./detail-ticket/detail-ticket.component";

const routes: Routes = [
  { path: 'list-tickets', component: ListTicketsComponent, pathMatch: 'full' },
  { path: 'ticket/:id', component: DetailTicketComponent, pathMatch: 'full' }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TicketsRouting { }