import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MktRuleDefinitionComponent } from './mkt-rule-definition.component';

describe('MktRuleDefinitionComponent', () => {
  let component: MktRuleDefinitionComponent;
  let fixture: ComponentFixture<MktRuleDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MktRuleDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MktRuleDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
