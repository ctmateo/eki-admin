import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: '';
  message: '';
}
@Component({
  selector: 'app-pop-up-requeriments',
  templateUrl: './pop-up-requeriments.component.html',
  styleUrls: ['./pop-up-requeriments.component.sass']
})
export class PopUpRequerimentsComponent {
  requirement;
  type;
  title;
  constructor(public dialogRef: MatDialogRef<PopUpRequerimentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.type = data.type
    if (this.type === 'CREATE') {
      this.title = 'Creación de requisitos'
    } else if (this.type === 'EDIT') {
      this.title = 'Edición de requisitos'
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }
}
