import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesProfileComponent } from './bussines-profile.component';

describe('BussinesProfileComponent', () => {
  let component: BussinesProfileComponent;
  let fixture: ComponentFixture<BussinesProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinesProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
