import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObjectDetailComponent } from './data-object-detail.component';

describe('DataObjectDetailComponent', () => {
  let component: DataObjectDetailComponent;
  let fixture: ComponentFixture<DataObjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataObjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
