import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { SharedComponentsModule } from 'src/app/shared-components/shared-components.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { S3ManagerService } from 'src/app/services/s3-manager.service';
import { APIService } from 'src/app/API.service';



@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.sass']
})
export class CreateComponent {
  @Output() infographicCreated = new EventEmitter<string>();
  imageFile;
  isProcessing = false;
  infographicForm: FormGroup;
  
  constructor(
    private api: APIService,
    private s3ManagerService: S3ManagerService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateComponent>,
  ) {
    this.infographicForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
    });

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

  create() {
    if (this.infographicForm.valid) {
      this.isProcessing = true;
  
      const createInfographic = {
        name: this.infographicForm.controls['name'].value,
        description: this.infographicForm.controls['description'].value,
        contentModuleId: ' ', 
        keyImage: '', 
      };
  
      this.api.CreateClassinfographic(createInfographic)
        .then((result) => {
          const infographicId = result.id
          createInfographic.keyImage = `classinfographic/${infographicId + this.imageFile.name}`;

          return this.api.UpdateClassinfographic({
            id: infographicId,
            keyImage: createInfographic.keyImage
          })

        }).then(() => {
          this.uploadFile(this.imageFile, createInfographic.keyImage);
          this.infographicCreated.emit('Infographic has been created')
        })
        .catch((error) => {
          console.error('Error creating infographic:', error);
        });
    } else {
      this.snackBar.open('Formulario no valido')
    }
  }
  
  uploadFile(file, keyImage) {
    if (!file) {
      console.error('No file has been selected.');
      return;
    }
  
    const maxSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxSize) {
      this.snackBar.open('El archivo es demasiado grande. Por favor, elige un archivo menor a 50 MB.');
      return; 
    }
  
    let key = '';
    try {
      key = `${keyImage}`;
  
      const uploadedKey = this.s3ManagerService.uploadFile(file, key);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  

}
