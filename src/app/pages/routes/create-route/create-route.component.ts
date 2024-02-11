import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.sass']
})
export class CreateRouteComponent {

  routeForm!: FormGroup;

  constructor(){

  }

  cancel(){
    
  }

}
