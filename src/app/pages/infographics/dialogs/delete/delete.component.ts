import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export interface Delete{
  idForm: string
  contentModuleId: string
  nameForm: string
}

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.sass']
})
export class DeleteComponent {
  idForm = ""
  contentModuleId: any = null
  nameForm: any = null
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Delete
  ){
    this.idForm = data.idForm
    this.contentModuleId = data.contentModuleId
    this.nameForm = data.nameForm
  }

  delete(){
    this.dialogRef.close({ id: this.idForm });
  }
}

