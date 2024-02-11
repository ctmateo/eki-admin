import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { FormsRoutingModule } from '../../forms/forms-routing.module';
import { DeleteComponent } from './delete/delete.component';
import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [
    CreateComponent,
    DeleteComponent,
    EditComponent,
    PreviewComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    MatDialogModule, 
    SharedComponentsModule,
    FormsRoutingModule,
  ]
})
export class DialogsModule { }