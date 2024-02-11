import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPathComponent } from './flow-path.component';

describe('FlowPathComponent', () => {
  let component: FlowPathComponent;
  let fixture: ComponentFixture<FlowPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowPathComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
