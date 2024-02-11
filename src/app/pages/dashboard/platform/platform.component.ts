import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/API.service';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.sass']
})

export class PlatformComponent implements OnInit {
  
  lineChartData:any = [];
  numberUsers = 0;
  barChartData:any = [];
  constructor(private api: APIService){
    api.ListUsers().then(data => {
      this.numberUsers = data.items.length
    })
  }
  ngAfterViewChecked(){
    this.lineChartData =  [{ value: 5, date: new Date("2022-09-17T15:10:40.932Z") },
      { value: 2, date: new Date("2022-09-28T23:25:29.000Z") },
      { value: 6, date: new Date("2022-09-29T03:54:05.000Z") },
      { value: 6, date: new Date("2022-10-01T14:58:37.000Z") },
      { value: 2, date: new Date("2022-10-07T01:49:02.000Z") },
      { value: 2, date: new Date("2022-11-01T02:56:51.000Z") },
      { value: 1, date: new Date("2022-11-05T17:05:39.000Z") },
      { value: 2, date: new Date("2022-11-08T23:25:04.000Z") },
      { value: 1, date: new Date("2022-11-10T00:48:42.000Z") },
      { value: 1, date: new Date("2022-11-11T16:51:13.000Z") },
      { value: 1, date: new Date("2022-12-16T18:38:18.000Z") },
      { value: 1, date: new Date("2022-12-23T16:41:59.000Z") },
      { value: 1, date: new Date("2022-12-30T15:52:09.000Z") },
      { value: 1, date: new Date("2023-01-04T20:06:16.000Z") },
      { value: 1, date: new Date("2023-01-07T15:12:48.000Z") }, 
      { value: 1, date: new Date("2023-01-13T14:36:23.000Z") }, 
      { value: 1, date: new Date("2023-01-23T13:07:11.000Z") }, { value: 1, date: new Date("2023-01-25T13:41:26.000Z") }, { value: 1, date: new Date("2023-01-30T15:19:14.000Z") }, { value: 4, date: new Date("2023-02-01T16:45:30.000Z") }, { value: 1, date: new Date("2023-02-02T16:24:53.000Z") }, { value: 1, date: new Date("2023-02-04T13:39:34.000Z") }, { value: 1, date: new Date("2023-02-06T15:47:02.000Z") }, { value: 1, date: new Date("2023-02-11T19:22:31.000Z") }, { value: 1, date: new Date("2023-03-01T21:46:39.000Z") }, { value: 1, date: new Date("2023-03-08T17:04:43.000Z") }, { value: 1, date: new Date("2023-03-09T15:18:02.000Z") }, { value: 2, date: new Date("2023-03-10T17:16:04.000Z") }, { value: 1, date: new Date("2023-03-13T13:36:10.000Z") }, { value: 2, date: new Date("2023-03-23T15:55:57.000Z") }, { value: 2, date: new Date("2023-03-31T19:13:55.000Z") }, { value: 2, date: new Date("2023-04-01T15:03:16.000Z") }, { value: 1, date: new Date("2023-04-03T21:46:59.000Z") }, { value: 1, date: new Date("2023-04-10T13:57:20.000Z") }, { value: 1, date: new Date("2023-04-21T21:06:24.000Z") }, { value: 3, date: new Date("2023-05-10T14:30:31.000Z") }, { value: 1, date: new Date("2023-05-11T00:07:52.000Z") }, { value: 1, date: new Date("2023-05-17T20:34:11.000Z") }, { value: 1, date: new Date("2023-05-18T03:15:59.000Z") }, { value: 1, date: new Date("2023-05-26T02:35:46.000Z") }, { value: 1, date: new Date("2023-06-09T20:19:38.000Z") }, { value: 1, date: new Date("2023-06-16T21:36:53.000Z") }, { value: 1, date: new Date("2023-06-20T20:37:44.000Z") }, { value: 1, date: new Date("2023-06-27T16:30:03.000Z") }, { value: 2, date: new Date("2023-07-05T16:30:03.000Z") }, { value: 1, date: new Date("2023-07-06T02:10:54.000Z") }, { value: 1, date: new Date("2023-07-09T18:04:51.000Z") }, { value: 3, date: new Date("2023-07-13T16:30:03.000Z") }, { value: 1, date: new Date("2023-07-23T13:46:14.000Z") }, { value: 1, date: new Date("2023-07-24T16:30:03.000Z") }, { value: 1, date: new Date("2023-07-27T21:31:27.000Z") }, { value: 1, date: new Date("2023-07-28T00:30:02.000Z") }, { value: 4, date: new Date("2023-08-01T16:30:03.000Z") }, { value: 5, date: new Date("2023-08-02T16:30:03.000Z") }, { value: 1, date: new Date("2023-08-05T16:30:03.000Z") }, { value: 2, date: new Date("2023-08-09T21:28:17.000Z") }, { value: 4, date: new Date("2023-08-10T16:30:03.000Z") }, { value: 1, date: new Date("2023-08-12T16:30:03.000Z") }, { value: 1, date: new Date("2023-08-13T00:57:15.000Z") }];
      
      this.barChartData = [{ company: 'Cafeteros' }, { company: 'Cafeteros' }, { company: 'Cafeteros' }, { company: 'Cafeteros' }, { company: 'Cafeteros' },
      { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' }, { company: 'Agrocol' },
      { company: 'Uber' }, { company: 'Uber' }, { company: 'Uber' }, { company: 'Uber' }, { company: 'Uber' }, { company: 'Uber' }, { company: 'Colombina' },
      { company: 'Colombina' }, { company: 'Colombina' }, { company: 'Colombina' }, { company: 'Colombina' }, { company: 'Colombina' }, { company: 'Colombina' },
      { company: 'Mariscos S.A' }, { company: 'Mariscos S.A' }, { company: 'Mariscos S.A' }, { company: 'Mariscos S.A' }, { company: 'Mariscos S.A' }]
  }

  ngOnInit() {
    this.lineChartData.sort();
  }
}
