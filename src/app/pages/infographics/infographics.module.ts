import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { InfographicsRoutingModule } from './infographics-routing.module';
import { ListInfographicsComponent } from './list-infographics/list-infographics.component';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from './dialogs/dialogs.module';

@NgModule({
  declarations: [
    ListInfographicsComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedComponentsModule,
    InfographicsRoutingModule,
    DialogsModule
  ]
})
export class InfographicsModule { }
