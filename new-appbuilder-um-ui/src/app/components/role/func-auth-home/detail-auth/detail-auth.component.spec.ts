import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAuthComponent } from './detail-auth.component';

describe('DataObjectAuthComponent', () => {
  let component: DetailAuthComponent;
  let fixture: ComponentFixture<DetailAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
