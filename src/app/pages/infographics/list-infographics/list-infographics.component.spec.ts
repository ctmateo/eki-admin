import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInfographicsComponent } from './list-infographics.component';

describe('ListInfographicsComponent', () => {
  let component: ListInfographicsComponent;
  let fixture: ComponentFixture<ListInfographicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListInfographicsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInfographicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
