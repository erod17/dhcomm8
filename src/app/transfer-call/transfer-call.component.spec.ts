import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCallComponent } from './transfer-call.component';

describe('TransferCallComponent', () => {
  let component: TransferCallComponent;
  let fixture: ComponentFixture<TransferCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
