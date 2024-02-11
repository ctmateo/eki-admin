import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { APIService } from 'src/app/API.service';

export interface ExamResult {
  idAttemp: string
  idExamn: string
  score: number
}

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.sass']
})
export class TestResultComponent {

  idExamn = ""
  scoreExam = 0
  results: any[] = []

  constructor(
    private api: APIService,
    public dialogRef: MatDialogRef<TestResultComponent>,
    @Inject(MAT_DIALOG_DATA) public examResult: ExamResult
  ) {
    const idAttemp = examResult.idAttemp
    this.idExamn = examResult.idExamn
    this.scoreExam = examResult.score
    this.getAttemp(idAttemp)
  }

  async getAttemp(idAttemp) {
    this.api.ListTestAnswersbyAttempt(idAttemp).then((data) => {

      data.items.forEach(element => {
        const question = element?.question?.objectQuestion ? JSON.parse(element?.question?.objectQuestion) : null
        const result = {
          responseQuestion: element?.responseQuestion,
          respontText: (element?.responseQuestion !== null && element?.responseQuestion !== undefined) ? question.options[element.responseQuestion] : null,
          correctAnsware: question.response,
          sortIndex: element?.question?.sortIndex
        }
        this.results.push(result)
      });
      this.results.sort((a, b) => {
        const nameA = a.sortIndex;
        const nameB = b.sortIndex;

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    })

  }
}

