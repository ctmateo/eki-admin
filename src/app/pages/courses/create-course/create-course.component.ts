import { Component, ElementRef, NgZone, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith, take } from 'rxjs';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { icons } from 'src/app/config/enumTypes';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { APIService, CreateCourseByTagsInput, CreateCourseByTeachersInput, CreateCourseInput, CreateRequirementsInput, UpdateRequirementsInput } from 'src/app/API.service';
import { Storage } from 'aws-amplify';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { PopUpRequerimentsComponent } from '../pop-up-requeriments/pop-up-requeriments.component';
import { S3ManagerService } from 'src/app/services/s3-manager.service';

export enum ACL {
  PRIVATE = "private",
  PUBLIC_READ = "public-read",
  PUBLIC_READ_WRITE = "public-read-write",
  AUTHENTICATED_READ = "authenticated-read",
  AWS_EXEC_READ = "aws-exec-read",
  BUCKET_OWNER_READ = "bucket-owner-read",
  BUCKET_OWNER_FULL_CONTROL = "bucket-owner-full-control",
}
@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.sass']
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: any = [];
  color = "#7D06AD";
  dataTeacherSource;
  showSelectorImages = false;
  icons = icons;
  currentIconType: IconPrefix = 'fas';
  currentIconName: IconName = 'rocket';
  teachers: any = [];
  teacherSelected;
  itemSelected = -1;
  requirements: any = [];
  imageUploaded = false;
  videoUploaded = false;
  multimediaFile;
  folderName;
  loadImageCompleted = true;
  loadVideoCompleted = true;
  imageFile;
  videoFile;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChild('tagInput') fruitInput!: ElementRef<HTMLInputElement>;
  @ViewChild('IconSelector') iconSelector !: ElementRef;

  constructor(private _ngZone: NgZone,
    private api: APIService,
    public dialog: MatDialog,
    private s3ManagerService: S3ManagerService,
    private snackBar: MatSnackBar,
    private route: Router,
    private renderer: Renderer2) {
    api.ListTags().then((data: any) => {
      this.allTags = data.items.map(element => {
        return element.name
      })

    }).catch(err => console.error(err))

    this.courseForm = new FormGroup({
      name: new FormControl('', Validators.required),
      descShort: new FormControl('', Validators.required),
      descLong: new FormControl('', Validators.required),
      teacher: new FormControl('', Validators.required),
      keyImagePresentation: new FormControl('', Validators.required),
      keyVideoPresentation: new FormControl('', Validators.required)
    });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allTags.slice())),
    );

    this.renderer.listen('window', 'click', (e: Event) => {
      if ((this.showSelectorImages === true && e.target !== this.iconSelector.nativeElement)) {
        this.showSelectorImages = false;
      }
    });
  }

  ngOnInit() {
    this.getTeachers();
  }

  getTeachers() {
    this.api.ListTeachers().then((async data => {
      this.teachers = data.items;
      for (const teacher of this.teachers) {
        teacher.keyPhoto = await Storage.get(teacher.keyPhoto);
        console.log(teacher.keyPhoto);
      }
    })).catch(err => console.error(err))
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.allTags = this.allTags.filter(element => element != event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  selectTeacher(i, option) {
    this.itemSelected = i;
    this.teacherSelected = option;
    this.courseForm.patchValue({ teacher: option.id });
    
  }

  changeIconCourse(type, name) {
    this.currentIconType = type;
    this.currentIconName = name;
  }

  change() {
    this.showSelectorImages = true;
  }

  cancel() {
    this.route.navigateByUrl('/courses/list-courses')
  }

  create() {
    let courseCreated;
    const input: CreateCourseInput = {
      colorIcon: this.color,
      countContentByCourse: 0,
      countModulesByCourse: 0,
      descriptionCourse: this.courseForm.controls['descShort'].value,
      longDescriptionCourse: this.courseForm.controls['descShort'].value,
      keyIcon: this.currentIconName + '?' + this.currentIconType,
      name: this.courseForm.controls['name'].value
    }
    
    this.api.CreateCourse(input).then(async response => {
      const inputCourseByTeachers:CreateCourseByTeachersInput = {
        courseID: response.id,
        courseByTeachersTeacherId: this.teacherSelected.id
      }

      this.tags.forEach(element => {
        const filter = {name: {eq: element}}
        let tag
        this.api.ListTags(filter).then(data => {
          tag = data.items[0];
          this.api.CreateCourseByTags({
            courseID: response.id,
            courseByTagsTagId: tag.id
          }).catch(err => console.error(err))
        }).catch(err => console.error(err))
      })
      
      this.api.CreateCourseByTeachers(inputCourseByTeachers).then(data=> {
        
      }).catch(err => console.error(err));

      this.requirements.forEach((element,index) => {
        const inputRequeriments: CreateRequirementsInput = {
            courseID: response.id,
            requirement: element,
            sortIndex: index + 1
        };
        this.api.CreateRequirements(inputRequeriments).then(data => {
          
        }).catch(err => console.error(err));
      });

      if(this.videoFile && this.imageFile){
        const newVideoName = `${response.id}-video`; // Specify the new file name
        const newVideo = new File([this.videoFile], newVideoName, { type: this.videoFile.type });
        const newImageName = `${response.id}-image`; // Specify the new file name
        const newImage = new File([this.imageFile], newImageName, { type: this.imageFile.type });
        this.uploadFile(newVideo);
        this.uploadFile(newImage);
        this.api.UpdateCourse({
          id: response.id,
          keyImagePresentation: newImageName,
          keyVideoPresentation: newVideoName
        })
          .then()
          .catch(err => console.error(err));
      }
      this.snackBar.open('El curso ha sido creado', undefined, { duration: 2000 });
      this.route.navigateByUrl('courses/list-courses');
        
    }).catch(err => console.error(err));
  }

  openRequirements() {
    const dialogRef = this.dialog.open(PopUpRequerimentsComponent,
      {
        width: "700px",
        height: "350px",
        data: {
          type: 'CREATE'
        }
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        this.requirements.push(result);
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
      if (result != undefined)
        this.requirements[index] = result;
    });
  }

  deleteRequirement(requirement) {
    this.requirements = this.requirements.filter(element => element != requirement)
  }

  drop(event: CdkDragDrop<string[]>, array) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
  }

  async addImageFile(event): Promise<void> {
    if (["image/jpg", "image/png", "image/jpeg"].includes(event.type)) {
      this.imageFile = event;
    }
    else {
      console.error('Document is not support');
      this.snackBar.open('Error, por favor adjunta una imagen con formato valido (jpg,jpeg,png)', undefined, { duration: 2000 });
    }
  }

  async addVideoFile(event): Promise<void> {
    if (["video/mp4"].includes(event.type)) {
      this.videoFile = event;
    } else {
      console.error('Document is not support');
      this.snackBar.open('Error, por favor adjunta un video en formato mp4', undefined, { duration: 2000 });
    }
  }

  uploadFile(file){
    if (file) {
      try {
        const key = `courseImage/${file.name}`; // The S3 key where you want to store the file
        const uploadedKey =  this.s3ManagerService.uploadFile(file, key);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

}
