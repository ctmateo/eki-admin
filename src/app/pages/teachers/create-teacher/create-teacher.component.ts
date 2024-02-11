import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService, Role } from 'src/app/API.service';
import { payloadCreateUserAny } from 'src/app/config/enumTypes';
import { S3ManagerService } from 'src/app/services/s3-manager.service';
import { CustomAsyncValidators } from 'src/app/validator/customAsyncValidators';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.sass']
})
export class CreateTeacherComponent {
  isProcessing = false
  teacherForm: FormGroup;
  nations;
  payloadCreateTeacher: payloadCreateUserAny = {} as payloadCreateUserAny;

  @ViewChildren('formControl')
  formControls!: QueryList<ElementRef>;

  @ViewChild('scrollDiv')
  scrollDiv!: ElementRef;

  imageFile;
  videoFile;
  
  constructor(
    private api: APIService,
    private snackBar: MatSnackBar,
    private s3ManagerService: S3ManagerService,
    private customAsyncValidators: CustomAsyncValidators,
    public dialogRef: MatDialogRef<CreateTeacherComponent>) {

    this.teacherForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required], [this.customAsyncValidators.createValidator(this.api)]),
      country: new FormControl(''),
      indicative: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      descripProfile: new FormControl('', Validators.required),
      descripExperience: new FormControl('', Validators.required),
      profileImage: new FormControl(''),
      profileVideo: new FormControl('')
    });

    this.api.ListCountries().then(data => {
      this.nations = data.items
      this.nations.sort((a, b) => {
        const nameA = a.countryName.toUpperCase();
        const nameB = b.countryName.toUpperCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    })
  }

  cancel() {
    this.dialogRef.close("");
  }

  create() {
    if (this.teacherForm.valid) {
      this.isProcessing = true
      this.payloadCreateTeacher = {
        role: Role.teacher,
        user: {
          email: this.teacherForm.controls['email'].value,
          name: this.teacherForm.controls['name'].value,
          lastname: this.teacherForm.controls['lastName'].value,
          phone: this.teacherForm.controls['indicative'].value + this.teacherForm.controls['phone'].value,
          profileImageUrl: ""
        },
        teacher: {
          descriptionProfile: this.teacherForm.controls['descripProfile'].value,
          descriptionTeaching: this.teacherForm.controls['descripExperience'].value,
          keyPhoto: `avatar/${this.teacherForm.controls['name'].value}${this.teacherForm.controls['lastName'].value}-${new Date().getTime()}-image`,
          keyVideo: `presentations_teacher/${this.teacherForm.controls['name'].value}${this.teacherForm.controls['lastName'].value}-${new Date().getTime()}-video`,
        }
      }

      

      this.api.CreateUserAny(JSON.stringify(this.payloadCreateTeacher)).then((data: any) => {
        let stringJson = data?.split('body=')[1];
        stringJson = stringJson.substring(0, stringJson.length - 1);
        let response = JSON.parse(stringJson);
        if (this.videoFile && this.imageFile) {
          const newVideoName = this.payloadCreateTeacher.teacher?.keyVideo || ''; // Specify the new file name
          const newVideo = new File([this.videoFile], newVideoName, { type: this.videoFile.type });
          const newImageName = this.payloadCreateTeacher.teacher?.keyPhoto || ''; // Specify the new file name
          const newImage = new File([this.imageFile], newImageName, { type: this.imageFile.type });
          this.uploadFile(newVideo);
          this.uploadFile(newImage);
        }
        this.dialogRef.close("Teacher Created");
        this.snackBar.open('El docente ha sido creado', undefined, {
          duration: 6000
        });
      }).catch(err => {
        console.error(err)
        this.snackBar.open('Ha ocurrido un error, inténtelo de nuevo', undefined, {
          duration: 6000
        });
        this.dialogRef.close();
      }).finally(() => {
        this.isProcessing = false
      })
    } else {
      const firstInvalidControl = this.findFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.nativeElement.scrollIntoView({ block: 'start', inline: 'nearest' });
        this.scrollDiv.nativeElement.scrollTop -= 40;
      }
    }
  }

  private findFirstInvalidControl(): ElementRef | undefined {
    for (const formControl of this.formControls) {
      const control = this.teacherForm.get(formControl.nativeElement.id);
      if (control?.invalid) {
        return formControl;
      }
    }
    return undefined;
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

  uploadFile(file) {
    let key = '';
    if (file) {
      try {
        if (["image/jpg", "image/png", "image/jpeg"].includes(file.type)) {
          key = `${file.name}`;
        }else if (["video/mp4"].includes(file.type)){
          key = `${file.name}`;
        }
        const uploadedKey = this.s3ManagerService.uploadFile(file, key);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }
}
