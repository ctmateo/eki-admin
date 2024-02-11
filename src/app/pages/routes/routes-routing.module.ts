import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListRoutesComponent } from "./list-routes/list-routes.component";
import { CreateRouteComponent } from "./create-route/create-route.component";

const routes: Routes = [
  { path: 'list-routes', component: ListRoutesComponent, pathMatch: 'full' },
  { path: 'create-route', component: CreateRouteComponent, pathMatch: 'full' },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RoutesRouting { }

