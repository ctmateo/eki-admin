import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListRoutesComponent } from './list-routes/list-routes.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { RoutesRouting } from './routes-routing.module';
import { CreateRouteComponent } from './create-route/create-route.component';



@NgModule({
  declarations: [
    ListRoutesComponent,
    CreateRouteComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    RoutesRouting
  ]
})
export class RoutesModule { }
