import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObjectAuthComponent } from './data-object-auth.component';

describe('DataObjectAuthComponent', () => {
  let component: DataObjectAuthComponent;
  let fixture: ComponentFixture<DataObjectAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataObjectAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataObjectAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
