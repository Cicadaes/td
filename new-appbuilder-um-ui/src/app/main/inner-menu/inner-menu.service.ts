import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http } from '@angular/http';
import { CRUDService } from '../../components/common/services/crud.service';

@Injectable()
export class InnerMenuService extends CRUDService {
    tenantId: any;
    queryTenantById = '/console-api/tenant/queryTenantById';

    // 运营管理员菜单列表（前端写死）
    MENUS: any[] = [
        {
            'label': '租户管理',
            'code': 'tenant',
            'icon': 'iconfont icon-person',
            'childrens': [{
                'label': '组织机构',
                'childrens': [],
                'url': '/tenants/organizations/',
            }, {
                'label': '用户组',
                'childrens': [],
                'url': '/tenants/userGroups/',
            }, {
                'label': '用户',
                'childrens': [],
                'url': '/tenants/tenantusers/',
            }],
        }, {
            'label': '角色管理',
            'code': 'role',
            'icon': 'iconfont icon-lock',
            'childrens': [],
            'url': '/tenants/roles/',
            // 'childrens': [{
            //     'label': '角色',
            //     'childrens': [],
            //     'url': '/tenants/roles/',
            // }],
        },
        {
            'label': '数据权限管理',
            'code': 'dataPermissions',
            'icon': 'ionfontper',
            'childrens': [],
            'url': '/tenants/dataPermissions/'
        },
        {
            'label': 'API账号管理',
            'code': 'tenantsApiAccount',
            'icon': 'anticon anticon-setting',
            'childrens': [],
            'url': '/tenants/tenantsApiAccount/'
        },
        {
            'label': '应用信息',
            'code': 'tenantsApps',
            'icon': 'iconfont icon-widgets',
            'childrens': [],
            'url': '/tenants/tenantsApps/',
            // 'childrens': [{
            //     'label': '应用',
            //     'childrens': [],
            //     'url': '/tenants/tenantsApps/',
            // }],
        }, {
            'label': '许可证管理',
            'code': 'tenantsLicences',
            'icon': 'iconfont icon-security',
            'childrens': [],
            'url': '/tenants/tenantsLicences/',
            // 'childrens': [{
            //     'label': '许可证',
            //     'childrens': [],
            //     'url': '/tenants/tenantsLicences/',
            // }],
        },
        // {
        //     'label': '租户登录日志',
        //     'code':'system',
        //     'icon':'anticon anticon-setting',
        //     'childrens': [],
        //     'url': '/tenants/logs/',
        //     // 'childrens': [{
        //     //     'label': '租户登录日志',
        //     //     'childrens': [],
        //     //     'url': '/tenants/logs/',
        //     // }],
        // }
    ];

    // 超级管理员和租户管理员菜单是有后端数据填充的

    getMenus(tenantId: any): Promise<any[]> {
        this.tenantId = tenantId;
        return Promise.resolve(this.MENUS);
    }

    getInnerMenus(ajaxUrl: string, params: any) {
        return this.http.post(`${ajaxUrl}`, params, { headers: this.headers });
    }

    getTenant(): Promise<any> {
        let tenant: any = {};
        if (window['appConfig'] && window['appConfig'].tenant) {
            tenant = window['appConfig'].tenant;
        }
        return Promise.resolve(tenant);
    }

    getTenantById(id: number) {
        const params = { id: id };
        return this.poste(this.queryTenantById, params);
    }

    constructor(public http: Http) {
        super(http);
    }
}
