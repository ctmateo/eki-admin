import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.sass']
})
export class AddFileComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() completed!: boolean;
  @Input() fileType!: string;

  @Output() callBackFileChange = new EventEmitter<any>();
  @ViewChild("fileDropRef", { static: false })
  fileDropEl!: ElementRef;
   hasFile: boolean = false;

   fileBrowseHandler(event: any ,type) {
    if (this.completed) {
      this.hasFile = true;
    }
    if(type === 'dragged'){
      this.callBackFileChange.emit(event);
    }else if(type === 'button'){
      this.callBackFileChange.emit(event.target.files[0]);
    }
    
  }
}
