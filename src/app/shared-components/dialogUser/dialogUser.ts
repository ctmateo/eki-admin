import {Component} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


@Component({
    selector: 'dialog-elements-example-dialog',
    templateUrl: 'dialogUser.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
  })
  export class DialogUser {}