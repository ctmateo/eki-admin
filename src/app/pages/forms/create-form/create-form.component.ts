import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.sass']
})
export class CreateFormComponent {
  testForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateFormComponent>,
  ){
    this.testForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
    })
  }

  create(){
    const test = {
      name: this.testForm.controls['name'].value,
      description: this.testForm.controls['description'].value,
      isPublish: false
    }
    this.dialogRef.close(test);
  }
}
