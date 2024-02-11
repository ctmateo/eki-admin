import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService, Role } from 'src/app/API.service';
import { payloadCreateUserAny } from 'src/app/config/enumTypes';
import { CustomAsyncValidators } from 'src/app/validator/customAsyncValidators';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.sass']
})
export class CreateUsersComponent {
  userForm!: FormGroup;
  payloadCreateAdmin: payloadCreateUserAny = {} as payloadCreateUserAny;
  isProcessing = false

  constructor(
    private customAsyncValidators: CustomAsyncValidators,
    public dialogRef: MatDialogRef<CreateUsersComponent>,
    private snackBar: MatSnackBar,
    private api: APIService) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required], [this.customAsyncValidators.createValidator(this.api)]),
      codeCountry: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required)
    })
  }

  cancel() {
    this.dialogRef.close("")
  }

  create() {
    if (this.userForm.valid) {
      this.isProcessing =  true
      this.payloadCreateAdmin = {
        role: Role.admin,
        user: {
          email: this.userForm.controls['email'].value,
          name: this.userForm.controls['name'].value,
          lastname: this.userForm.controls['lastName'].value,
          phone: this.userForm.controls['codeCountry'].value + this.userForm.controls['phoneNumber'].value,
          profileImageUrl: ""
        },
        admin: {
          rolInCompany: ""
        },
      }

      this.api.CreateUserAny(JSON.stringify(this.payloadCreateAdmin)).then(data => {
        this.dialogRef.close("User Created");
        this.snackBar.open('El usuario ha sido creado', undefined,{
          duration: 6000
        });
      }).catch(err => {
        console.error(err)
        this.snackBar.open('Ha ocurrido un error, inténtelo de nuevo', undefined,{
          duration: 6000
        });
        this.dialogRef.close();
      }).finally(() => {
        this.isProcessing =  false
      })
    }
  }
}
