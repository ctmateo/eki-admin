import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatReportsComponent } from './chat-reports.component';

describe('ChatReportsComponent', () => {
  let component: ChatReportsComponent;
  let fixture: ComponentFixture<ChatReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
