import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared-components/pop-up/confirm-dialog/confirm-dialog.component';
import { RegistersComponent } from './registers/registers.component';
import { MetricsComponent } from './metrics/metrics.component';

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.sass']
})
export class DetailFormComponent implements OnInit {

  @ViewChild('registerTab') registerTab: RegistersComponent | undefined;
  @ViewChild('kpiTab') kpiTab: MetricsComponent | undefined;

  dialogRef: MatDialogRef<any> | undefined;

  questions = [];
  options = [];
  currentQuestion: any;
  currentType: any;
  form: any;
  currentIndex = 0;
  questionsLength = 0;
  questionResponse = 0;
  rate = 1;

  istheEnd = false;
  isPublish = false;
  nameCourse = "";
  formID = "";
  urlForm = ""
  tabSelected = "Previsualizar"

  public disabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private api: APIService,
    public router: Router,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.formID = (this.route.snapshot.paramMap.get('formID')) || "";
    this.getQuestion()
  }

  getQuestion() {
    this.api.GetClassTest(this.formID).then((data: any) => {
      this.isPublish = data.isPublish;
      this.istheEnd = false;
      this.form = data;
      this.questions = this.form.questions.items;
      this.questionsLength = this.questions.length;
      this.getCurrrentQuestion();
      this.urlForm = `https://eki.com.co/form/${this.form.id}`
      this.nameCourse = this.form.contentModule.module.course.name;
    });
  }

  nextQuestion() {
    if (this.currentIndex < this.questionsLength - 1) {
      this.currentIndex++;
      this.getCurrrentQuestion();
    } else {
      this.currentIndex = 0;
      this.istheEnd = true;
    }
  }

  getCurrrentQuestion() {
    this.currentQuestion = JSON.parse((this.questions[this.currentIndex] as any).objectQuestion);
    this.currentType = (this.questions[this.currentIndex] as any).questionType;
    this.options = this.currentQuestion.options;
    this.questionResponse = Number(this.currentQuestion.response);
  }

  validateQuestion() {
    console.log("validateQuestion", this.disabled)
  }

  onButtonGroupClick($event) {
    let clickedElement = $event.target || $event.srcElement;
    if (clickedElement.nodeName === "BUTTON") {
      let isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector(".active");
      if (isCertainButtonAlreadyActive) {
        isCertainButtonAlreadyActive.classList.remove("active");
      }
      clickedElement.className += " active";
    }

  }

  onButtonMultipleClick($event) {
    let clickedElement = $event.target || $event.srcElement;
    let isActive = false;
    if (clickedElement.nodeName === "BUTTON") {
      isActive = clickedElement.classList.contains('active');
      if (isActive) {
        clickedElement.classList.remove("active");
      } else {
        clickedElement.className += " active";
      }
    }
  }

  copieUrl() {
    navigator.clipboard.writeText(this.urlForm);
  }

  checkPublish() {
    if (!this.isPublish) {
      this.dialogRef = this.dialog.open(
        ConfirmDialogComponent,
        {
          data: {
            title: 'Confirmacion publicación examen',
            message: `Se hara publico el examen. Tenga en cuenta que no podrá deshacer la publicación una vez confirmada.`,
            payload: this.formID
          },
          width: '380px',
          height: '300px'
        });


      this.dialogRef.afterClosed().subscribe(async (result) => {
        if (result != undefined && result != "" && result != null) {
          const payload = {
            id: this.formID,
            isPublish: true
          }
          this.api.UpdateClassTest(payload).then(() => {
            this.isPublish = true
          }).catch((err) => {
            console.error("Error update class test", err)
          })
        }
      })
    }
  }

  changeTestTab(tabSelected) {
    this.tabSelected = tabSelected.tab.textLabel
    console.log(this.tabSelected)

    if (tabSelected.tab.textLabel === "Registros") {
      this.registerTab?.initAttemptList();
    }

    if (tabSelected.tab.textLabel === "Metricas") {
      this.kpiTab?.initAttemptList();
    }
  }

  goToEdit() {
    this.router.navigateByUrl(`forms/edit/${this.formID}`)
  }

}
