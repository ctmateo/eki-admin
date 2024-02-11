import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { TestResultComponent } from 'src/app/shared-components/pop-up/test-result/test-result.component';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.sass']
})
export class RegistersComponent {
  displayedColumns: string[] = ['create', 'name', 'attemptScore', 'isAttemptCompleted'];
  dataSource: any = [];
  limitElements = 25;
  searchFinish = false;
  tokens = [{ count: 25, token: "" }];
  lengthForm = 25;
  maxLength = -1;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  idTest = ""

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private api: APIService) {
    this.idTest = (this.route.snapshot.paramMap.get('formID')) || "";
  }

  initAttemptList(): void {
    this.getAttempt(this.idTest, '');
  }

  async getAttempt(idTest, token?, event = { previousPageIndex: -1, pageIndex: 0, pageSize: 0, length: 0 }) {
    this.api.ListAttemptByClassTest(idTest, undefined, ModelSortDirection.DESC, undefined, this.limitElements, token).then((data: any) => {
      this.dataSource = data.items;
      if (data.nextToken == null) {
        this.searchFinish = true
        this.lengthForm = ((this.tokens.length - 1) * 25) + data.items.length
      }
      if (this.searchFinish == false) {
        const token = { count: data.items.length, token: data.nextToken }
        if (event.previousPageIndex < event.pageIndex && (event.pageIndex - this.maxLength === 1)) {
          this.tokens.push(token)
          this.lengthForm = ((this.tokens.length - 1) * 25) + 1
          this.maxLength = event.pageIndex
        }
      }
    }).catch(err => console.error(err))
  }

  pageChange(event: any) {
    this.getAttempt(this.idTest, this.tokens[event.pageIndex].token, event)
  }

  resultAttempt(attemptId, score) {
    const dialogRef = this.dialog.open(TestResultComponent,
      {
        width: "480px",
        data: {
          score: score,
          idAttemp: attemptId,
          idExamn: this.idTest
        }
      })
  }
}
