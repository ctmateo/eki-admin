import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRouting } from './users-routing.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { ListUsersComponent } from './list-users/list-users.component';
import { CreateUsersComponent } from './create-users/create-users.component';



@NgModule({
  declarations: [
    ListUsersComponent,
    CreateUsersComponent
  ],
  imports: [
    CommonModule,
    UsersRouting,
    SharedComponentsModule
  ]
})
export class UsersModule { }
