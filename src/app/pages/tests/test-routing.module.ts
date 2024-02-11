import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListTestsComponent } from "./list-tests/list-tests.component";
import { CreateTestComponent } from "./create-test/create-test.component";

const routes: Routes = [
  { path: 'list-tests', component: ListTestsComponent, pathMatch: 'full' }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TestRouting { }