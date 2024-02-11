import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { S3ManagerService } from 'src/app/services/s3-manager.service';

export interface DialogData {
  content: string;
}

@Component({
  selector: 'app-view-content-course',
  templateUrl: './view-content-course.component.html',
  styleUrls: ['./view-content-course.component.sass']
})
export class ViewContentCourseComponent {
  multimedia;
  video;
  image;
  constructor(@Inject(MAT_DIALOG_DATA) public datadialog: DialogData,
              private s3ManagerService: S3ManagerService){
    
  }
  ngOnInit(){
    this.multimedia = this.datadialog.content;
    console.log(this.multimedia);
    if(this.multimedia.classVideo){
      let keyVideo = this.multimedia.classVideo.videoKey480.replace('public/','');
      this.s3ManagerService.getUrlFile(keyVideo).then(data => {
        this.video = data;
      });
    }else if(this.multimedia.infographic){
      let keyImage = this.multimedia.infographic.keyImage.replace('public/','');
      this.s3ManagerService.getUrlFile(keyImage).then(data => {
        this.image = data;
      });
    }
    
  }

  
}
