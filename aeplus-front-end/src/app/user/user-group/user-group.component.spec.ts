import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {UserGroupComponent} from "./user-group.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgZorroAntdModule} from "ng-cosmos-ui";
import {RouterModule} from "@angular/router";
import {InsightsModule} from "../insights/insights.module";
import {InsightsComponent} from "../insights/insights.component";
import {HttpClientModule} from "@angular/common/http";
import {Globals} from "../../utils/globals";
import {CommonService} from "../../common/services/common.service";
import {CurdService} from "../../curd.service";

describe('UserGroupComponent', () => {
    let component: UserGroupComponent;
    let fixture: ComponentFixture<UserGroupComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                CommonModule,
                FormsModule,
                NgZorroAntdModule,
                InsightsModule,
            ],
            declarations: [UserGroupComponent],
            providers: [
                Globals,
                CommonService,
                CurdService
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
