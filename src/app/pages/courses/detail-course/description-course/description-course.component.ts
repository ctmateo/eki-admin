import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import { APIService, CreateRequirementsInput, DeleteCourseByTagsInput, DeleteCourseByTeachersInput, DeleteRequirementsInput, UpdateCourseInput, UpdateRequirementsInput } from 'src/app/API.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { S3ManagerService } from 'src/app/services/s3-manager.service';
import { MatDialog } from '@angular/material/dialog';
import { PopUpRequerimentsComponent } from '../../pop-up-requeriments/pop-up-requeriments.component';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Storage } from 'aws-amplify';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddTeacherComponent } from 'src/app/shared-components/add-teacher/add-teacher.component';
@Component({
  selector: 'app-description-course',
  templateUrl: './description-course.component.html',
  styleUrls: ['./description-course.component.sass']
})
export class DescriptionCourseComponent {
  @Input() course;
  courseDetailForm;
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  tags: string[] = [];
  allTags: any = [];
  image = '';
  video = '';
  requirements: any = [];
  teachers: any = [];
  itemSelected = -1;
  @ViewChild('tagInput') fruitInput!: ElementRef<HTMLInputElement>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  courseEditable = false;
  multimediaEditable = false;
  fileType;
  imageFile;
  videoFile;
  debounceTimer;
  constructor(private api: APIService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private s3ManagerService: S3ManagerService) {
      

    api.ListTags().then((data: any) => {

      this.allTags = data.items.map(element => {
        return element.name
      })
    }).catch(err => console.error(err))
  }

  ngOnInit() {
    this.course.requirements.items.forEach(element => {
      this.requirements.push(element.requirement)
    });
    this.course.tags.items.forEach(tag => {
      this.tags.push(tag.tag.name);
    });

    if (this.course?.keyImagePresentation) {
      this.s3ManagerService.getUrlFile(this.course.keyImagePresentation.replace('public/', '')).then(data => {
        this.image = data;
      });
    }

    if (this.course?.keyVideoPresentation) {
      this.s3ManagerService.getUrlFile(this.course.keyVideoPresentation.replace('public/', '')).then(data => {
        this.video = data;
      });
    }

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allTags.slice())),
    );
    
    this.getTeacherImages();
    this.courseDetailForm = new FormGroup({
      name: new FormControl(this.course?.name || "", Validators.required),
      descShort: new FormControl(this.course?.descriptionCourse || "", Validators.required),
      descLong: new FormControl(this.course?.longDescriptionCourse || "", Validators.required),
      keyImagePresentation: new FormControl(this.course?.keyImagePresentation || "", Validators.required),
      keyVideoPresentation: new FormControl(this.course?.keyVideoPresentation || "", Validators.required)
    });
  }

  async getTeacherImages(){
    for (const teacher of this.course.teachers.items) {
      teacher.teacher.keyPhoto = await Storage.get(teacher.teacher.keyPhoto);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    

    // Add our fruit
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      const tagToDelete = this.course.tags.items.filter(element => element.tag.name === tag)
      let deleteCourseByTag: DeleteCourseByTagsInput = {
        id: tagToDelete[0].id
      }
      this.api.DeleteCourseByTags(deleteCourseByTag).then(data => {
        this.course.tags.items = this.course.tags.items.filter(element => element.tag.name != tag)
        this.snackBar.open('El tag ha sido borrado', undefined, { duration: 2000 });
      }).catch(err => console.error(err))
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const filter = {name: {eq: event.option.viewValue}}
        let tag
        this.api.ListTags(filter).then(data => {
          tag = data.items[0];
          this.api.CreateCourseByTags({
            courseID: this.course.id,
            courseByTagsTagId: tag.id
          }).then(data => {
            this.course.tags.items.push(data);
            this.tags.push(event.option.viewValue);
          })
          .catch(err => console.error(err))
        }).catch(err => console.error(err))
    this.fruitInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  openRequirements() {
    let inputRequirements: CreateRequirementsInput;
    const dialogRef = this.dialog.open(PopUpRequerimentsComponent,
      {
        width: "700px",
        height: "350px",
        data: {
          type: 'CREATE'
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        inputRequirements = {
          courseID: this.course.id,
          requirement: result,
          sortIndex: this.requirements.length
        }
        this.api.CreateRequirements(inputRequirements).then(data => {
          
          this.requirements.push(result);
        }).catch(err => console.error(err))

      }

    });
  }

  editRequirements(requirements, index) {
    const dialogRef = this.dialog.open(PopUpRequerimentsComponent,
      {
        width: "700px",
        height: "350px",
        data: {
          type: 'EDIT'
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        const requierementEdit = this.course.requirements.items.find(element => element.requirement == requirements);
        let edicRequirementInput:UpdateRequirementsInput  = {
          id: requierementEdit.id,
          requirement: result
        }
        this.api.UpdateRequirements(edicRequirementInput).then(data => {
          this.requirements[index] = result;
        }).catch(err => console.error(err))
      }
      
    });
  }

  deleteRequirement(requirement) {
    this.requirements = this.requirements.filter(element => element != requirement)
    const requierementDelete = this.course.requirements.items.find(element => element.requirement == requirement);
    let deleteRequirementInput: DeleteRequirementsInput = {
      id: requierementDelete.id
    }
    this.api.DeleteRequirements(deleteRequirementInput).then(data => {
      this.snackBar.open('El requerimiento ha sido borrado', undefined, { duration: 2000 });
    }).catch(err => console.error(err))
  }

  drop(event: CdkDragDrop<string[]>, array) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }

  async addImageFile(event): Promise<void> {
    if (["image/jpg", "image/png", "image/jpeg"].includes(event.target.files[0].type)) {
      this.imageFile = event.target.files[0];
      const newImageName = `${this.course.id}-image`; // Specify the new file name
      const newImage = new File([this.imageFile], newImageName, { type: this.imageFile.type });
      this.uploadFile(newImage);
    }
    else {
      console.error('Document is not support');
      this.snackBar.open('Error, por favor adjunta una imagen con formato valido (jpg,jpeg,png)', undefined, { duration: 2000 });
    }
  }

  async addVideoFile(event): Promise<void> {
    if ("video/mp4" === event.target.files[0].type) {
      this.videoFile = event.target.files[0];
      const newVideoName = `${this.course.id}-video`; // Specify the new file name
      const newVideo = new File([this.videoFile], newVideoName, { type: this.videoFile.type });
      this.uploadFile(newVideo);
    } else {
      console.error('Document is not support');
      this.snackBar.open('Error, por favor adjunta un video en formato mp4', undefined, { duration: 2000 });
    }
  }

  uploadFile(file) {
    if (file) {
      try {
        const key = `courseImage/${file.name}`; // The S3 key where you want to store the file
        const uploadedKey = this.s3ManagerService.uploadFile(file, key);
        this.snackBar.open('El archivo ha sido actualizado', undefined, { duration: 2000 });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  searchTeacher(event) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer)

    this.debounceTimer = setTimeout(() => {
      this.api.ListTeachers({ fullName: { contains: event.target.value } }).then((async data => {
        this.teachers = data.items;
        for (const teacher of this.teachers) {
          teacher.keyPhoto = await Storage.get(teacher.keyPhoto);
        }
      })).catch(err => console.error(err))
    }, 350)

  }

  saveShortDesc() {
    let updateCourseInput: UpdateCourseInput = {
      id: this.course.id,
      name: this.courseDetailForm.controls['name'].value,
      descriptionCourse: this.courseDetailForm.controls['descShort'].value,
    }
    this.api.UpdateCourse(updateCourseInput).then(data => {
      this.snackBar.open('El curso ha sido actualizado', undefined, { duration: 2000 });
    }).catch(err => console.error(err))
  }

  saveLongDesc(){
    let updateCourseInput: UpdateCourseInput = {
      id: this.course.id,
      longDescriptionCourse: this.courseDetailForm.controls['descLong'].value,
    }
    this.api.UpdateCourse(updateCourseInput).then(data => {
      this.snackBar.open('El curso ha sido actualizado', undefined, { duration: 2000 });
    }).catch(err => console.error(err))
  }

  deleteTeacher(teacher){
    let deleteTeacherInput: DeleteCourseByTeachersInput = {
      id: teacher.id
    }
    this.api.DeleteCourseByTeachers(deleteTeacherInput).then(data => {
      
      this.course.teachers.items = this.course.teachers.items.filter(element => element.id !==  deleteTeacherInput.id)
    }).catch(err => console.error(err));

  }

  addTeacher(){
    const dialogRef = this.dialog.open(AddTeacherComponent,
      {
        width: "700px",
        height: "550px",
        data: {
          course: this.course
        },
      })
      dialogRef.afterClosed().subscribe(async (result) => {
        await Storage.get(result.teacher.keyPhoto);
        this.course.teachers.items.push(result)
      });
  }

  cancel() {

  }
}
