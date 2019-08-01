import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObjectOperateComponent } from './data-object-operate.component';

describe('DataObjectOperateComponent', () => {
  let component: DataObjectOperateComponent;
  let fixture: ComponentFixture<DataObjectOperateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataObjectOperateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectOperateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
