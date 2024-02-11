import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { getShortDate } from 'src/app/config/helpers';
export interface LineChart {
  value: number;
  date: Date
}
@Component({
  selector: 'app-bussines-metrics',
  templateUrl: './bussines-metrics.component.html',
  styleUrls: ['./bussines-metrics.component.sass']
})
export class BussinesMetricsComponent {
  idBussiness;
  genderChart: any = [];
  economicSectorChart: any = [];
  populationSectorChart: any = [];
  knowUsByChart: any = [];
  deviceChart:any = [];
  accessInternetChart:any = [];
  collaborators: any = [];
  lineChartData:any = [];
  infoReady = false;
  filterDateForm: FormGroup = new FormGroup({
    start: new FormControl(new Date("2022-09-05"), Validators.required),
    end: new FormControl(new Date(), Validators.required),
  });

  constructor(private api: APIService,
    private route: ActivatedRoute) {
    this.route.paramMap.subscribe(async params => {
      this.idBussiness = params.get('id');
    })
  }

  ngOnInit() {
    this.filterDateForm.valueChanges.subscribe(value => {
      if (this.filterDateForm.value.end.getTime() > this.filterDateForm.value.start.getTime()) {
        this.getUserData();
      }
    })
    this.getUserData();
  }

  async getUserData() {
    let tempGender:any = [];
    let tempEconomical: any = [];
    let tempPopulation:any = [];
    let tempKnownUsBy: any = [];
    let tempDevice: any = [];
    let tempAccessInternet: any = [];
    const temp: LineChart[] = [];
    const filter = [
      this.filterDateForm.value.start.toISOString(),
      this.filterDateForm.value.end.toISOString(),
    ]
    await this.api.ListCollaboratorDatabyCompanyID(this.idBussiness, undefined,ModelSortDirection.ASC).then(async data => {
      this.collaborators = [];
      this.collaborators.push(...data.items);
      const promises:any = [];
      this.collaborators.forEach(collaborator => {
        
        const element = temp.find(item => getShortDate(item.date) === getShortDate(collaborator?.createdAt))
        if (element) {
          element.value = element.value + 1;
        }
        else {
          temp.push({ value: 1, date: new Date(collaborator?.createdAt || "") })
        }
        temp.sort((a, b) => a.date.getTime() - b.date.getTime())
        this.lineChartData = temp
        promises.push(this.query(collaborator));
      });
      await Promise.all(promises);
      for (let index = 0; index < promises.length; index++) {
        promises[index].then(data => {
          console.log(data);
          tempGender.push({gender:data.user.gender});
          tempEconomical.push({economicSector:data.economicSector.name});
          tempPopulation.push({populationSector:data.populationSector.name});
          tempKnownUsBy.push({knowUsBy:data.knowUsBy.name});
          tempDevice.push({device: data.device});
          tempAccessInternet.push({accessInternet: data.accessInternet})
        }).catch(err => console.error(err))
        
      }
      console.log(tempGender);
      this.genderChart = tempGender;
      this.economicSectorChart = tempEconomical;
      this.populationSectorChart = tempPopulation;
      this.knowUsByChart = tempKnownUsBy;
      this.deviceChart = tempDevice;
      this.accessInternetChart = tempAccessInternet;
    }).catch(err => console.error(err))
  }
 query(collaborator){
  return new Promise((resolve, reject) => {
    this.api.UserDataByUserId(collaborator.userID).then(async (userData: any) => {
      resolve(userData.items[0]);
    }).catch(err => console.error(err));
  })
  
 }
}
