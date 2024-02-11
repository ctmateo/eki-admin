import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesTeamsComponent } from './bussines-teams.component';

describe('BussinesTeamsComponent', () => {
  let component: BussinesTeamsComponent;
  let fixture: ComponentFixture<BussinesTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinesTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
