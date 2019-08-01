import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningHistoryComponent } from './warning-history.component';

describe('WarningHistoryComponent', () => {
  let component: WarningHistoryComponent;
  let fixture: ComponentFixture<WarningHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarningHistoryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
