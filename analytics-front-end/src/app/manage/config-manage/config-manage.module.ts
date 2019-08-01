import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigManageComponent } from './config-manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppConfigManageComponent } from './app-config-manage/app-config-manage.component';
import { WebConfigManageComponent } from './web-config-manage/web-config-manage.component';
import { AppletConfigManageComponent } from './applet-config-manage/applet-config-manage.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ClipboardModule } from 'ngx-clipboard';

const appRoutes: Routes = [
  {
    path: '',
    component: ConfigManageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ClipboardModule,
    RouterModule.forChild(appRoutes)
  ],
  declarations: [ConfigManageComponent, AppConfigManageComponent, WebConfigManageComponent, AppletConfigManageComponent]
})
export class ConfigManageModule {}
