import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
@Component({
  selector: 'app-list-routes',
  templateUrl: './list-routes.component.html',
  styleUrls: ['./list-routes.component.sass']
})
export class ListRoutesComponent {

  filterForm: FormGroup;
  attr = ["Id", "Rurta"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['id', 'name', 'color', 'countCourse'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthCompanies = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog,
    private route: Router,
    private api: APIService) {
      
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  createRoute() {
    this.route.navigateByUrl('routes/create-route');
  }

  ngOnInit() {
    this.getPath('');
  }

  getPath(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListLearningPaths(undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthCompanies = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthCompanies = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getPath(this.tokens[event.pageIndex].token, event)
  }

}
