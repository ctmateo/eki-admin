import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { APIService, ModelSortDirection } from 'src/app/API.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.sass']
})
export class MetricsComponent implements AfterViewInit {

  endDate: any
  startDate: any
  range: FormGroup
  attempts: any[] = []
  attemptsChart: any[] = []
  listQuestions: any[] = []
  idTest = ""
  totalAttempts = 0
  completeAttempts = 0
  pendingsAttempts = 0
  dataReady = false

  constructor(
    private route: ActivatedRoute,
    private utils: UtilsService,
    private api: APIService
  ) {

    this.endDate = new Date()
    this.startDate = new Date()
    this.startDate.setMonth(this.endDate.getMonth() - 3)

    this.range = new FormGroup({
      start: new FormControl<Date | null>(new Date(this.utils.convertToDate(this.startDate))),
      end: new FormControl<Date | null>(new Date(this.utils.convertToDate(this.endDate)))
    });
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit")
    this.idTest = (this.route.snapshot.paramMap.get('formID')) || "";
    this.changeDataRangeFilter(this.startDate, this.endDate)
  }

  initAttemptList() {
    console.log("initAttemptList")
    const startDate = this.range.get('start')?.value;
    const endDate = this.range.get('end')?.value;
    this.changeDataRangeFilter(startDate, endDate)
  }

  onDateEndChange(event) {
    if (event.value !== null) {
      const startDate = this.range.get('start')?.value;
      const endDate = this.range.get('end')?.value;
      this.changeDataRangeFilter(startDate, endDate)
    }
  }

  async changeDataRangeFilter(startDate, endDate) {
    this.attempts = []
    this.listQuestions = []

    this.attempts = await this.getAttempt(this.idTest, startDate, endDate);
    this.listQuestions = await this.getQuestionForms(this.idTest, startDate, endDate);
    this.attemptsChart = this.getDataChart(this.attempts, "createdAt");

    this.getAttemptStatistics();  
  }

  getDataChart(data, dateField) {
    
    const arrayDates = new Map();
    data.forEach(element => {
      const date = this.utils.convertToDate(new Date(element[dateField]));
      if (arrayDates.has(date)) {
        arrayDates.set(date, arrayDates.get(date) + 1);
      } else {
        arrayDates.set(date, 1);
      }
    });

    const result: any[] = [];
    for (const [date, count] of arrayDates.entries()) {
      result.push({ date: new Date(date), value: count });
    }

    result.sort((a, b) => {
      const nameA = a.date;
      const nameB = b.date;

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return result;
  }

  getAttemptStatistics() {
    this.totalAttempts = this.attempts.length;
    this.completeAttempts = this.attempts.filter(element => element.isAttemptCompleted == true).length
    this.pendingsAttempts = this.attempts.filter(element => element.isAttemptCompleted == false).length
  }

  async getAttempt(id, startDate, endDate) {
    const items: any[] = []
    let token: string | undefined = undefined
    do {
      try {
        const filterDates = { between: [this.utils.convertToAwsDateTime(startDate), this.utils.convertToAwsDateTime(endDate)] }
        const progressions = await this.api.ListAttemptByClassTest(id, filterDates, ModelSortDirection.DESC, undefined, 300)
        items.push(...progressions?.items)
        token = progressions?.nextToken || ""
      } catch (error) {
        console.error(error)
      }
    }
    while (token)
    return items
  }

  async getQuestionForms(id, startDate, endDate) {
    let list: any[] = []
    list = (await this.api.QuestionByTestID(id, undefined, undefined, undefined, 30, undefined)).items
    const listGraph = await Promise.all(list.map(async (element, index) => {
      const resultsQuestions = await this.getRegistersAttempts(element.id, startDate, endDate)
      const graphQuestion: any[] = []
      resultsQuestions.forEach((element) => {
        graphQuestion.push({ result: element.responseQuestion })
      })
      return {
        ...element,
        answer: graphQuestion,
        "idClass": `bar-${index}`,
        objectQuestion: JSON.parse(element?.objectQuestion || "")
      };
    })).finally(()=>{
      this.dataReady = true
    });

    return listGraph
  }

  async getRegistersAttempts(id, startDate, endDate) {
    const items: any[] = []
    let token: string | undefined = undefined
    do {
      try {
        const filterDates = { between: [this.utils.convertToAwsDateTime(startDate), this.utils.convertToAwsDateTime(endDate)] }
        const progressions = await this.api.ListTestAnswersByQuestion(id, filterDates, ModelSortDirection.DESC, undefined, 300)
        items.push(...progressions?.items)
        token = progressions?.nextToken || ""
      } catch (error) {
        console.error(error)
      }
    }
    while (token)
    return items
  }
}
