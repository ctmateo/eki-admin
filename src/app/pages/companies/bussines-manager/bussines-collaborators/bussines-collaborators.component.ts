import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from 'aws-amplify';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateCollaboratorsComponent } from './create-collaborators/create-collaborators.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-bussines-collaborators',
  templateUrl: './bussines-collaborators.component.html',
  styleUrls: ['./bussines-collaborators.component.sass']
})
export class BussinesCollaboratorsComponent implements OnInit {
  company: any
  logo: any
  hasUpdate = true
  idBussines: any

  filterForm: FormGroup;
  attr = ["Id", "stateCollaborator"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['id', 'userID', 'fullName', 'positionInTheCompany', 'stateCollaborator', 'dateActive'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens: any = [{ count: 25, token: "" }];
  lengthData = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: APIService,
    public dialog: MatDialog,
    private utils: UtilsService,
    private route: ActivatedRoute,
  ) {
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {

    this.route.paramMap.subscribe(async params => {
      this.idBussines = params.get('id');
      this.company = await this.api.GetCompanyData(this.idBussines);
      this.logo = await Storage.get(this.company.logoCompany);

      this.getPath('');
    });
  }

  getPath(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {

    this.api.ListCollaboratorDatabyCompanyID(this.idBussines, undefined, ModelSortDirection.DESC, undefined, this.limitElements, token).then(data => {
      this.dataSource = data.items;
      console.log(this.dataSource)
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthData = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthData = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getPath(this.tokens[event.pageIndex].token, event)
  }

  openCreateCollaborator() {
    const dialogRef = this.dialog.open(CreateCollaboratorsComponent,
      {
        data: {
          companyId: this.idBussines
        },
        width: "480px"
      })

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if ("collaborator" in result) {
        if (result.collaborator.stateCollaborator != "ACTIVE") {
          console.log("afterClosed characterization")
          this.startCaracterization(result.user.phone)
        } else {
          this.utils.resetComponent()
        }
      }
    });
  }

  startCaracterization(collaboratorId) {
    const payload = {
      "collaboratorId": collaboratorId,
      "companyId": this.idBussines
    }
    this.api.StartCharacterization(JSON.stringify(payload)).then((data) => {
      console.log(data)
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      this.utils.resetComponent()
    })
  }
}