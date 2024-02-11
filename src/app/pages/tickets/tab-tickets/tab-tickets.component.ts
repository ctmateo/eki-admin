import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-tickets',
  templateUrl: './tab-tickets.component.html',
  styleUrls: ['./tab-tickets.component.sass']
})
export class TabTicketsComponent {
  @Input() tickets;
  priority = ['Urgente', 'Importancia media', 'Importancia baja'];
  tickerID = 'a1v2b3d5-s5f4v8d5-4548-asf8w9as';
  prioritySelected = 'Urgente';

  constructor(private router: Router){

  }

  priorityChanged(event){
    this.prioritySelected = event.value;
  }
  open(){
    this.router.navigateByUrl('tickets/ticket/1');
  }
}
