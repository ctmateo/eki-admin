import { EventEmitter, Injectable } from '@angular/core';
import { APIService } from '../API.service';

@Injectable({
  providedIn: 'root'
})
export class BussinesService {
  companyData: any;
  dataReady: EventEmitter<void> = new EventEmitter<void>();

  constructor(private api: APIService) { }

  async queryCompany(idBussines){
    this.companyData = await this.api.GetCompanyData(idBussines);
    return  this.companyData;
  }

  getCompany(){
    return this.companyData
  }
}
