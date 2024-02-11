import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { CreateFormComponent } from '../create-form/create-form.component';
import { UtilsService } from 'src/app/services/utils.service';
import { DeleteFormComponent } from '../delete-form/delete-form.component';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.sass']
})
export class ListFormComponent {

  filterForm: FormGroup;
  attr = ["Nombre formulario", "Tag"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['create', 'name', 'moduleName', 'isPublic', 'actions'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthForm = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private api: APIService,
    private utils: UtilsService,
    private router: Router) {

    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.getclassTest('');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async getclassTest(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListClassTests(undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthForm = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthForm = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getclassTest(this.tokens[event.pageIndex].token, event)
  }

  goToDetail(formID) {
    this.router.navigateByUrl(`forms/detail/${formID}`)
  }


  createForm() {
    const dialogRef = this.dialog.open(CreateFormComponent,
      {
        width: "480px"
      })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != "" && result != undefined && result != null) {
        this.api.CreateClassTest(result).then(() => {
          this.utils.resetComponent()
        }).catch((err) => { console.error(err) })
      }
    });
  }

  deleteForm(event, idForm, contentModuleId, nameForm) {
    const dialogRef = this.dialog.open(DeleteFormComponent,
      {
        width: "480px",
        data: {
          idForm: idForm,
          contentModuleId: contentModuleId,
          nameForm: nameForm
        }
      })

    dialogRef.afterClosed().subscribe((result) => {
      if (result != "" && result != undefined && result != null) {
        this.api.DeleteClassTest(result).then(() => {
          this.utils.resetComponent()
        }).catch((err) => { console.error(err) })
      }
    });
    event.stopPropagation()
  }
}
