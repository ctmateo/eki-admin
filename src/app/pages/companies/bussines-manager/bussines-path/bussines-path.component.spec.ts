import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinesPathComponent } from './bussines-path.component';

describe('BussinesPathComponent', () => {
  let component: BussinesPathComponent;
  let fixture: ComponentFixture<BussinesPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BussinesPathComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BussinesPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
