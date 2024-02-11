import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APIService } from 'src/app/API.service';
import { S3ManagerService } from 'src/app/services/s3-manager.service';

export interface edit{
  idForm: string,
  nameForm: string,
  descriptionForm:string,
  
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.sass']
})
export class EditComponent {
  @Output() infographicUpdated = new EventEmitter<string>();
  imageFile;
  idForm = ""
  nameForm=""
  descriptionForm=""
  infographicForm: FormGroup;

  constructor(
    private snackBar:MatSnackBar,
    private s3ManagerService: S3ManagerService,
    public dialogRef: MatDialogRef<EditComponent>,
    private api: APIService,
    @Inject(MAT_DIALOG_DATA) public data: edit
  ){
    this.nameForm = data.nameForm
    this.descriptionForm = data.descriptionForm
    this.infographicForm = new FormGroup({
      name: new FormControl(this.nameForm),
      description: new FormControl(this.descriptionForm),
    })
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

  edit() {
    const editInfographic = {
      id: this.data.idForm,
      name: this.infographicForm.controls['name'].value,
      description: this.infographicForm.controls['description'].value,
      keyImage: `classinfographic/${this.data.idForm + this.imageFile.name}`
    };
  
    this.api.UpdateClassinfographic(editInfographic)
      .then(() => {
        this.uploadFile(this.imageFile, editInfographic.keyImage)
        this.snackBar.open('Infografía actualizada con éxito', 'Cerrar', { duration: 2000 });
        this.dialogRef.close('Infografía actualizada con éxito');
        this.infographicUpdated.emit('Infographic has been updated')
      })
      .catch(error => {
        console.error('Error when editing infographic:', error);
        this.snackBar.open('Error al editar infografía', 'Cerrar', { duration: 2000 });
      });
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
