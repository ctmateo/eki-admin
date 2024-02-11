import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { iconsType } from 'src/app/config/enumTypes';
import { CoursesService } from 'src/app/services/courses.service';
import { S3ManagerService } from 'src/app/services/s3-manager.service';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.sass']
})
export class ListCoursesComponent {

  filterForm:FormGroup;
  attr = ["Nombre de la empresa", "Nit", "Telefono", "Correo de contacto", "Persona de contacto", "Suscripción"];
  conditions = ["Igual","Contiene"];
  displayedColumns: string[] = ['icon', 'createdAt', 'id', 'name', 'tags'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthCourses = 25;
  maxLength = -1;
  tags: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog,
              private apiCourse: CoursesService,
              private api: APIService,
              private s3Manager: S3ManagerService,
              private route: Router){
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.getCourses('');
  }

  async getCourses(token?,event={previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0}) {
   
    this.apiCourse.ListCourses(undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;
      this.dataSource.forEach(course => {
        course.tags.items.forEach(tag=> {
          this.api.GetCourseByTags(tag.id).then((courseTag:any) => {
            this.tags.push(courseTag);
            console.log(courseTag);
          })
        })
      });   
      
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthCourses = ((this.tokens.length - 1) * 25) + data.items.length
      }   
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if(event.previousPageIndex < event.pageIndex && ( event.pageIndex - this.maxLength === 1)){
          this.tokens.push(token)
          this.lengthCourses = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getCourses(this.tokens[event.pageIndex].token,event)
  }

  createCourses(){
    this.route.navigateByUrl('courses/create-course')
  }
  goToDetailCourse(id){
    this.route.navigateByUrl(`courses/detail-course/${id}`);
  }
}