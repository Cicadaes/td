import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceAuthorizationRoleComponent } from './instance-authorization-role.component';

describe('InstanceAuthorizationRoleComponent', () => {
  let component: InstanceAuthorizationRoleComponent;
  let fixture: ComponentFixture<InstanceAuthorizationRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceAuthorizationRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceAuthorizationRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
