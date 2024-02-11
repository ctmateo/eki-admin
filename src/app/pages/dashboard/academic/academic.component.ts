import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/API.service';

@Component({
  selector: 'app-academic',
  templateUrl: './academic.component.html',
  styleUrls: ['./academic.component.sass']
})
export class AcademicComponent implements OnInit {
  barChartData: any = [];
  numberCourses = 0;
  numberTags = 0;
  dataReady = false
  constructor(private api: APIService,
    private ref: ChangeDetectorRef) {
    api.ListCourses().then(data => {
      this.numberCourses = data.items.length;
    }).catch(err => console.error(err));
    api.ListTags().then(data => {
      this.numberTags = data.items.length;
    }).catch(err => console.error(err))
  }

  ngAfterViewChecked() {
    this.barChartData = [{ company: 'Finanzas' }, { company: 'Finanzas' }, { company: 'Finanzas' }, { company: 'Finanzas' }, { company: 'Finanzas' },
    { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' }, { company: 'Comunicacion' },
    { company: 'Excel' }, { company: 'Excel' }, { company: 'Excel' }, { company: 'Excel' }, { company: 'Excel' }, { company: 'Excel' }, { company: 'Tecnología' },
    { company: 'Tecnología' }, { company: 'Tecnología' }, { company: 'Tecnología' }, { company: 'Tecnología' }, { company: 'Tecnología' }, { company: 'Tecnología' },
    { company: 'Empatía' }, { company: 'Empatía' }, { company: 'Empatía' }, { company: 'Empatía' }, { company: 'Empatía' }];
    this.dataReady = true
  }

  ngOnInit() {
    if (!this.ref["destroyed"]) {
      this.ref.detectChanges();
    }
  }
}
