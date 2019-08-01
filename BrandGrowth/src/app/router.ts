
export const ROOT_ROUTES = [
  { // 营销活动
    path: 'activity',
    loadChildren: './container/activity/activity-container.module#ActivityContainerModule',
  },
  { // 管理中心
    path: 'manage-center',
    loadChildren: './container/manage-center/manage-center-container.module#ManageCenterContainerModule',
  },
  { // 数据导出
    path: 'export',
    loadChildren: './container/export/export-container.module#ExportContainerModule',
  },
  { // 媒体探索
    path: 'media-exploration',
    loadChildren: './container/media-exploration/media-exploration-container.module#MediaExplorationContainerModule',
  },
  { // 客群画像
    path: 'cus-analysis',
    loadChildren: './container/cusanalysis/cusanalysis-container.module#CusAnalysisContainerModule',
  },
  { // 营销报告
    path: 'report',
    loadChildren: './container/report/report-container.module#ReportContainerModule',
  },
  { // 品牌增长
    path: 'growth',
    loadChildren: './container/growth/growth-container.module#GrowthContainerModule',
  },
  { // 营销效果
    path: 'effect',
    loadChildren: './container/effect/effect-container.module#EffectContainerModule',
  }
];

