import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class CellsFilterModel extends BaseModel{
    cellsFilterShopArray = [
        {
            id: "1",
            project_name: "按店铺查看",
            type:"shop"
        },
        {
            id: "11",
            project_name: "按城市查看",
            type:"city"
        },
        {
            id: "5",
            project_name: "按大区查看",
            type:"region"
        },
        {
            id: "6",
            project_name: "按品牌查看",
            type:"brand"
        }
       
    ]
}
