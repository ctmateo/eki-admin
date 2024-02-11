import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { MatPaginator } from '@angular/material/paginator';
import { FindCollaboratorComponent } from '../find-collaborator/find-collaborator.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FlowCompanyService } from 'src/app/services/flow-company.service';
import { ConfirmDialogComponent } from 'src/app/shared-components/pop-up/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-flow-path',
  templateUrl: './flow-path.component.html',
  styleUrls: ['./flow-path.component.sass']
})
export class FlowPathComponent implements AfterViewInit {

  idBussines: any
  flowCompanyId: any
  flowCompany: any

  displayedColumns: string[] = ['name', 'phone', 'date', 'state', 'progress', 'actions'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lenthSource = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: APIService,
    private apiFlow: FlowCompanyService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public utils: UtilsService,
    private snackBar: MatSnackBar
  ) {

    this.route.paramMap.subscribe(async params => {
      this.idBussines = params.get('id');
      this.flowCompanyId = params.get('flowCompanyId');
    });

  }

  async ngAfterViewInit() {
    this.flowCompany = await this.apiFlow.GetFlowCompany(this.flowCompanyId)
    this.getConversationFlow()
  }

  getConversationFlow(token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListFlowConversationbyFlowCompanyID(this.flowCompanyId, undefined, ModelSortDirection.DESC, undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;

      if (data.nextToken == null) {
        this.searchFinish = true
        this.lenthSource = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lenthSource = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  openfindColaborator() {
    const dialogRef = this.dialog.open(FindCollaboratorComponent,
      {
        data: {
          companyId: this.idBussines
        },
        width: "720px"
      })

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result != undefined && result != "" && result != null) {
        const collaboratorId = result[0].id
        const listFlowconversation = await this.listGetFlowsByCollaboratorId(collaboratorId)
        const collaboratorsFlow = listFlowconversation.find(element => element.flowCompanyID == this.flowCompanyId)
        const collaboratorsByState = listFlowconversation.find(element => element.stateFlow == "IN_PROGRESS")
        const stateFlow = collaboratorsByState == undefined ? "IN_PROGRESS" : "PENDING"
        const coursesPath = this.flowCompany.learningPath.courseFromPath.items
        const currentCourseFromPath = coursesPath.find(element => element.sortIndex == 1)
        const nextCourseFromPath = coursesPath.find(element => element.sortIndex == 2)
        const currentModule = currentCourseFromPath.course.modules.items.find(element => element.sortIndex == 1)
        const currentContent = currentModule.content.items.find(element => element.sortIndex == 1)

        if (collaboratorsFlow === undefined) {
          const payload: any = {
            stateFlow: stateFlow,
            flowType: "PATH",
            collaboratorID: collaboratorId,
            flowCompanyID: this.flowCompanyId,
            pathID: this.flowCompany.pathID,
            currentCourseID: currentCourseFromPath.course.id,
            nextCourseID: nextCourseFromPath?.course?.id || "endPath",
            currentContentID: currentContent.id,
            nextContentID: currentContent.nextContentID,
            progress: 0,
            totalContent: this.getTotalContent(coursesPath)
          }
          console.log(payload)

          // Create FlowConversation
          this.api.CreateFlowConversation(payload).then(async () => {
            this.snackBar.open('EL colaborador ha sido subcrito.', undefined, {
              duration: 6000
            });
            // Update company flow
            const companyUpdateInput: any = {
              id: this.flowCompanyId,
              inscribed: this.getIncribe()
            }

            this.api.UpdateFlowCompany(companyUpdateInput, undefined).catch((err) => {
              console.error(err)
            })

            // Send inicial whatsapp messages 
            if (stateFlow == "IN_PROGRESS") {
              // Send Whatsapp initial to whatsapp
              const payload = {
                "collaboratorId": collaboratorId,
                "companyId": this.idBussines
              }

              this.api.StartLearningPath(JSON.stringify(payload)).then(() => {
                console.log("Created message to start")
              }).catch((err) => {
                console.error(err)
              })
            }

            this.utils.resetComponent()
          }).catch((err) => {
            console.log("Problema en la creacion de flujo", err)
            this.snackBar.open('Ha ocurrido un problema, reinténtalo de nuevo.', undefined, {
              duration: 6000
            });
          })
        }

        if (collaboratorsFlow !== undefined) {
          console.log("Tiene Flujo")
          this.snackBar.open('El colaborador esta subcrito a este flujo', undefined, {
            duration: 6000
          });
        }
      }
    })
  }


  getTotalContent(courses) {
    let count = 0;
    courses.forEach(items => {
      const module = items.course.modules.items
      module.forEach(element => {
        count = element.content.items.length + count
      });
    })
    return count
  }

  async listGetFlowsByCollaboratorId(collaboradorID) {
    const items: any = []
    let token: string | undefined = undefined
    do {
      try {
        if (collaboradorID) {
          const flowConversation = await this.api.ListFlowConversationbyCollaboratorID(collaboradorID, undefined, undefined, undefined, 300)
          items.push(...flowConversation?.items)
          token = flowConversation?.nextToken || ""
        } else {
          throw new Error("collaboratorId not found");
        }
      } catch (error) {
        console.error(error)
      }
    }
    while (token)
    return items
  }

  getIncribe() {
    if (this.flowCompany.inscribed === undefined || this.flowCompany.inscribed === null)
      return 1

    return this.flowCompany.inscribed + 1
  }

  pageChange(event: any) {
    this.getConversationFlow(this.tokens[event.pageIndex].token, event)
  }

  deleteFlowDialog(id: string, name: string) {
    const confirmDeleteDialog = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          title: "Confirmación de Eliminación de flujo ",
          message: `¿Estás seguro de que deseas eliminar este flujo? <br><br><strong><center>${name}</center></strong><br> Esta acción no se puede deshacer. Por favor, confirma la eliminación.`,
          payload: id
        },
        width: "480px"
      })

    confirmDeleteDialog.afterClosed().subscribe(async (result) => {
      if (result != undefined && result != "" && result != null) {
        this.deleteFlow(result)
      }
    })
  }

  deleteFlow(idFlow) {
    this.api.DeleteFlowConversation({ id: idFlow }).then(() => {
      this.snackBar.open('El flujo ha sido eliminado', undefined, {
        duration: 6000
      });
      this.utils.resetComponent()
    }).catch((err) => {
      this.snackBar.open('Ha ocurrido un error vuelva intentarlo', undefined, {
        duration: 6000
      });
    })
  }

}
