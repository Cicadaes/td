import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class CityFilterModel extends BaseModel{
    cityFilterShopArray = [
        {
            id: 1,
            project_name: "同商场",
            field: 'mall'
        },
        {
            id: 1,
            project_name: "同区县",
            field: 'county'
        }
        
    ]
}
