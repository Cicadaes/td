import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'product-center',
        pathMatch: 'full'
    },

    // ==========================================

    {
        // 业务概览（我的报表，共享报表，营销计划）
        path: 'business-overview',
        loadChildren: './business-overview/business-overview.module#BusinessOverviewModule',
    },

    {
        // 业务预警
        path: 'early-warning',
        loadChildren: './scene-insight/early-warning/early-warning.module#EarlyWarningModule',
    },

    {
        // 业务预警 规则
        path: 'warning-rules-view',
        loadChildren: './scene-insight/early-warning/early-warning-rule/early-warning-rule.module#EarlyWarningRuleModule',
    },

    // ==========================================

    {
        // 营销-活动管理
        path: 'marketing/activity-center',
        loadChildren: './marketing/activity-center/activity-center.module#ActivityCenterModule'
    },

    // ==========================================

    {
        // 管理-营销管理--张威
        path: 'manage/marketing-manage',
        loadChildren: './manage/marketing-manage/marketing-manage.module#MarketingManageModule'
    },
    {
        // 管理-营销流程管理--张威
        path: 'manage/process-manage',
        loadChildren: './manage/process-manage/process-manage.module#ProcessManageModule'
    },
    {
        // 管理-推送配置--张威
        path: 'manage/app-push-manage',
        loadChildren: './manage/app-push-manage/app-push-manage.module#AppPushManageModule'
    },
    {
        // 管理-应用配置--张威
        path: 'manage/apply-manage',
        loadChildren: './manage/apply-manage/apply-manage.module#ApplyManageModule'
    },

    // ========================一级页面分割线================================

    {
        // 营销-活动管理-活动详情
        path: 'marketing-activities',
        loadChildren: './marketing/marketing-activities/marketing-activities.module#MarketingActivitiesModule'
    },
    {
        // 营销-活动管理-效果报告
        path: 'effect-report',
        loadChildren: './marketing/effect-report/effect-report.module#EffectReportModule'
    },
    {
        // 投放效果报告--张威
        path: 'marketing-report',
        loadChildren: './marketing/report/report.module#ReportModule'
    },
    {
        // pipeline--single
        path: 'pipeline',
        loadChildren: './marketing/pipeline/pipeline.module#PipelineModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            {useHash: true}
        )
    ],
    exports: [
        RouterModule
    ]
})

export class AppRoutingModule {

}
