import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class OverallFilterModel extends BaseModel {
    overallFilterShopArray = [
        {
            id: 1,
            project_name: "按店铺查看"
        },
        {
            id: 11,
            project_name: "按城市查看"
        },
        {
            id: 5,
            project_name: "按大区查看"
        },
        {
            id: 6,
            project_name: "按品牌查看"
        }
    ]

    liteArray = [
        {
            id: 1,
            project_name: "按店铺查看"
        }
    ]
}
