import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { Storage } from 'aws-amplify';
import { BussinesService } from 'src/app/services/bussines.service';
import { APIService } from 'src/app/API.service';

@Component({
  selector: 'app-bussines-manager',
  templateUrl: './bussines-manager.component.html',
  styleUrls: ['./bussines-manager.component.sass']
})
export class BussinesManagerComponent implements OnInit {
  idBussines: any
  company: any
  logo: any
  selectMenu = "collaborators"
  constructor(
    private route: ActivatedRoute,
    public utils: UtilsService,
    public router: Router,
    private api: APIService,
  ) { }

  ngOnInit() {
    if (this.route.firstChild != null) {
      this.route.firstChild.paramMap.subscribe(async params => {
        this.idBussines = params.get('id');
        this.company = await this.api.GetCompanyData(this.idBussines);
        this.logo = await Storage.get(this.company.logoCompany);
      });
    }
  }

  changeMenuSelect(option) {
    this.selectMenu = option
  }
}
