import { AfterViewInit, Component, Inject } from '@angular/core';
import { AddFlowCompanyComponent } from '../add-flow-company/add-flow-company.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';

export interface DialogData {
  companyId: string;
}

export interface SelectCollaborator {
  id: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-find-collaborator',
  templateUrl: './find-collaborator.component.html',
  styleUrls: ['./find-collaborator.component.sass']
})
export class FindCollaboratorComponent implements AfterViewInit {

  companyID: any
  displayedColumns: string[] = ['select', 'name', 'phone']
  collaborators: any[] = []
  filterForm: FormGroup;
  selection = new SelectionModel<SelectCollaborator>(false);

  limitElements = 10;
  searchFinish = false;
  tokens = [{ count: 10, token: "" }];
  lengthPath = 10;
  maxLength = -1;
  isLoading = false

  constructor(
    public dialogRef: MatDialogRef<AddFlowCompanyComponent>,
    private api: APIService,
    @Inject(MAT_DIALOG_DATA) public datadialog: DialogData
  ) {
    this.companyID = datadialog.companyId
    this.filterForm = new FormGroup({
      value: new FormControl('', Validators.required)
    })
  }

  ngAfterViewInit(): void {
    this.getCollaborator()
  }

  getCollaborator(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.isLoading = true
    this.api.ListCollaboratorDatabyCompanyID(this.companyID, undefined, ModelSortDirection.DESC, undefined, this.limitElements, token).then((data: any) => {
      this.collaborators = data.items.map((item) => {
        return {
          name: item?.fullName,
          id: item?.id,
          phone: item?.user.phone
        }
      })

      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthPath = this.tokenLength() + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthPath = this.tokenLength()
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err)).finally(() => {
      this.isLoading = false
    })
  }

  toggleSelection(item: SelectCollaborator): void {
    this.selection.toggle(item);
  }

  hasSelectedItems(): boolean {
    return this.selection.selected.length > 0;
  }

  pageChange(event: any) {
    this.selection.clear()
    this.getCollaborator(this.tokens[event.pageIndex].token, event)
  }

  selectSubscriber() {
    this.dialogRef.close(this.selection.selected)
  }
  
  tokenLength(){
    return ((this.tokens.length - 1) * 10) + 1
  }
}