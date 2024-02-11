import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DeleteForm {
  idForm: string
  contentModuleId: string
  nameForm: string
}

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.sass']
})
export class DeleteFormComponent {
  idForm = ""
  contentModuleId: any = null
  nameForm: any = null


  constructor(
    public dialogRef: MatDialogRef<DeleteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteForm
  ) {
    this.idForm = data.idForm
    this.contentModuleId = data.contentModuleId
    this.nameForm = data.nameForm
  }

  delete() {
    this.dialogRef.close({ id: this.idForm });
  }
}
