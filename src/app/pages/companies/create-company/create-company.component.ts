import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService, DocumentType, Role } from 'src/app/API.service';
import { payloadCreateUserAny } from 'src/app/config/enumTypes';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomAsyncValidators } from 'src/app/validator/customAsyncValidators';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.sass']
})
export class CreateCompanyComponent {
  isProcessing = false
  companyForm: FormGroup;
  payloadCreateCompany: payloadCreateUserAny = {} as payloadCreateUserAny;
  economicSector;
  documentType = Object.values(DocumentType);
  today = new Date()

  @ViewChildren('formControl')
  formControls!: QueryList<ElementRef>;

  @ViewChild('scrollDiv')
  scrollDiv!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CreateCompanyComponent>,
    private snackBar: MatSnackBar,
    private utils: UtilsService,
    private customAsyncValidators: CustomAsyncValidators,
    private api: APIService) {
    this.companyForm = new FormGroup({
      name: new FormControl('', Validators.required),
      nit: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required], [this.customAsyncValidators.createValidator(this.api)]),
      contactNumber: new FormControl('', Validators.required),
      contactIndicator: new FormControl('', Validators.required),
      contactName: new FormControl('', Validators.required),
      contactLastname: new FormControl('', Validators.required),
      attorneyName: new FormControl('', undefined),
      attorneySurname: new FormControl('', undefined),
      attorneyTypeDoc: new FormControl('', undefined),
      attorneyDocNumber: new FormControl('', undefined),
      industry: new FormControl('', Validators.required),
      numberDemos: new FormControl('', Validators.required),
      expirationDateDemo: new FormControl('', Validators.required),
    })
    this.getEconomicSector();
  }

  cancel() {
    this.dialogRef.close("");
  }

  getEconomicSector() {
    this.api.ListClassifiersByCategory('economicSector').then(data => {
      this.economicSector = data.items;
    }).catch(err => console.error(err));
  }

  create() {
    if (this.companyForm.valid) {

      this.isProcessing = true
      this.payloadCreateCompany = {
        role: Role.bussiness,
        user: {
          email: this.companyForm.controls['email'].value,
          name: this.companyForm.controls['contactName'].value,
          lastname: this.companyForm.controls['contactLastname'].value,
          phone: this.companyForm.controls['contactIndicator'].value + this.companyForm.controls['contactNumber'].value,
          profileImageUrl: ""
        },
        company: {
          nameCompany: this.companyForm.controls['name'].value,
          nit: this.companyForm.controls['nit'].value,
          logoCompany: "keyLogo",
          economicSectorID: this.companyForm.controls['industry'].value,
          dateUnsubcribe: this.utils.convertToAwsDateTime(new Date(this.companyForm.controls['expirationDateDemo'].value)),
          limitUsers: this.companyForm.controls['numberDemos'].value,
          legalName: this.companyForm.controls['attorneyName'].value === "" ? null : this.companyForm.controls['attorneyName'].value,
          legalSurname: this.companyForm.controls['attorneySurname'].value === "" ? null : this.companyForm.controls['attorneySurname'].value,
          legalDocument: this.companyForm.controls['attorneyTypeDoc'].value === "" ? null : this.companyForm.controls['attorneyTypeDoc'].value,
          legalDocumentNumber: this.companyForm.controls['attorneyDocNumber'].value === "" ? null : this.companyForm.controls['attorneyDocNumber'].value,
        }
      }

      this.api.CreateUserAny(JSON.stringify(this.payloadCreateCompany)).then(data => {
        this.dialogRef.close("Company Created");
        this.snackBar.open('El empresa ha sido creada', undefined, {
          duration: 6000
        });
      }).catch(err => {
        console.error(err)
        this.snackBar.open('Ha ocurrido un error, inténtelo de nuevo', undefined, {
          duration: 8000
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
      const control = this.companyForm.get(formControl.nativeElement.id);
      if (control?.invalid) {
        return formControl;
      }
    }
    return undefined;
  }

}

