import { DataStore } from "cosmos-td-sdk";

export const dataType = {
    "FUNNELSTEPDATA": "funnelStepData",//漏斗步骤
    "FILTERDATA": "filterData",//过滤器
    "DIMENSIONVALUEDATA": "dimensionValueData",//维度值
    "DATEDATA":"dateData",//日期
    "DIMENSIONVALUELIST":"dimensionValueList"//传入的维度值
}
/**
 * SDK dataStore工具
 */
export class DataStoreUtil {

    private static _instance: DataStoreUtil = null;

    public static getInstance(): DataStoreUtil {
        if (!DataStoreUtil._instance) {
            DataStoreUtil._instance = new DataStoreUtil();
        }
        return DataStoreUtil._instance;
    }

    /**
     * 保存数据到数据配置dataconfig里
     * @param scope 
     * @param key 保存到dataconfig的key
     * @param config 要保存的数据配置
     */
    public static saveData2ConfigData(scope: string, key: string, config: any) {
        let data = DataStore.getConfigData(scope);
        if (!data["dataConfig"]) {
            data["dataConfig"] = {};
        }
        data["dataConfig"][key] = config;
        DataStore.saveConfigData(scope, "dataConfig", data["dataConfig"]);
    }

    /**
     * 从dataStor里获取某项数据配置
     * @param scope 
     * @param key 
     */
    public static getDataFromConfigData(scope: string, key: string) {   
        let data = DataStore.getConfigData(scope);
        if (!data || !data["dataConfig"]) {
            return null;
        }
        return data["dataConfig"][key];
    }

    /**
     * 保存数据到样式配置styleConfig
     * @param scope 
     * @param key 保存到styleConfig的key
     * @param config 保存的样式数据
     */
    public static saveData2StyleData(scope: string, key: string, config: any) {
        let data = DataStore.getConfigData(scope);
        if (!data["styleConfig"]) {
            data["styleConfig"] = {};
        }
        data["styleConfig"][key] = config;
        DataStore.saveConfigData(scope, "styleConfig", data["styleConfig"]);
    }

    /**
     * 从dataStor里获取某项样式配置
     * @param scope 
     * @param key 
     */
    public static getDataFromStyleData(scope: string, key: string) {
        let data = DataStore.getConfigData(scope);
        if (!data || !data["styleConfig"]) {
            return null;
        }
        return data["styleConfig"][key];
    }

    //过滤器数据
    public filterData: any = {};

    /**
     * 保存过滤器
     * @param scope 唯一ID
     * @param cube 数据ID
     * @param filter 过滤器名称
     * @param data 过滤器数据
     */
    public static saveFilterData(scope: string, cube: number, filter: string, data: any) {
        if (!DataStoreUtil.getInstance().filterData[scope]) {
            DataStoreUtil.getInstance().filterData[scope] = {};
        }
        if (!DataStoreUtil.getInstance().filterData[scope][cube]) {
            DataStoreUtil.getInstance().filterData[scope][cube] = {};
        }
        if (!DataStoreUtil.getInstance().filterData[scope][cube][filter]) {
            DataStoreUtil.getInstance().filterData[scope][cube][filter] = {};
        }
        DataStoreUtil.getInstance().filterData[scope][cube][filter] = data;
        this.saveData2ConfigData(scope, dataType.FILTERDATA, DataStoreUtil.getInstance().filterData)
    }

    /**
     * 获取过滤器
     * @param scope 唯一ID
     * @param cube 数据ID
     * @param filter 过滤器名称
     */
    public static getFilterData(scope: string, cube: number, filter?: string): any {
        let data = this.getDataFromConfigData(scope, dataType.FILTERDATA);
        DataStoreUtil.getInstance().filterData = data? data:{};
        if(!DataStoreUtil.getInstance().filterData[scope]){
            DataStoreUtil.getInstance().filterData = {};
        }
        if (data) {
            if (DataStoreUtil.getInstance().filterData[scope] && DataStoreUtil.getInstance().filterData[scope][cube]) {
                if (filter) {
                    return DataStoreUtil.getInstance().filterData[scope][cube][filter];
                } else {
                    return DataStoreUtil.getInstance().filterData[scope][cube];
                }
            }
        }
        return null;
    }

    /**
     * 移除过滤器
     * @param scope 唯一ID
     * @param cube 数据ID
     * @param filter 过滤器名称
     */
    public static removeFilterData(scope: string, cube: number, filter?: string) {
        if (scope && cube) {
            if (filter) {
                delete DataStoreUtil.getInstance().filterData[scope][cube][filter];
            } else {
                delete DataStoreUtil.getInstance().filterData[scope][cube];
            }
        } else {
            delete DataStoreUtil.getInstance().filterData[scope];
        }
        this.saveData2ConfigData(scope, dataType.FILTERDATA, DataStoreUtil.getInstance().filterData)
    }
}
