import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route } from '@angular/router';
import { APIService } from 'src/app/API.service';
import { AlertDialogComponent } from 'src/app/shared-components/pop-up/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared-components/pop-up/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.sass']
})
export class EditFormComponent {
  form: any;
  formID = ""
  questions: any;
  deleteQuestions: any[] = [];
  questionsLength = 0;
  constructor(
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private api: APIService) {
  }

  ngOnInit(): void {
    this.formID = (this.route.snapshot.paramMap.get('formID')) || "";
    this.getQuestion()
  }

  getQuestion() {
    this.deleteQuestions = []
    this.api.GetClassTest(this.formID).then((data: any) => {
      this.form = data;
      this.questions = this.form.questions.items
      this.questionsLength = this.questions.length
      if (this.questionsLength == 0) {
        this.addNewQuestion(0);
      }
      this.questions.forEach(element => {
        element.objectQuestion = this.stringToJson(element.objectQuestion)
        element.action = "update"
      });
    });
  }

  stringToJson(string) {
    return JSON.parse(string)
  }

  async saveTest() {
    const templateQuestions = [...this.questions, ...this.deleteQuestions];

    const promises = templateQuestions.map(async (item) => {
      const question = { ...item };
      question.objectQuestion = JSON.stringify(question.objectQuestion)
      delete question.__typename;
      delete question.classTest;

      if (question.action === "update") {
        delete question.action;
        await this.api.UpdateQuestion(question)
      }
      if (question.action === "create") {
        delete question.action;
        await this.api.CreateQuestion(question)
      }
      if (question.action === "delete") {
        await this.api.DeleteQuestion({ id: question.id }, undefined)
      }
    })
    await Promise.all(promises).then(() => {
      const dialogRef = this.openDialogConfirm("Hemos actualizado el test", "¿Desea continuar editando?");
      dialogRef.afterClosed().subscribe(async (result) => {
        console.log(result)
        if (!(result != undefined && result != "" && result != null)) {
          this.goToDetails();
        }
      })
    }).catch((err) => {
      console.error(err)
      this.openDialogAlert(`Ha ocurrido en error al guardar el test, intentelo de nuevo`)
    }).finally(() => {
      this.deleteQuestions = []
    });
  }

  deleteOption(indexOption, sortIndex) {
    const questionSelect = this.questions.find(elemento => elemento.sortIndex === sortIndex);
    questionSelect.objectQuestion.options.splice(indexOption, 1)
  }

  addElementOption(sortIndex) {
    const questionSelect = this.questions.find(elemento => elemento.sortIndex === sortIndex);
    if (questionSelect.objectQuestion.options.length >= 9) {
      this.openDialogAlert(`No puedes tener 10 o más opciones de respuesta.`)
      return;
    }

    if (questionSelect.objectQuestion.options.length < 10) {
      questionSelect.objectQuestion.options.push(`Opción nueva - ${questionSelect.objectQuestion.options.length + 1}`)
      this.cdr.detectChanges();
      return;
    }
  }

  addResponse(indexOption, sortIndex) {
    const questionSelect = this.questions.find(elemento => elemento.sortIndex === sortIndex);
    questionSelect.objectQuestion.response = indexOption;
  }

  addNewQuestion(index) {
    const newIndex = index + 1
    if (this.questions.length >= 12) {
      this.openDialogAlert(`Un test no debe tener mas de 12 preguntas`)
      return;
    }

    const newQuestion = {
      action: "create",
      classTestQuestionsId: this.formID,
      isAvailable: true,
      questionType: "SINGLE_CHOICE",
      sortIndex: index + 1,
      objectQuestion: {
        question: `Nueva pregunta - ${newIndex}`,
        response: "0",
        options: [
          "Opción nueva - 1",
          "Opción nueva - 2"
        ]

      }
    }
    this.questions.splice(newIndex, 0, newQuestion);
    this.solvedIndexArray()
  }

  removeQuestion(index) {
    if (this.questions.length == 1) {
      this.openDialogAlert(`Un test debe tener por lo menos una pregunta`)
      return;
    }

    if (this.questions.length > 1) {
      this.questions[index].action = "delete";
      this.deleteQuestions.push(this.questions[index])
      this.questions.splice(index, 1)
      this.solvedIndexArray()
    }
  }

  solvedIndexArray() {
    this.questions.forEach((element, index) => {
      element.sortIndex = index
    })
    this.cdr.detectChanges();
  }

  changePositionArray(currentPosition, newPosition) {
    const temp = this.questions[currentPosition];
    this.questions[currentPosition] = this.questions[newPosition];
    this.questions[newPosition] = temp;
    this.cdr.detectChanges();
  }

  changeValueOption(target, indexOption, sortIndex) {
    const questionSelect = this.questions.find(elemento => elemento.sortIndex === sortIndex);
    questionSelect.objectQuestion.options[indexOption] = target.value;
  }

  changeQuestion(target, sortIndex) {
    const questionSelect = this.questions.find(elemento => elemento.sortIndex === sortIndex);
    questionSelect.objectQuestion.question = target.value;
  }

  goToDetails() {
    this.router.navigateByUrl(`forms/detail/${this.formID}`)
  }

  openDialogAlert(messages) {
    this.dialog.open(AlertDialogComponent,
      {
        data: {
          message: messages,
        },
        width: "320px"
      })
  }

  openDialogConfirm(title, messages) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,
      {
        data: {
          message: messages,
          title: title,
          payload: "ok"
        },
        width: "320px"
      })

    return dialogRef;
  }
}
