import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCollaboratorComponent } from './find-collaborator.component';

describe('FindCollaboratorComponent', () => {
  let component: FindCollaboratorComponent;
  let fixture: ComponentFixture<FindCollaboratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindCollaboratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
