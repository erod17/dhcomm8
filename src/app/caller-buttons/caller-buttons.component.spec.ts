import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallerButtonsComponent } from './caller-buttons.component';

describe('CallerButtonsComponent', () => {
  let component: CallerButtonsComponent;
  let fixture: ComponentFixture<CallerButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallerButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallerButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
