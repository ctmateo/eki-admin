import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Storage } from 'aws-amplify';
import { APIService } from 'src/app/API.service';
import { ActivatedRoute } from '@angular/router';
import { S3ManagerService } from 'src/app/services/s3-manager.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

const TIME_SNACK = 4
@Component({
  selector: 'app-bussines-profile',
  templateUrl: './bussines-profile.component.html',
  styleUrls: ['./bussines-profile.component.sass']
})
export class BussinesProfileComponent implements OnInit {
  @ViewChild('fileInput')
  fileInput!: ElementRef;

  company: any
  logo: any
  hasUpdate = true
  idBussines: any

  constructor(
    private api: APIService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private s3: S3ManagerService
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.idBussines = params.get('id');
      this.company = await this.api.GetCompanyData(this.idBussines);
      this.logo = await Storage.get(this.company.logoCompany);
    });
  }

  openSnackBar(message: string) {
    let config = new MatSnackBarConfig();
    config.duration = TIME_SNACK * 1000;
    this.snackBar.open(message, undefined, config);
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any): Promise<void> {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const fileSizeInKB = selectedFile.size / 1024;
      if (fileSizeInKB > 60) {
        this.openSnackBar("❌ ¡Error! El archivo excede los 60 KB permitidos.")
        return;
      }

      try {
        const imageKey = await this.s3.uploadFile(selectedFile, `company/${selectedFile.name}`)
        console.log(imageKey)
      } catch (err) {
        console.error(err)
        this.openSnackBar("❌ Hubo un problema al intentar actualizar la información. Por favor, vuelve a intentarlo.")
        return;
      }
      this.openSnackBar("✔️ Se ha subido un nuevo logo")
    }
  }
}
