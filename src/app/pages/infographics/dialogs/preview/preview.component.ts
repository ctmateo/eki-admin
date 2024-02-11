import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { S3ManagerService } from 'src/app/services/s3-manager.service';

export interface Preview {
  keyImage: string;
}

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.sass'],
})
export class PreviewComponent implements OnInit {
  keyImage = '';
  presignedUrl = '';

  constructor(
    public dialogRef: MatDialogRef<PreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Preview,
    private s3service: S3ManagerService
  ) {
    this.keyImage = data.keyImage;
  }

  ngOnInit(): void {
    if (this.keyImage) {
      this.s3service
        .getUrlFile(this?.keyImage?.replace("public/", ""))
        .then((url: string) => {
          this.presignedUrl = url;
        })
        .catch((error) => console.error('Error getting presigned URL:', error));
    }
  }
}
