import {NgModule} from '@angular/core';
import {
    RouterModule, Routes
} from '@angular/router';
const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'marketing',
        pathMatch: 'full'
    },
    {
        path: 'marketing',
        loadChildren: '../modules/campaign/campaign.module#CampaignModule'
    },
    {
        path: 'campaignAdmin',
        loadChildren: '../modules/config/admin.module#AdminModule'
    },
    {
        path: 'funnelAdmin',
        loadChildren: '../modules/config/funnel-index-admin.module#FunnelIndexAdminModule'
    },
    {
        path: 'effectAdmin',
        loadChildren: '../modules/config/effect-index-admin.module#EffectIndexAdminModule'
    },
    {
        path: 'crowdDimension',
        loadChildren: '../modules/config/crowd-dimension-config.module#CrowdDimensionConfigModule'
    },
    {
        path: 'quotaAdmin',
        loadChildren: '../modules/config/quota-index-admin.module#QuotaIndexAdminModule'
    },
    {
        path: 'mktProcessAdmin',
        loadChildren: '../modules/config/mkt-process-admin.module#MktProcessAdminModule'
    },
    //事件相关配置   mkt1.1
    {
        path: 'eventConfig',
        loadChildren: '../modules/config/event-config.module#EventConfigModule'
    },
    //指标相关配置   mkt1.1
    {
        path: 'indexConfig',
        loadChildren: '../modules/config/index-config.module#IndexConfigModule'
    },
    //应用推送配置   mkt1.1
    {
        path: 'applyPushConfig',
        loadChildren: '../modules/config/apply-push-config.module#ApplyPushConfigModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
