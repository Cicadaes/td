import {DatasourceBaseService} from './config-service/datasource.base.service';
import {DemoDataFunc} from '../reports/charts-builder/demoDataFunc';

export class ChartsConfigService extends DatasourceBaseService {
    constructor() {
        super()
    }

    newData: Array<any> = [];
    public reportName: string = '未命名报表' + Math.floor(Math.random() * 10000 + 1);
    public reportDesc: string = '';
    public backUrl: string;
    //pages config
    public stagePages: any = {
        total: 1,
        current: 0,
        currentIndex: 0,
        data: [{id: 0}]
    }

    //pageId map-hash array
    public StagePagesIdMaps: Array<any> = []
    public stageIdCurrent: number
    public sourceViewData: any;
    public isreload: any = {};
    public datasourceData: any = null;

    createStagePages(length: number) {
        let pl
        if (length === 0) {
            pl = 1
        } else {
            pl = length
        }
        this.StagePagesIdMaps = []
        this.stagePages.data = []
        for (let i = 0, j = pl; i < j; i++) {
            this.stagePages.data[i] = {id: i}
            this.StagePagesIdMaps.push(i)
        }
        this.stagePages.total = pl;
        this.stagePages.current = this.stagePages.currentIndex = this.StagePagesIdMaps[0]
    }

    setStagePagesId(): number {
        let id = this.stagePages.total;
        this.StagePagesIdMaps.push(id)
        return id
    }

    getStagePagesId(): number {
        return Math.floor(Math.random() * 10000 + 1)
    }

    //cache stage base data
    public StageBaseData: any = {};

    public _exist: any

    public pageBoolean: boolean = false;

    updateReportDataSourceConfig(dname: string, cb: any) {
        let switchDataSource = this.getDatasourceByName(dname)
        //update queens dt-view
        this._exist && (this._exist.chart.dataSource.parameters = this.DataSourceViewCurrent)
        cb()
    }

    findReportConfigsById(id: string): any {
        let r = {}
        let stageComponents = this.getStageComponents(this.stagePages.current);
        r['flag'] = stageComponents.some((item: any) => {
            if (item.chart.uuid === id) {
                this._exist = item
                r['configs'] = item
                return item.chart.uuid === id
            }

        })
        return r
    }

    mergeDataToView(viewList: any, data: any) {
        for (let i = 0; i < viewList.length; i++) {
            let obj = viewList[i];
            for (let j = 0; j < obj.fields.length; j++) {
                let field = obj.fields[j];
                this.mergeDataToViewRecursion(field, data);
            }
        }
    }

    mergeDataToViewRecursion(field: any, data: any) {
        if (data && data[field.code]) {
            field.value = data[field.code];
        }
        if (field.childrenFields) {
            for (let j = 0; j < field.childrenFields.length; j++) {
                let child = field.childrenFields[j];
                this.mergeDataToViewRecursion(child, data);
            }
        }
    }

    //init configs
    getReportConfigs(scopeid: string, viewtype: string, cb: any) {
        let fd = this.findReportConfigsById(scopeid);
        if (fd.flag) {
            //re-update configs panel
            if (fd.configs.chart.dataSource.parameters.length > 0) {
                let paraFieldsValue = fd.configs.chart.dataSource.parameters[0].fields[0].value;
            }

            this.DataSourceViewCurrent = DemoDataFunc.getDataSourceView(viewtype);
            let DataSourceData = fd.configs.chart.dataSource.data;
            this.mergeDataToView(this.DataSourceViewCurrent, DataSourceData);
            fd.configs.chart.dataSource.parameters = this.DataSourceViewCurrent;

            this.StyleViewCurrent = DemoDataFunc.getStyleView(viewtype);
            let StyleData = fd.configs.chart.style.data;
            this.mergeDataToView(this.StyleViewCurrent, StyleData);
            fd.configs.chart.style.parameters = this.StyleViewCurrent;

            this.StyleViewData = fd.configs.chart.style.data;
            this.QueryType = 0;
            this._exist = fd.configs

        } else {
            let st = this.getStyleviewDataByType(viewtype);
            let viewCode = false;
            if (!st || !st.view) {
                console.error("st.view should not be null.")
            } else {
                for (let i in st.view.fieldTabs) {
                    if (st.view.fieldTabs[i].name == "data") {
                        if (st.view.fieldTabs[i].fieldGroups[0].fields[0].code == "dataSource") {
                            viewCode = true;

                            st.view.fieldTabs[i].fieldGroups[0].fields[0].value = this.datasourceData[0];
                            st.view.fieldTabs[i].fieldGroups[0].fields[0].optionValues = this.datasourceData
                        }
                        this.DataSourceViewCurrent = st.view.fieldTabs[i].fieldGroups

                    }
                    if (st.view.fieldTabs[i].name == "style") {
                        this.StyleViewCurrent = st.view.fieldTabs[i].fieldGroups;
                        this.StyleViewData = this.styleViewData(this.StyleViewCurrent);
                        this.QueryType = 0;

                    }
                }

                if (viewCode == false) {
                    if (st.type == 13 || st.type == 12) {
                        this.DataSourceViewCurrent = [];
                    }

                }
            }

            let comp = {
                chart: {
                    "uuid": scopeid,
                    "type": viewtype,
                    "dataSourceId": 0,
                    "styleConfigDefinitionId": st.id,
                    "dataSourceConfigDefinitionId": 0,
                    "style": {"parameters": this.StyleViewCurrent, "data": this.StyleViewData},
                    "dataSource": {"parameters": this.DataSourceViewCurrent, "data": {}}
                }
            };

            this._exist = comp;
            this.stageIdCurrent = this.stagePages.current;
            let stageComponents = this.getStageComponents(this.stagePages.current);
            stageComponents.push(comp);
        }

    }

    styleViewData(style: any) {
        let styleObj: any = {};
        for (let item of style) {
            Object.assign(styleObj, this.styleFields(item.fields, {}));
        }
        return styleObj;
    }

    styleFields(fields: Array<any>, fieldsObj: any) {
        fieldsObj = fieldsObj ? fieldsObj : {};
        for (let field of fields) {
            if (field.childrenFields.length > 0) {
                Object.assign(fieldsObj, this.styleFields(field.childrenFields, fieldsObj))
            }
            fieldsObj[field.code] = field.value;
        }

        return fieldsObj;
    }

    public getStageComponents(statePageIndex: number) {
        return this.StageBaseData.stages[statePageIndex].components;
    }

}
