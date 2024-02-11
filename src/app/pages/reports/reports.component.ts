import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { APIService, ModelRequestSupportFilterInput, ReportSupportType } from 'src/app/API.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass']
})
export class ReportsComponent implements OnInit {
  tabs = ['Sin Asignar', 'Pendientes', 'Resueltos', 'Archivados'];

  filterOptions: any = ['Todos', 'Formulario', 'Contenido', 'Pagos', 'Multimedia'];

  buttonDisabled = false;
  dataSourceById: any = [];
  listReportsClients: any;

  limitElements = 15;
  searchFinish = false;
  tokens: { count: number; token: string }[] = [{ count: this.limitElements, token: '' }];
  lengthReports = this.limitElements;
  maxLength = -1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tabselected: number = 0;

  constructor(
    private router: Router,
    private api: APIService,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.initializeUserData();
  }

  async initializeUserData() {
    this.getReportList();
  }

  saveGotoPage(page: string, idReport: any): void {
    console.log(idReport);
    this.router.navigate([page, idReport]);
  }

  onTabSelected(event: any) {
    this.paginator.pageIndex = 0;
    this.selectedTab(event.index + 1);
  }

  async selectedTab(index: number) {
    this.tokens = [{ count: this.limitElements, token: '' }];
    this.tabselected = index;
    this.getReportList();
  }

  getReportSupportType(number: number): string {
    switch (number) {
      case 1:
        return 'UNKNOW';
      case 2:
        return 'CONTENTCLASS';
      case 3:
        return 'TRANSACTIONS';
      case 4:
        return 'UX';
      default:
        console.error('Estado del filtro vacío');
        return '';
    }
  }

  pageChange(event: PageEvent) {
    const token = this.tokens[event.pageIndex]?.token;
    if (token !== undefined) {
      this.getReportList(token, event);
    }

    this.lengthReports = (event.pageSize * event.pageIndex) + this.listReportsClients.items.length;
  }

  updatePaginatorLength() {
    this.lengthReports = this.dataSourceById.length;
  }

  async getReportList(token?: string, event?: PageEvent) {
    try {
      const response = await this.api.ListRequestSupports(undefined, event?.pageSize || this.limitElements, token);
      this.listReportsClients = response;

      let filteredItemsStateRequest: any[];

      switch (this.tabselected) {
        case 0:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'STARTING');
          break;
        case 1:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'PENDING');
          break;
        case 2:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'SOLVED');
          break;
        case 3:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'UNSOLVED');
          break;
        default:
          console.error('Estado del filtro vacío');
          return;
      }

      this.dataSourceById = filteredItemsStateRequest;
      this.updatePaginatorLength();

      if (response.nextToken == null) {
        console.log('is true')
        this.searchFinish = true;
        this.lengthReports = (event?.pageSize || this.limitElements) * (event?.pageIndex || 0) + response.items.length;
      }

      if (this.searchFinish === false) {
        console.log('is false');
        const newToken = { count: response.items.length, token: response.nextToken || '' };
        if (response.nextToken !== null) {
          // Cargar la siguiente página
          this.tokens.push(newToken)
          this.updatePaginatorLength();
        } else {
          // Actualizar la página actual con los nuevos datos
          this.listReportsClients = response;

        }
      }

    } catch (error) {
      console.error('Error al obtener la lista de informes:', error);
    }
  }

  async filterByTypeReport(number: number) {
    try {
      this.paginator.pageIndex = 0;

      if (number === 0) {
        this.dataSourceById = [...this.listReportsClients.items];
        this.updatePaginatorLength();
        return;
      }

      const filter: ModelRequestSupportFilterInput = {
        reportSupportType: { eq: this.getReportSupportType(number) as ReportSupportType }
      };

      const response = await this.api.ListRequestSupports(filter);
      let filteredItemsStateRequest: any[];

      switch (this.tabselected) {
        case 0:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'STARTING');
          break;
        case 1:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'PENDING');
          break;
        case 2:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'SOLVED');
          break;
        case 3:
          filteredItemsStateRequest = response.items.filter(item => item && item.stateRequest === 'UNSOLVED');
          break;
        default:
          console.error('Estado del filtro vacío');
          return;
      }

      this.dataSourceById = filteredItemsStateRequest;
      this.updatePaginatorLength();

    } catch (error) {
      console.error('Error al obtener la lista de informes:', error);
    }
  }

  titleReportList(titleReport): string {
    switch (titleReport) {
      case 'UNKNOW':
        return 'Desconocido';
      case 'CONTENTCLASS':
        return 'Contenido';
      case 'TRANSACTIONS':
        return 'Suscripción';
      case 'UX':
        return 'Multimedia';
      default:
        return 'Problema de datos';
    }
  }

  convertData(data): string {
    return this.utils.convertToDateCollaborator(data);
  }

  handleButtonClick(item) {
    this.buttonDisabled = true;
    this.saveGotoPage('/reports/chat-reports', item);
  }
}
