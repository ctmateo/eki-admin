import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { CreateCompanyComponent } from '../create-company/create-company.component';
import { APIService } from 'src/app/API.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-list-companies',
  templateUrl: './list-companies.component.html',
  styleUrls: ['./list-companies.component.sass']
})
export class ListCompaniesComponent {

  filterForm: FormGroup;
  attr = ["Nombre de la empresa", "Nit", "Telefono", "Correo de contacto", "Persona de contacto", "Suscripción"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['id', 'name', 'nit', 'phone', 'contactEmail', 'contactName', 'subscription'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthCompanies = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private utils: UtilsService,
    public dialog: MatDialog,
    public router: Router,
    private api: APIService) {
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.getCompanies('');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async getCompanies(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListCompanyData(undefined, this.limitElements, token).then((data: any) => {
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
    this.getCompanies(this.tokens[event.pageIndex].token, event)
  }

  goToBussines(id) {
    this.router.navigateByUrl(`companies/dashboard/${id}/collaborators`);
  }

  createCompany() {
    const dialogRef = this.dialog.open(CreateCompanyComponent,
      {
        width: "480px"
      })

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "Company Created") {
        this.utils.resetComponent()
      }
    });
  }
}
