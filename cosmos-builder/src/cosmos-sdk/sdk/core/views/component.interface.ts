import { BaseInterface } from "../base/base.interface";

export interface ComponentInterface extends BaseInterface {
    onVisualArea(scope:string, data?:any): void;
}