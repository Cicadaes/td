import {BaseModel} from "../../base/model.base";
/**
 * Created by zhaoxue on 2017-03-29.
 */

export class PartnerFilterModel extends BaseModel {
    partnerFilterChannelArray = [
        {
            id: "8",
            project_name: "渠道",
        },
        {
            id: "7",
            project_name: "商场",
        },
        {
            id: "1",
            project_name: "店铺",
            type: "region"
        }
    ];
}
