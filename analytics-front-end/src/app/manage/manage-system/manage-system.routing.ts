import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageSystemComponent } from './manage-system.component';
import { EventMgtComponent } from './event-mgt/event-mgt.component';
import { EventAttributeComponent } from './event-attribute/event-attribute.component';
import { UserAttributeComponent } from './user-attribute/user-attribute.component';
import { SourceMgtComponent } from './source-mgt/source-mgt.component';
import { ActivityMgtComponent } from './activity-mgt/activity-mgt.component';
import { PageMgtComponent } from './page-mgt/page-mgt.component';
import { UserClickMapComponent } from './user-click-map/user-click-map.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { AppInfoComponent } from './app-info/app-info.component';
import { ChannelMgtComponent } from './channel-mgt/channel-mgt.component';
import { ParamMgtComponent } from './param-mgt/param-mgt.component';

const appRoutes: Routes = [
  {
    path: '',
    component: ManageSystemComponent,
    children: [
      {
        path: '',
        redirectTo: 'event-mgt',
        pathMatch: 'full'
      },
      {
        path: 'event-mgt',
        component: EventMgtComponent
      },
      {
        path: 'event-attribute',
        component: EventAttributeComponent
      },
      {
        path: 'user-attribute',
        component: UserAttributeComponent
      },
      {
        path: 'source-mgt',
        component: SourceMgtComponent
      },
      {
        path: 'activity-mgt',
        component: ActivityMgtComponent
      },
      {
        path: 'page-mgt',
        component: PageMgtComponent
      },
      {
        path: 'user-click-map',
        component: UserClickMapComponent
      },
      {
        path: 'qrcode',
        component: QrcodeComponent
      },
      {
        path: 'app-info',
        component: AppInfoComponent
      },
      {
        path: 'channel-mgt',
        component: ChannelMgtComponent
      },
      {
        path: 'param-mgt',
        component: ParamMgtComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ManageSystemRoutingModule {}
