import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtmfComponent } from './dtmf.component';

describe('DtmfComponent', () => {
  let component: DtmfComponent;
  let fixture: ComponentFixture<DtmfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtmfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtmfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
