import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlowCompanyComponent } from './add-flow-company.component';

describe('AddFlowCompanyComponent', () => {
  let component: AddFlowCompanyComponent;
  let fixture: ComponentFixture<AddFlowCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFlowCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFlowCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
