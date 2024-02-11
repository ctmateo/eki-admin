import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateTeacherComponent } from '../create-teacher/create-teacher.component';
import { APIService } from 'src/app/API.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-list-teachers',
  templateUrl: './list-teachers.component.html',
  styleUrls: ['./list-teachers.component.sass']
})
export class ListTeachersComponent {

  filterForm: FormGroup;
  attr = ["id", "fecha de creación", "Nombre", "Correo de contacto", "Telefono"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['createAt', 'id', 'name', 'phone', 'email'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthTeachers = 25;
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

  ngOnInit() {
    this.getTeachers('');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async getTeachers(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    
    this.api.ListTeachers(undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;

      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthTeachers = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthTeachers = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getTeachers(this.tokens[event.pageIndex].token, event)
  }

  createTeacher() {
    const dialogRef = this.dialog.open(CreateTeacherComponent,
      {
        width: "480px"
      })

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "Teacher Created") {
        this.utils.resetComponent()
      }
    });
  }

}
