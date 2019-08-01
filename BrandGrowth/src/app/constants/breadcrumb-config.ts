
export const BREAD_CONFIG = [
  {
    path: 'entry', // 来源路径
    title: '营销中心', // 默认展示名称
    active: true, // Boolean 跳过该层级
    outlet: false, // Boolean 是否替换
    level: 1, // 当前层级
    // back: '', 跳转路径
    backname: false, // 后缀name
    backid: false, // 后缀 Id
    extends: false, // 配置项参数
    max: 2, // 支持的最大层级
    // children: {}, 
  },
  {
    path: 'manage-center',
    title: '管理中心',
    active: true,
    outlet: false,
    level: 1,
    back: '/manage-center',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
    children: [
      {
        path: 'auth',
        title: '授权账户',
        active: true,
        outlet: false,
        level: 2,
        back: '/manage-center/auth',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'create',
            title: '新建授权账户',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          }
        ]
      },
      {
        path: 'data',
        title: '数据管理',
        active: true,
        outlet: false,
        level: 2,
        back: '/manage-center/data',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'create-data',
            title: '新建数据回调',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          }
        ]
      },
      {
        path: 'crowd',
        title: '受众管理',
        active: true,
        outlet: false,
        level: 2,
        back: '/manage-center/crowd',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'create',
            title: '新建人群',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2
          },
          {
            path: 'edit',
            title: '编辑人群',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2
          },
        ]
      },
      {
        path: 'btl',
        title: '线下区域管理',
        active: true,
        outlet: false,
        level: 2,
        back: '/manage-center/btl',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'operation-btl',
            title: '创建线下区域',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2
          },
          {
            path: 'edit-btl',
            title: '编辑线下区域',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          },
        ]
      },
      {
        path: 'landing',
        title: '着陆页管理',
        active: true,
        outlet: false,
        level: 2,
        back: '/manage-center/landing',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'create-landing',
            title: '新增着陆页',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          }
        ]
        
      },
    ]
  },
  {
    path: 'activity',
    title: '营销活动',
    active: true,
    outlet: false,
    level: 1,
    back: '/activity',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
    children: [
      {
        path: 'create',
        title: '新建营销活动',
        active: true,
        outlet: true,
        level: 2,
        backname: false,
        backid: false,
        extends: false,
        max: 2
      },
      {
        path: 'overview',
        title: '活动总览',
        active: true,
        outlet: false,
        level: 2,
        back: '/activity/overview',
        backname: false,
        backid: false,
        extends: false,
        max: 2
      },
      {
        path: 'chain',
        title: '监测链接',
        active: true,
        outlet: false,
        level: 2,
        back: '/activity/chain',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'create',
            title: '新建监测链接',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          },
          {
            path: 'edit',
            title: '编辑监测链接',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          },
          {
            path: 'details',
            title: '监测链接详情',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          },
          {
            path: 'frequency',
            title: '监测链接详情',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          },
          {
            path: 'click',
            title: '监测链接详情',
            active: true,
            outlet: true,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 2,
          }
        ]
      },
      {
        path: 'analyze',
        title: '活动页分析',
        active: true,
        outlet: false,
        level: 2,
        back: '/activity/analyze',
        backname: false,
        backid: false,
        extends: false,
        max: 2
      },
      {
        path: 'detection',
        title: '线下监测',
        active: true,
        outlet: false,
        level: 2,
        back: '/activity/detection',
        backname: false,
        backid: false,
        extends: false,
        max: 2
      },
      {
        path: 'protect',
        title: '作弊防护',
        active: true,
        outlet: false,
        level: 2,
        back: '/activity/protect',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'protect-detail',
            title: '作弊防护详情',
            active: true,
            outlet: true,
            level: 3,
            back: '/activity/protect',
            backname: true,
            backid: true,
            extends: false,
            max: 2,}
          ]
      },
      {
        path: 'setting',
        title: '活动设置',
        active: true,
        outlet: false,
        level: 2,
        back: '/activity/setting',
        backname: false,
        backid: false,
        extends: false,
        max: 2,
        children: [
          {
            path: 'protect-setting',
            title: '作弊防护设置',
            active: true,
            outlet: false,
            level: 3,
            back: '/activity/setting/protect-setting',
            backname: false,
            backid: false,
            extends: false,
            max: 2
          },
          {
            path: 'connect-setting',
            title: '监测链接组设置',
            active: true,
            outlet: false,
            level: 3,
            back: '/activity/setting/connect-setting',
            backname: false,
            backid: false,
            extends: false,
            max: 2,
            children:[
              {
                path: 'create-connect',
                title: '新建监测链接组',
                active: true,
                outlet: true,
                level: 4,
                backname: false,
                backid: false,
                extends: false,
                max: 2
              },
            ]
          },

        ]
      }
    ]
  },
  {
    path: 'export',
    title: '数据导出',
    active: true,
    outlet: false,
    level: 1,
    back: '/export',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
    children: [
      {
        path: 'create',
        title: '新建数据导出',
        active: true,
        outlet: true,
        level: 2,
        back: '/report/create',
        backname: true,
        backid: true,
        extends: false,
        max: 2,
      }
    ]
  },
  {
    path: 'growth',
    title: '品牌增长',
    active: true,
    outlet: false,
    level: 1,
    back: '/growth',
    backname: false,
    backid: false,
    extends: false,
    max: 1,
  },
  {
    path: 'media-exploration',
    title: '媒体探索',
    active: true,
    outlet: false,
    level: 1,
    back: '/media-exploration',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
    children: [
      {
        path: 'create',
        title: '新建媒体探索',
        active: true,
        outlet: true,
        level: 2,
        back: '/media-exploration/create',
        backname: true,
        backid: true,
        extends: false,
        max: 2,
      }]
  },
  {
    path: 'cus-analysis',
    title: '客群画像',
    active: true,
    outlet: false,
    level: 1,
    back: '/cus-analysis',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
    children: [
      {
        path: 'operation-cus-analysis',
        title: '创建客群画像',
        active: true,
        outlet: false,
        level: 2,
        backname: false,
        backid: false,
        extends: false,
        max: 2,
      },
      {
        path: 'edit-cus-analysis',
        title: '编辑客群画像',
        active: true,
        outlet: false,
        level: 2,
        backname: false,
        backid: false,
        extends: false,
        max: 2,
      },
      {
        path: 'cus-analysis-details',
        title: '客群分析',
        active: true,
        outlet: false,
        level: 2,
        backname: false,
        backid: false,
        extends: false,
        max: 2,
      },
    ]
  },
  {
    path: 'report',
    title: '营销报告',
    active: true,
    outlet: false,
    level: 1,
    back: '/report',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
    children: [
      {
        path: 'create',
        title: '新建营销报告',
        active: true,
        outlet: true,
        level: 2,
        back: '/report/create/select-type',
        backname: true,
        backid: true,
        extends: false,
        max: 2,
        children: [
          {
            path: 'select-type',
            title: '选择报告类型',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 3,
          },
          {
            path: 'edit-data',
            title: '编辑信息',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 3
          },
        ]
      },
      {
        path: 'edit',
        title: '新建营销报告',
        active: true,
        outlet: true,
        level: 2,
        back: '/edit/create/select-type',
        backname: true,
        backid: true,
        extends: false,
        max: 2,
        children: [
          {
            path: 'select-type',
            title: '选择报告类型',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 3,
          },
          {
            path: 'edit-data',
            title: '编辑信息',
            active: true,
            outlet: false,
            level: 3,
            backname: false,
            backid: false,
            extends: false,
            max: 3
          },
        ]
      }
    ]
  },
  {
    path: 'effect',
    title: '营销效果',
    active: true,
    outlet: false,
    level: 1,
    back: '/effect',
    backname: false,
    backid: false,
    extends: false,
    max: 2,
  }
];

export const parseBreadcrumbConfig = (urlStr: string, urls?: any[], list: any[] = BREAD_CONFIG): any[] => {
  if (!urls) urls = [];
  list.forEach((item: any) => {
    urlStr.split('/').forEach((ur: any, index: number) => {
      if (item.path == ur && index == item.level) {
        urls.push({
          path: item.path,
          title: item.title,
          active: item.active,
          outlet: item.outlet,
          level: item.level,
          back: item.back,
          backname: item.backname,
          backid: item.backid,
          extends: item.extends,
          max: item.max
        })
        if (item.children) {
          return parseBreadcrumbConfig(urlStr, urls, item.children);
        }
      }
    })
  });
  return urls;
}