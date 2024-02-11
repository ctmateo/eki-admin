import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  payload: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass']
})
export class ConfirmDialogComponent {

  title = ""
  message = ""
  payload = ""

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public datadialog: DialogData
  ) {
    this.title = datadialog.title
    this.message = datadialog.message
    this.payload = datadialog.payload
  }
  
  confirmAction() {
    this.dialogRef.close(this.payload)
  }
}
