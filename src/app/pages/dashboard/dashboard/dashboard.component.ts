import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent {

  tabIndex = 0;
  ngOnInit(){
    this.tabIndex = 0;
  }
  async tabChanged(event) {
    this.tabIndex = event.index;
  }

}
