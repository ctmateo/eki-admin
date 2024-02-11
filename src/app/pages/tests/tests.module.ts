import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTestsComponent } from './list-tests/list-tests.component';
import { CreateTestComponent } from './create-test/create-test.component';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { TestRouting } from './test-routing.module';



@NgModule({
  declarations: [
    ListTestsComponent,
    CreateTestComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    TestRouting
  ]
})
export class TestsModule { }
