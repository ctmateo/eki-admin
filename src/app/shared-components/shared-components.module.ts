import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatPaginatorModule} from '@angular/material/paginator';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DndDirective } from '../directives/dnd.directive';

import { ColorPickerModule } from 'ngx-color-picker';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddFileComponent } from './add-file/add-file.component';
import { CommonModule } from '@angular/common';
import { LinechartComponent } from './linechart/linechart.component';
import { BarchartComponent } from './barchart/barchart.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BarRatingModule } from 'ngx-bar-rating';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSliderModule} from '@angular/material/slider';
import { ViewContentCourseComponent } from './view-content-course/view-content-course.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { ConfirmDialogComponent } from './pop-up/confirm-dialog/confirm-dialog.component';
import { FindUserComponent } from './pop-up/find-user/find-user.component';
import { AlertDialogComponent } from './pop-up/alert-dialog/alert-dialog.component';
import { TestResultComponent } from './pop-up/test-result/test-result.component';

@NgModule({
  declarations: [
    AddFileComponent,
    LinechartComponent,
    DndDirective,
    BarchartComponent,
    ViewContentCourseComponent,
    AddTeacherComponent,
    ConfirmDialogComponent,
    FindUserComponent,
    AlertDialogComponent,
    TestResultComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatBottomSheetModule,
    DragDropModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatSidenavModule,
    MatAutocompleteModule,
    ColorPickerModule,
    MatTabsModule,
    MatProgressBarModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatStepperModule,
    MatSliderModule,
    CarouselModule 
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    AddFileComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatBottomSheetModule,
    MatToolbarModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatTableModule,
    DragDropModule,
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatDividerModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatChipsModule,
    ColorPickerModule,
    FontAwesomeModule,
    MatTooltipModule,
    LinechartComponent,
    BarchartComponent,
    BarRatingModule,
    MatStepperModule,
    MatSliderModule,
    CarouselModule,
    ViewContentCourseComponent,
    AddTeacherComponent
  ]
})
export class SharedComponentsModule { }
