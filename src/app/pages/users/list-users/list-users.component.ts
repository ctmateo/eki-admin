import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { APIService } from 'src/app/API.service';
import { CreateUsersComponent } from '../create-users/create-users.component';
import { UtilsService } from 'src/app/services/utils.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];



@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.sass']
})
export class ListUsersComponent {
  filterForm: FormGroup;
  attr = ["id", "fecha de creación", "Nombre", "Correo de contacto", "Telefono"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['createAt', 'id', 'name', 'phone', 'email'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthUsers = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    public dialog: MatDialog,
    private api: APIService,
    private utils: UtilsService) {
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.getUsers('');
  }

  async getUsers(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListAdminData(undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthUsers = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthUsers = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getUsers(this.tokens[event.pageIndex].token, event)
  }

  createUsers() {
    const dialogRef = this.dialog.open(CreateUsersComponent,
      {
        width: "480px"
      })

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "User Created") {
        this.utils.resetComponent()
      }
    });
  }


}
