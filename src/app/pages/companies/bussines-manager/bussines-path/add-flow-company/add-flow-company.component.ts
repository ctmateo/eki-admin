import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService } from 'src/app/API.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';

export interface DialogData {
  companyId: string;
  path?: any;
}
export interface SelectCatalog {
  id: string;
  name: string;
  tag: any[];
  courses: any[];
}

@Component({
  selector: 'app-add-flow-company',
  templateUrl: './add-flow-company.component.html',
  styleUrls: ['./add-flow-company.component.sass']
})
export class AddFlowCompanyComponent implements AfterViewInit {
  companyId = ""
  isLinear = false
  displayedColumns: string[] = ['select', 'name', 'tags']
  catalog: any[] = []
  filterForm: FormGroup;
  selection = new SelectionModel<SelectCatalog>(false);

  limitElements = 5;
  searchFinish = false;
  tokens = [{ count: 5, token: "" }];
  lengthPath = 5;
  maxLength = -1;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isLoading = false

  selectedPath: any = {}
  selectedCourse: any = {}
  @ViewChild('stepper') stepper!: MatStepper;


  constructor(
    public dialogRef: MatDialogRef<AddFlowCompanyComponent>,
    private api: APIService,
    @Inject(MAT_DIALOG_DATA) public datadialog: DialogData) {

    this.filterForm = new FormGroup({
      value: new FormControl('', Validators.required)
    })
  }

  async ngAfterViewInit() {
    this.getPath('');
    if (this.datadialog.path) {
      this.loadTrending()
    }
  }

  cancel() {
    this.dialogRef.close("")
  }

  getPath(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.isLoading = true
    this.api.ListLearningPaths(undefined, this.limitElements, token).then((data: any) => {
      this.catalog = data.items.map((item) => {

        const tags = item?.tags?.items.map((element) => {
          return element?.tag?.name
        })

        const courses = item?.courseFromPath?.items.map((element) => {
          return element?.course
        })

        return {
          name: item?.name,
          id: item?.id,
          tags: tags,
          courses: courses
        }
      })

      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthPath = ((this.tokens.length - 1) * 5) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthPath = ((this.tokens.length - 1) * 5) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err)).finally(() => {
      this.isLoading = false
    })
  }

  pageChange(event: any) {
    this.selection.clear()
    this.getPath(this.tokens[event.pageIndex].token, event)
  }

  toggleSelection(item: SelectCatalog): void {
    this.selection.toggle(item);
  }

  hasSelectedItems(): boolean {
    return this.selection.selected.length > 0;
  }

  nextStep() {
    const nextStepIndex = this.stepper.selectedIndex + 1;
    this.stepper.selectedIndex = nextStepIndex;
  }

  async loadTrending() {

    this.nextStep()

    const courses = this.datadialog.path?.courseFromPath?.items.map((element) => {
      return element?.course
    })

    const tags = this.datadialog.path?.tags?.items.map((element) => {
      return element?.tag?.name
    })

    this.selectedPath = {
      name: this.datadialog.path?.name,
      id: this.datadialog.path?.id,
      tags: tags,
      courses: courses
    }


    this.selectedCourse = await Promise.all(this.selectedPath.courses.map(async (element) => {
      const course = await this.api.GetCourse(element.id);
      return {
        ...element,
        module: course.modules?.items
      };
    }));
  }

  async loadCourse() {
    this.selectedPath = this.selection.selected[0]

    this.selectedCourse = await Promise.all(this.selectedPath.courses.map(async (element) => {
      const course = await this.api.GetCourse(element.id);
      return {
        ...element,
        module: course.modules?.items
      };
    }));
  }

  selectPath() {
    this.dialogRef.close(this.selectedPath.id)
  }
}
