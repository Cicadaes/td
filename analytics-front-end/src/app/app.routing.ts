import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'product-center',
    pathMatch: 'full'
  },

  // ==========================================

  {
    // 产品中心
    path: 'product-center',
    loadChildren: './product-center/product-center.module#ProductCenterModule'
  },
  {
    // 配置报表
    path: 'studio-analysis',
    loadChildren: './business-overview/business-overview.module#BusinessOverviewModule'
  },
  {
    // 业务概览（我的报表，共享报表，营销计划）
    path: 'business-overview',
    loadChildren: './business-overview/business-overview.module#BusinessOverviewModule'
  },
  {
    // 我的报表，共享报表
    path: 'business-overview/studio',
    loadChildren: './business-overview/business-overview.module#BusinessOverviewModule'
  },
  {
    // 自定义看板
    path: 'custom-analysis/studio',
    loadChildren: './basic-analysis/basic-analysis.module#BasicAnalysisModule'
  },
  {
    // 用户配置报表
    path: 'user-configured/studio',
    loadChildren: './manage/user-configured/user-configured.module#UserConfiguredModule'
  },
  {
    // 业务预警
    path: 'early-warning',
    loadChildren: './scene-insight/early-warning/early-warning.module#EarlyWarningModule'
  },

  {
    // 业务预警 规则
    path: 'warning-rules-view',
    loadChildren: './scene-insight/early-warning/early-warning-rule/early-warning-rule.module#EarlyWarningRuleModule'
  },
  {
    // 基础分析（留存分析, 行为分析，自定义分析）
    path: 'basic-analysis',
    loadChildren: './basic-analysis/basic-analysis.module#BasicAnalysisModule'
  },

  // ==========================================

  {
    // 页面分析-页面路径
    path: 'page-analysis/page-path',
    loadChildren: './page-analysis/page-path/page-path.module#PagePathModule'
  },
  {
    // 页面分析-页面热力图
    path: 'page-analysis/page-heatmap',
    loadChildren: './page-analysis/page-heatmap/page-heatmap.module#PageHeatmapModule'
  },

  // ==========================================

  {
    // 用户-用户分群
    path: 'user/user-group',
    loadChildren: './user/user-group/user-group.module#UserGroupModule'
  },
  {
    // 用户-用户洞察
    path: 'user/user-insight',
    loadChildren: './user/user-insight/user-insight.module#UserInsightModule'
  },
  {
    // 用户-位置分析
    path: 'user/position-analysis',
    loadChildren: './user/position-analysis/position-analysis.module#PositionAnalysisModule'
  },

  // ==========================================

  {
    // 场景洞察-转化漏斗
    path: 'scene-insight/trans-funnel',
    loadChildren: './scene-insight/trans-funnel/trans-funnel.module#TransFunnelModule'
  },
  {
    // 场景洞察-高级转化漏斗
    path: 'scene-insight/advanced-trans-funnel',
    loadChildren: './scene-insight/advanced-trans-funnel/advanced-trans-funnel.module#AdvancedTransFunnelModule'
  },
  {
    // 智能路径
    path: 'scene-insight/capacity-path',
    loadChildren: './scene-insight/capacity-path/capacity-path.module#CapacityPathModule'
  },

  // ==========================================

  {
    // 管理-系统管理
    path: 'manage/manage-system',
    loadChildren: './manage/manage-system/manage-system.module#ManageSystemModule'
  },
  {
    // 管理-用户配置
    path: 'manage/user-configured',
    loadChildren: './manage/user-configured/user-configured.module#UserConfiguredModule'
  },

  // ==========================================

  {
    // 数据下载
    path: 'download',
    loadChildren: './download-data/download-data.module#DownloadDataModule'
  },
  {
    // 数据下载
    path: 'download-data',
    loadChildren: './download-data/download-data.module#DownloadDataModule'
  },
  {
    // 数据查询
    path: 'data-search',
    loadChildren: './data-search/data-search.module#DataSearchModule'
  },
  // ========================一级页面分割线================================

  {
    // 用户-用户分群-创建人群
    path: 'crowd-create',
    loadChildren: './user/crowd-create/crowd-create.module#CrowdCreateModule'
  },
  {
    // 用户-用户分群-画像-导出
    path: 'crowd-export',
    loadChildren: './user/export/export.module#ExportModule'
  },
  {
    // user/user-profile
    path: 'user/user-profile',
    loadChildren: './user/user-profile/user-profile.module#UserProfileModule'
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
  },

  // ========================一级页面分割线================================

  {
    // APP错误分析
    path: 'app-error',
    loadChildren: './app-error/app-error.module#AppErrorModule'
  },

  // ========================一级页面分割线================================
  {
    // 分包渠道分析
    path: 'subcontract-channels',
    loadChildren: './channels/subcontract-channels/subcontract-channels.module#subcontractChannelsModule'
  },
  {
    path: 'traffic-sources',
    loadChildren: './channels//traffic-sources/traffic-sources.module#trafficSourcesModule'
  },

  // ======================== AEP 6.0 新功能 配置管理================================
  {
    path: 'config-manage',
    loadChildren: './manage/config-manage/config-manage.module#ConfigManageModule'
  },
  // ========================一级页面分割线================================
  {
    path: 'echarts-config',
    loadChildren: './common/echartstest/echartstest.module#EchartsTestModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
