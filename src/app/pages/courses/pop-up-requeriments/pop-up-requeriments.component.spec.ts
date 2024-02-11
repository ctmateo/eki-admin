import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpRequerimentsComponent } from './pop-up-requeriments.component';

describe('PopUpRequerimentsComponent', () => {
  let component: PopUpRequerimentsComponent;
  let fixture: ComponentFixture<PopUpRequerimentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopUpRequerimentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpRequerimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
