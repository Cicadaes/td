import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObjectInstanceOperateComponent } from './data-object-instance-operate.component';

describe('DataObjectInstanceOperateComponent', () => {
  let component: DataObjectInstanceOperateComponent;
  let fixture: ComponentFixture<DataObjectInstanceOperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataObjectInstanceOperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectInstanceOperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
