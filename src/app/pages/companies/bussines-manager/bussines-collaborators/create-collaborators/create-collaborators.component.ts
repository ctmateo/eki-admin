import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService, Role, StateAccount } from 'src/app/API.service';
import { CustomAsyncValidators } from 'src/app/validator/customAsyncValidators';

export interface DialogData {
  companyId: string;
}

@Component({
  selector: 'app-create-collaborators',
  templateUrl: './create-collaborators.component.html',
  styleUrls: ['./create-collaborators.component.sass']
})
export class CreateCollaboratorsComponent {
  userForm!: FormGroup
  isProcessing = false
  companyId = ""

  colaboratoState = [
    {
      name: "Activo",
      value: "ACTIVE",
    },
    {
      name: "Inactivo",
      value: "DISABLED",
    },
  ]

  constructor(
    private customAsyncValidators: CustomAsyncValidators,
    public dialogRef: MatDialogRef<CreateCollaboratorsComponent>,
    private snackBar: MatSnackBar,
    private api: APIService,
    @Inject(MAT_DIALOG_DATA) public datadialog: DialogData) {
    this.companyId = datadialog?.companyId

    this.userForm = new FormGroup({
      stateCollaborator: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\+\d{10,15}(?:\s?\d{0,15})?$/)], [this.customAsyncValidators.phoneIdValidator(this.api)])
    })
    
  }

  cancel() {
    this.dialogRef.close("")
  }

  create() {
    if (this.userForm.valid) {
      this.isProcessing = true

      const payload = {
        role: Role.employee,
        user: {
          email: this.userForm.controls['email'].value,
          name: this.userForm.controls['name'].value,
          lastname: this.userForm.controls['lastname'].value,
          phone: this.userForm.controls['phone'].value.replace("+", ""),
        },
        collaborator: {
          fullName: `${this.userForm.controls['name'].value} ${this.userForm.controls['lastname'].value}`,
          positionInTheCompany: this.userForm.controls['position'].value,
          companyID: this.companyId,
          stateCollaborator: this.userForm.controls['stateCollaborator'].value,
        }
      }

      this.api.CreateCollaborator(JSON.stringify(payload)).then(data => {
        this.dialogRef.close(payload);
        this.snackBar.open('El usuario ha sido creado', undefined, {
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
    }
  }

  public mockCollaborator() {
    this.userForm.controls['email'].setValue("carlos@mail.com")
    this.userForm.controls['name'].setValue("carlos")
    this.userForm.controls['lastname'].setValue("leon")
    this.userForm.controls['phone'].setValue("+5732919282")
    this.userForm.controls['position'].setValue("Director tecnico")
  }
}
