import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { APIService, UpdateContentModuleInput, UpdateModuleInput } from 'src/app/API.service';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ViewContentCourseComponent } from 'src/app/shared-components/view-content-course/view-content-course.component';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-content-course',
  templateUrl: './content-course.component.html',
  styleUrls: ['./content-course.component.sass']
})
export class ContentCourseComponent {

  panelOpenState = false;
  @Input() course;
  modules;
  @ViewChild('matAccordion') accordion!: any;
  moduleSelected: any = [];
  buttonsDisabled = false;

  constructor(private api: APIService,
              private utils: UtilsService,
              private dialog: MatDialog) {

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.api.ModuleByCourseModulesId(this.course).then(data => {
      this.modules = data.items;
      this.modules = this.modules.map(element => {
        element.content.items.sort(this.compareFn);
        return {
          ...element,
          isSelected: false
        }
      })
      console.log(this.modules);
    }).catch(err => console.error(err))
  }

  moveUp() {
    this.buttonsDisabled = true;
    let selected = this.moduleSelected[0];
    let moved = this.modules[selected.sortIndex - 2];
    if (selected.sortIndex >= 2) {
      this.modules[selected.sortIndex - 1] = moved;
      this.modules[selected.sortIndex - 1].sortIndex = moved.sortIndex + 1;
      this.modules[selected.sortIndex - 1].isSelected = false;
      this.modules[moved.sortIndex - 1] = selected;
      this.modules[moved.sortIndex - 1].sortIndex = selected.sortIndex - 1;
      this.modules[moved.sortIndex - 1].isSelected = false;
      this.modules.sort(this.compareFn);
      let inputSelected: UpdateModuleInput = {
        id: this.modules[moved.sortIndex-1].id,
        sortIndex: this.modules[moved.sortIndex-1].sortIndex
      }
      let inputMoved: UpdateModuleInput = {
        id: this.modules[selected.sortIndex - 1].id,
        sortIndex: this.modules[selected.sortIndex - 1].sortIndex
      }
      this.updateModules(inputSelected,inputMoved);
      this.moduleSelected = [];
    }else{
      this.buttonsDisabled = false;
    }
  }



  async moveDown() {
    this.buttonsDisabled = true;
    let selected = this.moduleSelected[0];
    if (selected.sortIndex < this.modules.length) {
      let moved = this.modules[selected.sortIndex];
      this.modules[selected.sortIndex - 1] = moved;
      this.modules[selected.sortIndex - 1].sortIndex = moved.sortIndex - 1;
      this.modules[selected.sortIndex - 1].isSelected = false;
      this.modules[moved.sortIndex] = selected;
      this.modules[moved.sortIndex].sortIndex = selected.sortIndex + 1;
      this.modules[moved.sortIndex].isSelected = false;
      await this.modules.sort(this.compareFn);
      let inputSelected: UpdateModuleInput = {
        id: this.modules[moved.sortIndex-1].id,
        sortIndex: this.modules[moved.sortIndex-1].sortIndex
      }
      let inputMoved: UpdateModuleInput = {
        id: this.modules[selected.sortIndex - 1].id,
        sortIndex: this.modules[selected.sortIndex - 1].sortIndex
      }
      this.updateModules(inputSelected,inputMoved);
      
      this.moduleSelected = [];
    }else{
      this.buttonsDisabled = false;
    }
  }

  compareFn(a, b) {
    if (a.sortIndex < b.sortIndex) {
      return -1;
    }
    if (a.sortIndex > b.sortIndex) {
      return 1;
    }
    return 0;
  }

  updateModules(inputSelected: UpdateModuleInput, inputMoved: UpdateModuleInput) {

    this.api.UpdateModule(inputSelected).then(data => {
      console.log(data);
      this.api.UpdateModule(inputMoved).then(data => {
        console.log(data);
      }).catch(err => console.error(err))
      .finally(()=> this.buttonsDisabled = false)
    }).catch(err => console.error(err))
   
  }

  onCheckboxChange(item: any) {
    if (item.isSelected) {
      this.moduleSelected.push(item);
    } else {
      const index = this.moduleSelected.indexOf(item);
      if (index >= 0) {
        this.moduleSelected.splice(index, 1);
      }
    }
    console.log(this.moduleSelected);
  }

  drop(event: CdkDragDrop<string[]>, array) {
    moveItemInArray(array, event.previousIndex, event.currentIndex);
    array.forEach((element,index) => {
      let input: UpdateContentModuleInput = {
        id: element.id,
        sortIndex: index + 1
      }
      this.api.UpdateContentModule(input)
              .then(data => console.log(data))
              .catch(err => console.error(err));
    });
  }
  visualizeContent(multimedia){
    const dialogRef = this.dialog.open(ViewContentCourseComponent,
      {
        data: {
          content: multimedia
        },
        width: "600px"
      })
  }

  goToExam(testContent){
    this.utils.goToRouter('forms/detail/' + testContent.test.id )
  }

}
