import { Component, ViewChild } from '@angular/core';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-bussines-teams',
  templateUrl: './bussines-teams.component.html',
  styleUrls: ['./bussines-teams.component.sass']
})
export class BussinesTeamsComponent {

  filterForm: FormGroup;
  attr = ["Id", "Nombre del grupo"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['id', 'name', 'menbers'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens: any = [{ count: 25, token: "" }];
  lengthData = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  idBussines: any

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
    this.route.paramMap.subscribe(async params => {
      this.idBussines = params.get('id');
      this.getPath('');
    });
  }


  getPath(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {

    this.api.ListGroupsByCompanyId(this.idBussines, undefined, ModelSortDirection.DESC, undefined, this.limitElements, token).then(data => {
      this.dataSource = data.items;
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
}
