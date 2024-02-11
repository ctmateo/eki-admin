import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reusable-button',
  template: `
    <button
      [ngClass]="{'button-active': true, 'active': !isDisabled, 'desactive': isDisabled}"
      [disabled]="isDisabled"
      (click)="handleClick()"
    >
      {{ buttonText }}
    </button>
  `,
  styleUrls: ['./resuble-button.component.sass']
})
export class ReusableButtonComponent {
  @Input() buttonText: string = ' ';
  @Input() isDisabled: boolean = false;
  @Input() clickOnce: boolean = true;
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  private clicked: boolean = false;

  handleClick(): void {
    if (!this.clicked || !this.clickOnce) {
      this.clicked = true;
      this.buttonClick.emit();
    }
  }
}