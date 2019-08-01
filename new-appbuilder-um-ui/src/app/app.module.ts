import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingResetModule } from './app-routing.module';
// import { StoreModule, Action } from 'ng-cosmos-td-common';
import { Action, StoreModule } from '@ngrx/store';
import { counterReducer } from './reducer/counter';
import { MenuModule } from './main/menu/menu.module';
import { LogoModule } from './main/logo/logo.module';
import { TopModule } from './main/top/top.module';
import { CommonModule } from '@angular/common';
import { AppService } from './app.service';
import { InnerMenuModule } from './main/inner-menu/inner-menu.module';
import { HttpClientModule } from '@angular/common/http';
import { NoPermissionComponent } from './main/nopermission.component';
import { UMThemeModule } from './@themes/um-theme.module';
import { CoreModule } from './@core/core.module';
import { OrganizationsModule } from './components/organization/organizations.module';

import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-cosmos-ui';
/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

@NgModule({
  declarations: [
    NoPermissionComponent,
    AppComponent
  ],
  providers: [AppService, { provide: NZ_I18N, useValue: zh_CN }],
  imports: [
    HttpModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    LogoModule,
    TopModule,
    CommonModule,
    MenuModule,
    InnerMenuModule,
    StoreModule.forRoot({ counter: counterReducer }),
    NgZorroAntdModule,
    UMThemeModule.forRoot(),
    CoreModule.forRoot(),
    OrganizationsModule,
    AppRoutingResetModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
