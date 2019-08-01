import {BaseModel} from "../base.model";

export class ProductModel extends BaseModel{

    /**  */
    productid: number;
    /**  */
    sequencenumber: string;
    /**  */
    developerid: number;
    /**  */
    tenantcode: string;
    /**  */
    platform: number;
    /**  */
    productype: number;
    /**  */
    productname: string;
    /**  */
    productmemo: string;
    /**  */
    registertime: Date;
    /**  */
    isdeleted: number;
    /**  */
    iscompensate: number;
    /**  */
    category: number;
    /**  */
    domain: string;
    /**  */
    lastModifyTime: Date;
    /**  */
    isupgrade: number;

}
