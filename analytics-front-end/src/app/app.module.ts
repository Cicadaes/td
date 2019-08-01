import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, zh_CN, NZ_MESSAGE_CONFIG, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { Globals } from './utils/globals';
import { InterceptorService } from './common/services/InterceptorService';
import { CommonService } from './common/services/common.service';
import { CurdService } from './curd.service';
import { HeaderModule } from './common/header/header.module';
import { AuthService } from './common/services/auth.service';
import { PortalModule } from './common/projects/td/portal/src/public_api';
import { AppService } from './app.service';

registerLocaleData(zh);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    PortalModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HeaderModule,
    NgZorroAntdModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 3000, nzMaxStack: 1 } },
    { provide: NZ_NOTIFICATION_CONFIG, useValue: { nzDuration: 3000, nzMaxStack: 1 } },
    Globals,
    AuthService,
    CommonService,
    CurdService,
    AppService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
