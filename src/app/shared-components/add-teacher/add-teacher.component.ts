import { Component, Inject } from '@angular/core';
import { APIService, CreateCourseByTeachersInput } from 'src/app/API.service';
import { Storage } from 'aws-amplify';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../view-content-course/view-content-course.component';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.sass']
})
export class AddTeacherComponent {
  teachers:any = [];
  private debounceTimer ?: NodeJS.Timeout;
  course;
  itemSelected;
  constructor(private api: APIService,
              @Inject(MAT_DIALOG_DATA) public datadialog: DialogData,
              public dialogRef: MatDialogRef<AddTeacherComponent>,
              private snackBar: MatSnackBar){
                this.course = datadialog['course'];
                console.log(this.course);
  }
  onSearchChange(itemSearch){
    if (this.debounceTimer) clearTimeout(this.debounceTimer)

    this.debounceTimer = setTimeout(()=>{
      this.api.ListTeachers({fullName:{contains:itemSearch}}).then(async data => {
        this.teachers = data.items
        for (const teacher of this.teachers) {
          teacher.keyPhoto = await Storage.get(teacher.keyPhoto);
        }
        console.log(this.teachers)
      }).catch(err => console.error(err))
    },500)
  }
  selectTeacher(i,teacher){
    this.itemSelected = teacher
  }

  save(){
    let inputTeacher: CreateCourseByTeachersInput = {
      courseID: this.course.id,
      courseByTeachersTeacherId: this.itemSelected.id
    }
    console.log(inputTeacher)
    this.api.CreateCourseByTeachers(inputTeacher).then(data => {
      this.snackBar.open('El docente ha sido asignado', undefined, { duration: 2000 });
      this.dialogRef.close(data);
    }).catch(err => console.error(err))
  }
}
