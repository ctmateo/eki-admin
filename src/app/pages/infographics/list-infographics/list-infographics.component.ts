import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { APIService, ListClassinfographicsQuery } from 'src/app/API.service';
import { UtilsService } from 'src/app/services/utils.service';
import { DeleteFormComponent } from '../../forms/delete-form/delete-form.component';
import { DeleteComponent } from '../dialogs/delete/delete.component';
import { EditComponent } from '../dialogs/edit/edit.component';
import { CreateComponent } from '../dialogs/create/create.component';
import { PreviewComponent } from '../dialogs/preview/preview.component';

@Component({
  selector: 'app-list-infographics',
  templateUrl: './list-infographics.component.html',
  styleUrls: ['./list-infographics.component.sass']
})
export class ListInfographicsComponent {
  filterForm: FormGroup;
  attr = ["Id", "Fecha de creación", "Nombre", "Ruta"];
  conditions = ["Igual", "Contiene"];
  displayedColumns: string[] = ['id', 'createAt', 'name', 'routheImage', 'actions'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{count: 25, token: ""}];
  lengthInfographics = 25;
  maxLength = -1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private api: APIService,
    private utils: UtilsService) {
    this.filterForm = new FormGroup({
      attribute: new FormControl('', Validators.required),
      condition: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required)
    })
  }

  ngOnInit(){
    this.getInfographics();
  }

  async getInfographics(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListClassinfographics(undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthInfographics = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthInfographics = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err, "tenemos error"))
  }

  pageChange(event: any) {
    this.getInfographics(this.tokens[event.pageIndex].token, event)
  }

  previewInfographic(keyImage){
    const dialogRef = this.dialog.open(PreviewComponent,
      {
        width: "700px",
        data:{
          keyImage: keyImage
        }
      })
  }

  deleteInfographic(event, idForm, contentModuleId, nameForm) {
    const dialogRef = this.dialog.open(DeleteComponent, {
      width: "700px",
      data: {
        idForm: idForm,
        contentModuleId: contentModuleId,
        nameForm: nameForm
      }
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result != "" && result != undefined && result != null) {
        this.api.DeleteClassinfographic(result).then(() => {
          this.utils.resetComponent();
        }).catch((err) => {
          if (err.status === 401) {
            console.error("Not authorized to perform this action.");
          } else {
            console.error(err);
          }
        });
      }
    });
    
    event.stopPropagation();
  }

  

  editInfographic(idForm, nameForm, descriptionForm){
    const dialogRef = this.dialog.open(EditComponent,
      {
        width: "700px",
        data: {
          idForm: idForm,
          nameForm: nameForm,
          descriptionForm: descriptionForm
        }
      })
      dialogRef.componentInstance.infographicUpdated.subscribe((result) => {
        if (result === 'Infographic has been updated') {
          this.utils.resetComponent();
          dialogRef.close();
        }
      });
  }
  
  createInfographic() {
    const dialogRef = this.dialog.open(CreateComponent,
      {
        width: "700px"
      })

      dialogRef.componentInstance.infographicCreated.subscribe((result) => {
        if (result === 'Infographic has been created') {
          this.utils.resetComponent();
          dialogRef.close();
        }
      });
  }

}
