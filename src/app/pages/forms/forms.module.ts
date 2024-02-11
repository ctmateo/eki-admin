import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsRoutingModule } from './forms-routing.module';
import { ListFormComponent } from './list-form/list-form.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { RegistersComponent } from './detail-form/registers/registers.component';
import { MetricsComponent } from './detail-form/metrics/metrics.component';
import { CreateFormComponent } from './create-form/create-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { DeleteFormComponent } from './delete-form/delete-form.component';


@NgModule({
  declarations: [
    ListFormComponent,
    DetailFormComponent,
    RegistersComponent,
    MetricsComponent,
    CreateFormComponent,
    EditFormComponent,
    DeleteFormComponent,
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    SharedComponentsModule
  ]
})
export class FormsModule { }
