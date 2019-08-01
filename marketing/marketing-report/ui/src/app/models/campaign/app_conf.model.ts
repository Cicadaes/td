import {BaseModel} from "../base.model";

export class AppConfModel extends BaseModel{

    /** 主键 */
    id: number;
    /** appId */
    appId: string;
    /** app名称 */
    appName: string;
    /** 华为AppID */
    hwApp: string;
    /** 华为APPSecret */
    hwSecret: string;
    /** 小米APPID */
    xmApp: string;
    /** 小米APPSecret */
    xmSecret: string;
    /** 个推APPID */
    getuiApp: string;
    /** 个推APPKey */
    getuiKey: string;
    /** 个推APPSecret */
    getuiSecret: string;
    /** 极光APPKey */
    jpushKey: string;
    /** 极光APPSecret */
    jpushSecret: string;
    /** iOS生产证书文件名 */
    prodFilename: string;
    /** iOS生产证书失效日期 */
    prodExpiryDate: string;
    /** 生产证书文件 */
    prodPem: any;
    /** iOS开发证书文件名 */
    devFilename: string;
    /** iOS开发证书失效日期 */
    devExpiryDate: string;
    /** 开发证书文件 */
    devPem: any;
    /** 租户ID */
    tenantId: number;
    /** 创建人 */
    creator: string;
    /** 创建人账号 */
    createBy: string;
    /** 创建时间 */
    createTime: Date;
    /** 更新人 */
    updater: string;
    /** 更新人账号 */
    updaterBy: string;
    /** 最后更新时间 */
    updateTime: Date;

}
