import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesCollaboratorsComponent } from './bussines-collaborators.component';

describe('BussinesCollaboratorsComponent', () => {
  let component: BussinesCollaboratorsComponent;
  let fixture: ComponentFixture<BussinesCollaboratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesCollaboratorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinesCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
