/**
 * Created by wangshouyun on 2017/3/9.
 */
import { View } from "../views/view";
import { Single } from '../single';

export class DataStore {
    constructor(single: Single) {
        if (!(single instanceof Single)) {
            throw ("....");
        }
    }

    private static _instance: DataStore = null;

    public static getInstance(): DataStore {
        if (!DataStore._instance) {
            DataStore._instance = new DataStore(new Single());
        }
        return DataStore._instance;
    }

    // 注册的组件
    public registerComponents: any[] = [];

    public static saveRegisterComponents(data: any[]) {
        DataStore.getInstance().registerComponents = data;
    }

    public static getRegisterComponents() {
        return DataStore.getInstance().registerComponents;
    }

    // 拖入的组件list对象
    public componentData: any = {};

    public static saveComponentInstance(view: View) {
        DataStore.getInstance().componentData[view.scope] = view;
    }

    public static getComponentInstance(scope: string) {
        return DataStore.getInstance().componentData[scope];
    }

    public static removeComponentInstance(view: View) {
        delete DataStore.getInstance().componentData[view.scope];
    }

    //配置面板相关操作
    public configData: any = {};

    /**
     * 保存配置面板数据到DataStore
     * @param scope 图表ID
     * @param type 类型：数据面板；样式面板
     * @param config 配置数据
     */
    public static saveConfigData(scope: string, type: string, config: any) {
        if (!DataStore.getInstance().configData[scope]) {
            DataStore.getInstance().configData[scope] = {};
        }
        DataStore.getInstance().configData[scope][type] = config;
    }

    /**
     * 通过scope获取面板数据
     * @param scope 
     */
    public static getConfigData(scope: string) {
        return DataStore.getInstance().configData[scope];
    }

    /**
     * 清除面板数据
     * @param scope 
     */
    public static removeConfigData(scope: string) {
        delete DataStore.getInstance().configData[scope];
    }

    //舞台数据
    public pagesData: any = [];

    /**
     * 保存舞台数据DataStore
     * @param data 舞台数据
     */
    public static savePagesData(data: any) {
        DataStore.getInstance().pagesData = data;
    }

    /**
     * 获取舞台数据
     */
    public static getPagesData() {
        return DataStore.getInstance().pagesData;
    }

    //全局配置数据
    public globalData: any = null;

    /**
     * 保存全局配置数据
     * @param data 配置数据
     */
    public static saveGlobalData(data: any) {
        DataStore.getInstance().globalData = data;
    }

    /**
     * 获取全局配置数据
     */
    public static getGlobalData() {
        return DataStore.getInstance().globalData;
    }
}
