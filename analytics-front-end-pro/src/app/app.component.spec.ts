import {TestBed, async} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {APP_BASE_HREF} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgZorroAntdModule, NZ_I18N, zh_CN, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG} from "ng-zorro-antd";
import {AppRoutingModule} from "./app.routing";
import {Globals} from "./utils/globals";
import {InterceptorService} from "./common/services/InterceptorService";
import {CommonService} from "./common/services/common.service";
import {CurdService} from "./curd.service";
import {HeaderModule} from "./common/header/header.module";

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                FormsModule,
                BrowserModule,
                HttpClientModule,
                BrowserAnimationsModule,
                AppRoutingModule,
                HeaderModule,
                NgZorroAntdModule.forRoot(),
                RouterModule.forRoot([])
            ],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'},
                {provide: NZ_I18N, useValue: zh_CN},
                {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
                {provide: NZ_MESSAGE_CONFIG, useValue: {nzDuration: 3000, nzMaxStack: 1}},
                {provide: NZ_NOTIFICATION_CONFIG, useValue: {nzDuration: 3000, nzMaxStack: 1}},
                Globals,
                CommonService,
                CurdService
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it(`should have as title 'app'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app');
    }));
//    it('should toContain Welcome', async(() => {
//        const fixture = TestBed.createComponent(AppComponent);
//        fixture.detectChanges();
//        const compiled = fixture.debugElement.nativeElement;
//        expect(compiled.querySelector('main').textContent).toContain('Welcome');
//    }));
});
