import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollaboratorsComponent } from './create-collaborators.component';

describe('CreateCollaboratorsComponent', () => {
  let component: CreateCollaboratorsComponent;
  let fixture: ComponentFixture<CreateCollaboratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCollaboratorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
