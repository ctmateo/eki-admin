import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCompaniesComponent } from './list-companies/list-companies.component';
import { CompaniesRouting } from './companies-routing.module';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { BussinesManagerComponent } from './bussines-manager/bussines-manager.component';
import { BussinesProfileComponent } from './bussines-manager/bussines-profile/bussines-profile.component';
import { BussinesMetricsComponent } from './bussines-manager/bussines-metrics/bussines-metrics.component';
import { BussinesCollaboratorsComponent } from './bussines-manager/bussines-collaborators/bussines-collaborators.component';
import { BussinesTeamsComponent } from './bussines-manager/bussines-teams/bussines-teams.component';
import { CreateCollaboratorsComponent } from './bussines-manager/bussines-collaborators/create-collaborators/create-collaborators.component';
import { BussinesPathComponent } from './bussines-manager/bussines-path/bussines-path.component';
import { AddFlowCompanyComponent } from './bussines-manager/bussines-path/add-flow-company/add-flow-company.component';
import { FlowPathComponent } from './bussines-manager/bussines-path/flow-path/flow-path.component';
import { FindCollaboratorComponent } from './bussines-manager/bussines-path/find-collaborator/find-collaborator.component';

@NgModule({
  declarations: [
    ListCompaniesComponent,
    CreateCompanyComponent,
    BussinesManagerComponent,
    BussinesProfileComponent,
    BussinesMetricsComponent,
    BussinesCollaboratorsComponent,
    BussinesTeamsComponent,
    CreateCollaboratorsComponent,
    BussinesPathComponent,
    AddFlowCompanyComponent,
    FlowPathComponent,
    FindCollaboratorComponent,
  ],
  imports: [
    CommonModule,
    CompaniesRouting,
    SharedComponentsModule
  ]
})
export class CompaniesModule { }
