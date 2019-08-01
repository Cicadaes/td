import {BaseModel} from "../../base/model.base";
/**
 * Created by nieyechen on 2017/11/15.
 */

export class FirstCityFilterModel extends BaseModel{
    firstCityFilter = [
        {
            id: 10,
            project_name: "省份",
            city_level: '%%',
            brandCityId: null,
            field: 'province'
        },
        {
            id: 3,
            project_name: "全部城市",
            city_level: '%%',
            brandCityId: '4',
            field: 'province'
        },
        {
            id: 3,
            project_name: "一线城市",
            city_level: '1',
            brandCityId: '4',
            field: 'province'
        },
        {
            id: 3,
            project_name: "二线城市",
            city_level: '2',
            brandCityId: '4',
            field: 'province'
        }
        
    ]
}
