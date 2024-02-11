import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesManagerComponent } from './bussines-manager.component';

describe('BussinesManagerComponent', () => {
  let component: BussinesManagerComponent;
  let fixture: ComponentFixture<BussinesManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
