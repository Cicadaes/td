import { Injectable } from "@angular/core";

@Injectable()
export class MenuService {
    MENUS:any[] = [];
    superMenus: any[] = [
        {
            "label": "用户管理",
            "code":"user",
            "icon":"anticon anticon-user",
            "childrens": [{
                "label": "用户",
                "childrens": [],
                "url": "/users",
            }],
        },
        {
            "label": "权限管理",
            "code":"role",
            "icon":"anticon anticon-hourglass",
            "childrens": [{
                "label": "角色",
                "childrens": [],
                "url": "/roles",
            }],
        },
        {
            "label": "应用管理",
            "code": "app",
            "icon":"anticon anticon-appstore",
            "childrens": [/*{
                "label": "功能管理",
                "childrens": [],
                "url": "/actions",
            },*/{
                // "label": "APP管理",
                "label": "应用配置",
                "childrens": [],
                "url": "/apps",
            }],
        },
        {
            "label": "许可证管理",
            "code":"licence",
            "icon":"anticon anticon-exception",
            "childrens": [{
                "label": "许可证",
                "childrens": [],
                "url": "/licences",
            }],
        },
        {
            "label": "系统管理",
            "code":"system",
            "icon":"anticon anticon-setting",
            "childrens": [{
                "label": "日志",
                "childrens": [],
                "url": "/logs",
            }],
        }
    ];

    businessMenus: any[] = [
        {
            "label": "租户管理",
            "code":"tenant",
            "icon":"anticon anticon-team",
            "childrens": [{
                "label": "租户",
                "childrens": [],
                "url": "/tenants",
            }],
        },
        {
            "label": "许可证管理",
            "code":"licence",
            "icon":"anticon anticon-exception",
            "childrens": [{
                "label": "许可证",
                "childrens": [],
                "url": "/licences",
            }],
        },
        {
            "label": "系统管理",
            "code":"system",
            "icon":"anticon anticon-setting",
            "childrens": [{
                "label": "日志",
                "childrens": [],
                "url": "/logs",
            },{
                "label": "设置",
                "childrens": [],
                "url": "/settings",
            }],
        }
    ];

    tenantMenus: any[] = [
        {
            "label": "用户管理",
            "code":"user",
            "icon":"anticon anticon-user",
            "childrens": [{
                "label": "组织机构",
                "childrens": [],
                "url": "/organizations",
            },{
                "label": "用户组",
                "childrens": [],
                "url": "/userGroups",
            },{
                "label": "用户",
                "childrens": [],
                "url": "/users",
            }],
        },
        {
            "label": "权限管理",
            "code":"role",
            "icon":"anticon anticon-hourglass",
            "childrens": [{
                "label": "角色",
                "childrens": [],
                "url": "/roles",
            }],
        },
        {
            "label": "功能管理",
            "code": "app",
            "icon":"anticon anticon-appstore",
            "childrens": [{
                "label": "功能",
                "childrens": [],
                "url": "/actions",
            },{
                "label": "功能集",
                "childrens": [],
                "url": "/actionSets",
            }],
        },
        {
            "label": "许可证管理",
            "code":"licence",
            "icon":"anticon anticon-exception",
            "childrens": [{
                "label": "许可证",
                "childrens": [],
                "url": "/licences",
            }],
        },
        {
            "label": "系统管理",
            "code":"system",
            "icon":"anticon anticon-setting",
            "childrens": [{
                "label": "租户登录日志",
                "childrens": [],
                "url": "/logs",
            }],
        },
        {
            "label": "数据权限",
            "code":"role",
            "icon":"anticon anticon-hourglass",
            "childrens": [{
                "label": "数据权限配置",
                "childrens": [],
                "url": "/roles",
            }],
        }
    ];

    getMenus(): Promise<any[]> {

        //this.MENUS = this.superMenus;
        //this.MENUS = this.businessMenus;
        if(window['appConfig'] && window['appConfig'].menu){
            this.MENUS = [];
           
            // let temp = window['appConfig'].menu[0];
            // temp.id = 111;
            // temp.name = '数据权限';
            // temp.children[0].id = 1000;
            // temp.children[0].name = '数据权限设置';
            // temp.children[0].authorizationUri = '/dataPermissions';
            // temp.children[0].uri = '/dataPermissions';
            // console.log(window['appConfig'].menu.length);
            for(let i=0;i<window['appConfig'].menu.length;i++){
                // if(window['appConfig'].menu[i].name != "日志" && window['appConfig'].menu[i].name != "审计日志" && window['appConfig'].menu[i].name != "系统管理"){
                    this.MENUS.push(window['appConfig'].menu[i])
                
                // }
            }
            console.log('MENUS',this.MENUS);
        }
        //this.MENUS = this.tenantMenus;
        return Promise.resolve(this.MENUS);
    }

}
