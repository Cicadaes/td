import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRuleDefinitionComponent } from './business-rule-definition.component';

describe('BusinessRuleDefinitionComponent', () => {
  let component: BusinessRuleDefinitionComponent;
  let fixture: ComponentFixture<BusinessRuleDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRuleDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRuleDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
