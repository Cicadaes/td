/**
 * Created by lamph on 2017/1/9.
 */
export class ConfigChartBase {
    code: string;
    name: string;
    description: string;
    valueType: any;
    value: any = {
        titleValue : null,
        textValue : false
    };
    defaultValue: any;
    minValue: any;
    maxValue: any;
    optionValues: any;
    requried: boolean;
    helpInfo: string;
    viewType: number;
    viewMetaData: any;
    childrenFields:Array<any>;

    constructor(options: {
        code?: string,
        name?: string,
        description?: string,
        valueType?: any,
        value?: any,
        defaultValue?: any,
        minValue?: any,
        maxValue?: any,
        optionValues?: any,
        requried?: boolean,
        helpInfo?: string,
        viewType?: number,
        childrenFields?:Array<any>

    } = {}) {
        this.code = options.code;
        this.name = options.name;
        this.description = options.description;
        this.valueType = options.valueType;
        this.value = options.value;
        this.value.titleValue = options.value.titleValue;
        this.value.textValue = options.value.textValue;
        this.defaultValue = options.defaultValue;
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.optionValues = options.optionValues;
        this.requried = !!options.requried;
        this.helpInfo = options.helpInfo;
        this.viewType = options.viewType;
        this.childrenFields = options.childrenFields || [];
    }
}
