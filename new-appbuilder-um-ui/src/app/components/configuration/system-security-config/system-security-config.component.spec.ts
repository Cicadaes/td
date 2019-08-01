import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSecurityConfigComponent } from './system-security-config.component';

describe('SystemSecurityConfigComponent', () => {
  let component: SystemSecurityConfigComponent;
  let fixture: ComponentFixture<SystemSecurityConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSecurityConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSecurityConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
