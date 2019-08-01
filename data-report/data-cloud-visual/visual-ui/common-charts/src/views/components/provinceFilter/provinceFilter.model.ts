import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class ProvinceFilterModel extends BaseModel{
     provinceFilterShopArray = [
        {
            id: 10,
            project_name: "省份",
            field: 'province'
        },
        {
            id: 3,
            project_name: "城市",
            field: 'city'
        },
        {
            id: 1,
            project_name: "店铺",
            field: 'store'
        }
        
    ]
}
