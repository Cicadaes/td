import { Component, OnInit, OnDestroy, Input, ElementRef, Output, ChangeDetectorRef, EventEmitter, ViewContainerRef } from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { filterFixedService } from './filter-fixed.service';
import { Subscription } from 'rxjs/Subscription';
import { ReportConfigService } from '../../../../../../sdk-ui/service/report-config.service';
import { ConfigApi } from '../../../../../../sdk-ui/api/config-api';
import { DataStore } from 'cosmos-td-sdk';
import { DataStoreUtil, dataType } from '../../../../../../sdk-ui/api/data-store-util';


let that = this;

@Component({
    selector: 'filter-fixed',
    templateUrl: './filter-fixed.component.html',
    styleUrls: ['./filter-fixed.component.less'],
})

export class filterFixedComponent implements OnInit {
    private isCreate: boolean = false;
    private positionStyles: object = {};
    private title: string;
    private name: string = null;
    private subscription: Subscription;
    private liIndex: number = 1;
    private ulIndex: number = 1;
    private dataSource: any;
    private disabled: boolean = true;
    private options2: Array<any> = [];
    private _dateRange: any[] = [null, null];
    private length: number;
    private dictObj: any;//数据字典参数
    private newArr: any[] = [];//初始化数据
    private deepArr: any[] = [];//初始化数据
    private save: boolean = false;
    private isChange: boolean = false;
    private cubeId: number;
    private saveDataOK: boolean = false;
    private filter: any;
    private newfilter: any;
    private nameRequired: any;
    private nameRepeat: boolean;
    private update: boolean = false;
    options1 = [
        {
            value: '包含',
            label: '包含'
        },
        {
            value: '排除',
            label: '排除'
        },
    ];

    options3 = [
        {
            value: '=',
            label: '等于(=)',
        },
        {
            value: '>=',
            label: '晚于(>=)'
        },
        {
            value: '<=',
            label: '早于(<=)'
        },
        {
            value: '在区间',
            label: '在区间'
        },
        // {
        //     value: 'in',
        //     label: '包含(in)'
        // },
    ];

    options4 = [
        {
            value: '=',
            label: '等于(=)'
        },
        {
            value: '!=',
            label: '不等于(!=)'
        },
        {
            value: 'in',
            label: '包含(in)'
        },
    ];

    options5 = [
        {
            value: '=',
            label: '等于(=)'
        },
        {
            value: '>',
            label: '大于(>)'
        },
        {
            value: '<',
            label: '小于(<)'
        },
        {
            value: 'in',
            label: '包含(in)'
        },
        {
            value: '>=',
            label: '大于等于(>=)'
        },
        {
            value: '<=',
            label: '小于等于(<=)'
        },
        {
            value: '在区间',
            label: '在区间'
        },
    ];
    andArr: any[] = [
        {
            "id": 1,
            "firstClick": false,
            "orArr": [
                {
                    "id": 1,
                    "firstClick": false,
                    "option1": '包含',
                    "option2": null,
                    "option3": null,
                    "_dateRange": [null, null],
                    "showDateOption": false,
                    "showElseOption": false,
                    "showindexOption": false,
                    "verificationAll": true,
                    'textSelect': {
                        "showInput": false,
                        "showTwoInput": false,
                        "showManyInput": false,
                        "showCheckSelect": false,
                        "showCheckcascader": false,
                        "showDate": false,
                        "showTwoDate": false
                    }
                }
            ]
        }
    ];

    // 多选下拉框
    selectedMultipleOption: any;
    searchOptions = [
        {
            value: '2017-11-01',
            label: '2017-11-01'
        }, {
            value: '2017-11-02',
            label: '2017-11-02'
        }, {
            value: '2017-11-03',
            label: '2017-11-03'
        }
    ];
    private updateName: string;

    constructor(
        private confirmServ: CmModalService,
        private filterFixedService: filterFixedService,
        private reportConfigService: ReportConfigService,
        public configApi: ConfigApi,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        that = this;
        // cube的字段
        this.subscription = this.filterFixedService.missionisShowSource$.subscribe((obj: any) => {
            this.cubeId = obj.cubeId;
            this.buildoption(obj.value, obj.type);
        });

        // 修改过滤器
        this.subscription = this.filterFixedService.missionupdateFilter$.subscribe((obj: any) => {
            this.title = "修改";
            this.isCreate = true;
            this.positionStyles = {
                'transform': 'translateY(-387px)',
                'transition': 'all 0.5s ease 0s'
            }
            this.disabled = false;
            this.cubeId = obj.cube;
            this.name = obj.name;
            this.update = true;
            this.filter = DataStoreUtil.getFilterData(this.configApi.scope, obj.cube, obj.name);
            this.updateName = obj.name;
            if (this.filter) {
                for (let i = 0; i < this.filter.length; i++) {
                    if (this.filter[i].orArr.length == 1) {
                        this.filter[i].orArr[0]['firstClick'] = false;
                    }
                }
                this.updateBuildoption(this.filter);
            }
        });
    }

    ngOnInit() {
        this.name = "";
        this.andArr['required'] = false;
        this.andArr['verificationAll'] = false;
        this.andArr['saveDataOK'] = false;
    }

    async updateBuildoption(arr: any) {
        let attrData = await this.configApi.getAttributeByCubeId(this.cubeId);
        this.options2 = [];
        this.getField(attrData, this.filter);
        this.newfilter = this.deepCopy(arr);
        this.andArr = this.newfilter;
        for (let i = 0; i < this.andArr.length; i++) {
            for (let j = 0; j < this.andArr[i].orArr.length; j++) {
                if (this.andArr[i].orArr[j]['type'] == "twoDate") {
                    let date = this.andArr[i].orArr[j]['option4'];
                    this.andArr[i].orArr[j]['_dateRange'] = [new Date(date[0]), new Date(date[1])];
                }
                if (this.andArr[i].orArr[j]['dictObj']) {
                    this.dictObj = this.andArr[i].orArr[j]['dictObj']
                }
            }
        }
        this.changeField();
    }

    getField(data: any, arr: any) {
        for (let i = 0; i < data.length; i++) {
            this.options2.push({
                id: data[i].id,
                value: data[i].metaAttributeName,
                label: data[i].metaAttributeName,
                metaAttributeType: data[i].metaAttributeType,
                isEnum: data[i].isEnum,
                type: data[i].type,
                parentName: data[i].parentName,
                dictionaryId: data[i].dictionaryId
            })
        }
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].orArr.length; j++) {
                arr[i].orArr[j].options = this.options2;
            }
        }
        this.changeField();
    }

    async buildoption(value: boolean, type: string) {
        let attrData = await this.configApi.getAttributeByCubeId(this.cubeId);
        this.options2 = [];
        if (attrData && attrData.length > 0) {
            this.getField(attrData, this.andArr);
            this.isShow(value, type);
        } else {
            this.confirmServ.warning({
                title: '您所选的cube字段为空',
            });
        }
    }

    // 过滤窗口
    isShow(value: boolean, type: string) {
        if (value == true) {//打开
            this.isCreate = value;
            this.positionStyles = {
                'transform': 'translateY(-387px)',
                'transition': 'all 0.5s ease 0s'
            }
        }
        if (type == 'create') {
            this.title = "创建";
            this.updateName = "";
            this.initData();
            this.name = "";
            this.update = false;
        } else if (type == 'save') {//保存
            this.saveData(this.andArr);
        } else if (type = "close") {//关闭--对比异同
            this.isChange = false;
            if (this.update == true) {
                this.filter['nameRepeat'] = false;
                this.filter['nameRequired'] = false;
                this.filter = this.loopQuote(this.filter);
                this.andArr = this.loopQuote(this.andArr);
                if (JSON.stringify(this.filter) == JSON.stringify(this.andArr)) {
                    this.isChange = false;
                } else {
                    // console.log('修改对比', this.filter, this.andArr);
                    this.isChange = true;
                    this.showConfirm()
                }
            } else {
                this.andArr['nameRepeat'] = false;
                this.andArr['nameRequired'] = false;
                this.andArr = this.loopQuote(this.andArr);
                if (JSON.stringify(this.andArr) == JSON.stringify(this.newArr)) {
                    this.isChange = false;
                } else {
                    // console.log('创建对比', this.andArr, this.newArr);
                    this.isChange = true;
                    this.showConfirm();
                }
            }
            if (this.isChange == false) {
                this.isCreate = value;
                this.positionStyles = {
                    'transform': 'translateY(0px)',
                    'transition': 'all 0.5s ease 0s'
                }
            }
        }
        this.changeField();
    }

    // 未保存提示框
    showConfirm() {
        let that = this;
        this.confirmServ.confirm({
            title: '您还有内容没有保存，是否确认关闭',
            onOk() {
                that.disabled = true;
                that.isCreate = false;
                that.positionStyles = {
                    'transform': 'translateY(0px)',
                    'transition': 'all 0.5s ease 0s'
                }
            },
            onCancel() {
            }
        });
    }

    //循环调用
    loopQuote(data: any) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].orArr.length; j++) {
                let options = data[i].orArr[j].cityOption;
                if (options) {
                    for (let k = 0; k < options.length; k++) {
                        options[k].children = [];
                    }
                }
            }
        }
        return data;
    }

    // 初始化数据
    initData() {
        this.andArr = [
            {
                "id": 1,
                "firstClick": false,
                "orArr": [
                    {
                        "id": 1,
                        "firstClick": false,
                        "option1": '包含',
                        "option2": null,
                        "option3": null,
                        "_dateRange": [null, null],
                        "showDateOption": false,
                        "showElseOption": false,
                        "showindexOption": false,
                        "verificationAll": true,
                        "options": this.options2,
                        'textSelect': {
                            "showInput": false,
                            "showTwoInput": false,
                            "showManyInput": false,
                            "showCheckSelect": false,
                            "showCheckcascader": false,
                            "showDate": false,
                            "showTwoDate": false
                        }
                    }
                ]
            }
        ];
        this.newArr = this.deepCopy(this.andArr);
    }

    // 保存数据
    saveData(data: any) {
        if (this.name == "") {
            this.confirmServ.warning({
                title: '请输入过滤器名称'
            })
        } else if (!this.andArr['nameRepeat']) {
            data = this.loopQuote(data)
            let arr = this.deepCopy(data);
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].orArr.length; j++) {
                    arr[i].orArr[j].options = null;
                    if (arr[i].orArr[j].option2 === null) {
                        arr[i].orArr.splice(j, 1)
                    }
                }
                if (arr[i].orArr.length == 0) {
                    arr.splice(i, 1)
                }
            }
            this.initData();
            this.disabled = true;
            this.isCreate = false;
            this.positionStyles = {
                'transform': 'translateY(0px)',
                'transition': 'all 0.5s ease 0s'
            }
            if (this.updateName) {
                let name = this.updateName;
                let updatefilter = DataStoreUtil.getFilterData(this.configApi.scope, this.cubeId, name);
                if (updatefilter) {
                    // console.log('修改时如果有，则覆盖');
                    DataStoreUtil.removeFilterData(that.configApi.scope, this.cubeId, name);
                }
            }
            DataStoreUtil.saveFilterData(this.configApi.scope, this.cubeId, this.name, arr);
            this.filterFixedService.SAVE();
        }
    }

    // 新增or
    addLi(and: any, or: any) {
        if (or['firstClick'] == false) {
            this.liIndex++;
            for (let i = 0; i < this.andArr.length; i++) {
                if (this.andArr[i].id == and.id) {
                    this.andArr[i].orArr.push({
                        "id": this.liIndex,
                        "firstClick": false,
                        "option1": '包含',
                        "option2": null,
                        "option3": null,
                        "_dateRange": [null, null],
                        "showDateOption": false,
                        "showElseOption": false,
                        "showindexOption": false,
                        "verificationAll": true,
                        "options": this.options2,
                        'textSelect': {
                            "showInput": false,
                            "showTwoInput": false,
                            "showManyInput": false,
                            "showCheckSelect": false,
                            "showCheckcascader": false,
                            "showDate": false,
                            "showTwoDate": false
                        }
                    })
                }
            }
            or['firstClick'] = true;
        }
        this.changeField();
    }

    // 删除or
    delectLi(andId: any, orId: any) {
        for (let i = 0; i < this.andArr.length; i++) {
            if (this.andArr[i].id == andId) {
                for (let j = 0; j < this.andArr[i].orArr.length; j++) {
                    if (this.andArr[i].orArr[j].id == orId) {
                        if (this.andArr.length == 1 && this.andArr[0].orArr.length == 1) {
                            this.confirmServ.warning({
                                title: '请至少保留一条筛选条件',
                            });
                        } else {
                            this.andArr[i].orArr.splice(j, 1);
                            if (this.andArr[i].orArr.length > 0) {
                                if (j == 0) {
                                    this.andArr[i].orArr[j]['firstClick'] = false;
                                } else {
                                    this.andArr[i].orArr[j - 1]['firstClick'] = false;
                                }
                            }
                        }
                    }
                }
            }
            if (this.andArr[i].orArr.length == 0) {
                this.andArr.splice(i, 1);
                this.andArr[i - 1]['firstClick'] = false;
            }
        }
        this.changeField();
        this.saveBtnStatus();
    }

    // 新增and
    addUl(and: any) {
        if (and['firstClick'] == false) {
            this.ulIndex++;
            this.andArr.push({
                "id": this.ulIndex,
                "firstClick": false,
                "orArr": [
                    {
                        "id": 1,
                        "firstClick": false,
                        "option1": '包含',
                        "option2": null,
                        "option3": null,
                        "_dateRange": [null, null],
                        "showDateOption": false,
                        "showElseOption": false,
                        "showindexOption": false,
                        "verificationAll": true,
                        "options": this.options2,
                        'textSelect': {
                            "showInput": false,
                            "showTwoInput": false,
                            "showManyInput": false,
                            "showCheckSelect": false,
                            "showCheckcascader": false,
                            "showDate": false,
                            "showTwoDate": false
                        }
                    }
                ]
            });
            and['firstClick'] = "true";
        }
        this.changeField();
    }

    // 改变包含
    isChanges(or: any) {
        this.isChange = true;
        or["verificationAll"] = false;
        if (or["option4"]) {
            or["verificationAll"] = true;
        }
        this.saveBtnStatus();
    }

    //改变字段 
    selectField(option: any, or: any) {
        this.isChange = true;
        or.option3 = null;
        if (or.textSelect['showTwoInput']) {
            for (let i = 0; i < or.option4.length; i++) {
                or.option4[i].value = '';
            }
        } else if (or.textSelect['showTwoDate']) {
            or.option4 = [];
        } else {
            or.option4 = null;
        }
        or.option5 = null;
        or['textSelect'] = {
            "showInput": false,
            "showTwoInput": false,
            "showManyInput": false,
            "showCheckSelect": false,
            "showCheckcascader": false,
            "showDate": false,
            "showTwoDate": false,
            "showCascader": false
        }
        or['required'] = false;
        or['numErr'] = false;
        or["showDateOption"] = false;
        or["showElseOption"] = false;
        or["showindexOption"] = false;
        or["verificationAll"] = false;
        this.andArr['verificationAll'] = true;
        for (let i = 0; i < or.options.length; i++) {
            if (or.options[i].value == option) {
                if (or.options[i].metaAttributeType == 2) {
                    if (or.options[i].type == 3 || or.options[i].type == 4) {
                        or.showDateOption = true;
                    } else {
                        or.showElseOption = true;
                    }
                } else if (or.options[i].metaAttributeType == 3) {
                    or.showindexOption = true;
                } else {
                    console.log(or.options[i].metaAttributeType)
                }
            }
        }
        this.saveBtnStatus()
    }

    // 改变筛选条件
    selectChange(or: any, option: any) {
        this.isChange = true;
        or['required'] = false;
        or['numErr'] = false;
        or['textSelect'] = {
            "showInput": false,
            "showTwoInput": false,
            "showManyInput": false,
            "showCheckSelect": false,
            "showCheckcascader": false,
            "showDate": false,
            "showTwoDate": false,
            "showCascader": false
        }
        or['verificationAll'] = false;
        for (let i = 0; i < or.options.length; i++) {
            if (or.options[i].value == or.option2) {
                if (or.options[i].metaAttributeType == 2) {
                    if (or.options[i].type == 3 || or.options[i].type == 4) {
                        if (option == '在区间') {
                            or.option4 = [null, null];//多日期
                            or._dateRange = [null, null];
                            or.textSelect.showTwoDate = true;
                            or.type = 'twoDate';
                        } else if (option == 'in') {
                            or.textSelect.showCheckSelect = true;
                            or.type = 'checkSelect';
                            or.option4 = [];
                            or.option5 = [];
                        } else {
                            or.textSelect.showDate = true;
                            or.type = 'date';
                            or.option4 = '';
                            or._dateRange = [null, null];
                        }
                    } else if (or.options[i].isEnum == 1) {
                        if (option == '=' || option == '!=') {
                            or.option4 = '';//单选级联
                            or.option5 = [];
                            or.textSelect.showCascader = true;
                            or.type = 'cascader';
                        } else if (option == 'in') {
                            or.option4 = [];// 多选级联
                            or.option5 = [];
                            or.textSelect.showCheckcascader = true;
                            or.type = 'checkcascader';
                        }
                        this.queryData(or, or.options[i].parentName)
                    } else {
                        if (option == 'in') {
                            or.textSelect.showManyInput = true;
                            or.type = 'manyInput';
                            or.option4 = [];
                        } else {
                            or.textSelect.showInput = true;
                            or.type = 'input';
                            or.option4 = '';
                        }
                    }
                } else if (or.options[i].metaAttributeType == 3) {
                    if (option == '在区间') {
                        or.textSelect.showTwoInput = true;
                        or.option4 = [
                            { value: null, verificationAll: false },
                            { value: null, verificationAll: false }
                        ];
                        or.type = 'twoInput';
                    } else if (option == 'in') {
                        or.textSelect.showManyInput = true;
                        or.type = 'manyInput';
                        or.option4 = [];
                    } else {
                        or.textSelect.showInput = true;
                        or.type = 'input';
                        or.option4 = '';
                    }
                }
            }
        }
        this.saveBtnStatus()
    }
    /**
    * 获取URL
    * @param name 
    */
    getParamByName(name: string) {
        var search = document.location.href;
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    };
    //  查询数据字典
    queryData(or: any, parentName: any) {
        let globalData = DataStore.getGlobalData();
        let paramList = this.reportConfigService.globalParamList;
        let productid: any = [];
        let filterscondition: any = [];
        if (globalData && globalData["filter"] && globalData.filter.length > 0) {
            for (let k = 0; k < globalData["filter"].length; k++) {
                // if (globalData["filter"][k]["field"] == "product_id") {
                productid.push(this.getParamByName(globalData["filter"][k]["field"]) || globalData["filter"][k]["value"]);
                // }

            }
        } else {
            if (paramList && paramList["filter"]) {
                for (let k = 0; k < paramList.length; k++) {
                    // if (paramList[k]["name"] == "product_id") {
                    productid.push(this.getParamByName(paramList[k]["name"]) || null);
                    // }
                }
            } else {
                productid = [];
            }
        }
        if (globalData && globalData["filter"] && globalData.filter.length > 0) {
            filterscondition = [];
            for (let i = 0; i < globalData.filter.length; i++) {
                filterscondition.push({
                    "field": globalData["filter"][i]["field"],
                    "operator": globalData["filter"][i]["operator"],
                    "value": productid.length > 0 ? productid[i] : '',
                })
            }
        } else {
            filterscondition = [];
            for (let i = 0; i < paramList.length; i++) {
                filterscondition.push({
                    "field": paramList[i]["name"],
                    "operator": '=',
                    "value": productid.length > 0 ? productid[i] : '',
                })
            }
            for (let i = 0; i < productid.length; i++) {
                if (productid[i] == null) {
                    filterscondition.splice(i, 1)
                }
            }
        }

        this.dictObj = [
            {
                "cubeId": this.cubeId,
                "dimensions": [
                    {
                        "field": or.option2,
                    }
                ],
                "filters": [
                    {
                        "type": "or",
                        "condition": [
                            {
                                "field": parentName,
                                "operator": "=",
                                "value": "%%"
                            }
                        ]
                    },
                    {
                        "type": "and",
                        "condition": filterscondition
                    }
                ],
                "groupBy": [
                    {
                        "field": or.option2,
                    }
                ],
                "dictionary": true
            }
        ];
        // this.dictObj[0].filters[0].condition[0].value = data.option.id;
        or.dictObj = this.dictObj;
        this.reportConfigService.queryChartData(this.dictObj).then(res => {
            if (res && res['_body']) {
                let data = JSON.parse(res['_body']).data[0].data;
                if (data && data.length > 0) {
                    or.cityOption = []
                    for (let i = 0; i < data.length; i++) {
                        or.cityOption.push({
                            value: data[i].id,
                            label: data[i].dicItemValue,
                            isLeaf: true,
                            id: data[i].id
                        })
                    }
                }
            }
        }).catch(err => { });
    }

    // 级联数据字典
    async loadData(data: any, index: number): Promise<any> {
        let children: any = [];
        await that.loadDicData(data, children);
        if (children.length) {
            if (data.option) {
                data['option']['children'] = children;
            } else {
                data['children'] = children;
            }
        } else {
            if (data.option) {
                data['option']['isLeaf'] = true;
            } else {
                data['isLeaf'] = true;
            }
        }
    }
    //异步加载
    loadDicData(data: any, children: any[]): Promise<any> {
        if (data.option) {
            this.dictObj[0].filters[0].condition[0].value = data.option.id;
        } else {
            this.dictObj[0].filters[0].condition[0].value = data.id;
        }
        return new Promise((resolve, reject) => {
            this.reportConfigService.queryChartData(this.dictObj).then(res => {
                let dictData = JSON.parse(res['_body']).data[0].data;
                if (dictData && dictData.length > 0) {
                    for (let i = 0; i < dictData.length; i++) {
                        children.push({
                            value: dictData[i].id,
                            label: dictData[i].dicItemValue,
                            isLeaf: false,
                            id: dictData[i].id
                        })
                    }
                }
                resolve(children);
            }).catch(err => {
                // reject(err);
            });
        });
    }
    // 选中 多选级联级联数据
    checkcascader(or: any, value: any) {
        if (value && value.length > 0) {
            this.setCascade(or, value[0]);
        }
        let arr = [];
        if (value.length < 1) {
            for (var i = 0; i < value.length; i++) {
                arr.push(value[i].value);
            }
        } else {
            for (let i = 0; i < value.length; i++) {
                for (let j = 0; j < value[i].length; j++) {
                    arr.push(value[i][j].value);
                    if (value[i][j]['parent']) {
                        for (let k = 0; k < arr.length; k++) {
                            if (arr[k] == value[i][j]['parent'].value) {
                                arr.splice(k, 1);
                            }
                        }
                    }
                }
            }
        }
        if (arr.length == 0) {
            or['required'] = true;
            or['verificationAll'] = false;
        } else {
            or['required'] = false;
            or['verificationAll'] = true;
        }
        or.option4 = arr;
        this.saveBtnStatus();
    }

    //选中单选级联
    cascader(or: any, data: any) {
        if (data && data.length > 0) {
            this.setCascade(or, data);
        }
        let arr = [];
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                arr.push(data[i].value);
                if (data[i].parent) {
                    for (let j = 0; j < arr.length; j++) {
                        if (arr[j] == data[i].parent.value) {
                            arr.splice(j, 1)
                        }
                    }
                }
            }
        }
        if (data.length == 0) {
            or['required'] = true;
            or['verificationAll'] = false;
            or.option4 = "";
        } else {
            or['required'] = false;
            or['verificationAll'] = true;
            or.option4 = arr[0];
        }
        this.saveBtnStatus();
    }



    cascadeChild: any;
    cascadeArr: any[] = [];
    //判断级联关系
    setCascade(or: any, value: any) {
        if (or.options && or.options.length > 0) {
            for (let i = 0; i < or.options.length; i++) {
                if (or.options[i].value == or.option2 && or.options[i].parentName != "不级联") {
                    this.cascadeChild = or.options[i].parentName;
                }
            }
        }

        let arr = [];
        if (or.option3 == "=") {
            or.cascade = value[0].id;
        } else if (or.option3 == "!=") {
            or.cascade = value[0].id;
        } else if (or.option3 == "in") {
            for (let j = 0; j < value.length; j++) {
                arr.push(value[j].id);
            }
            or.cascade = arr;
        }

        if (this.cascadeArr) {
            let obj = {};
            let filters = {};
            filters['type'] = "or";
            filters['condition'] = [];
            let condition = this.OrItem(or.option2, or.option3, or.cascade);
            filters['condition'].push(condition);
            if (this.cascadeArr.length == 0) {
                obj['parentName'] = this.cascadeChild;
                obj['filters'] = filters;
                this.cascadeArr.push(obj);
            } else if (this.cascadeArr.length > 0) {
                for (let k = 0; k < this.cascadeArr.length; k++) {
                    if (this.cascadeArr[k]['parentName'] && this.cascadeArr[k]['parentName'].indexOf(this.cascadeChild) < 0) {
                        obj['parentName'] = this.cascadeChild;
                        obj['filters'] = filters;
                        this.cascadeArr.push(obj);
                    }
                }
            }
        }
        console.log(this.cascadeArr);
    }

    // 选中多选下拉
    selectedChange(or: any, value: any) {
        or.option4 = value;
        if (or.option4.length == 0) {
            or['required'] = true;
            or['verificationAll'] = false;
        } else {
            or['required'] = false;
            or['verificationAll'] = true;
        }
        this.saveBtnStatus();
    }

    // 改变字句数量
    changeField() {
        this.length = 0;
        for (let i = 0; i < this.andArr.length; i++) {
            this.length += this.andArr[i].orArr.length;
        }
    }

    // 验证格式
    verification(or: any, value: any, type: any, num: any) {
        or['required'] = false;
        or['numErr'] = false;
        or['verificationAll'] = false;
        let field = false;
        if (or.options) {
            for (let i = 0; i < or.options.length; i++) {
                if (or.options[i].value == or.option2) {
                    if (or.options[i].metaAttributeType == 3) {
                        field = true;
                    } else {
                        field = false;
                    }
                }
            }
        } else {
            field = true;
        }
        if (!value) {
            or['required'] = true;
            or['numErr'] = false;
            or['verificationAll'] = false;
        } else if (type == 'number' && field == true) {
            if (isNaN(Number(value))) {
                or['required'] = false;
                or['numErr'] = true;
                or['verificationAll'] = false;
            } else {
                or['required'] = false;
                or['numErr'] = false;
                or['verificationAll'] = true;
            }
        } else if (type == 'manyString' && field == true) {
            if (value.indexOf(",") == -1) {
                if (isNaN(Number(value))) {
                    or['required'] = false;
                    or['numErr'] = true;
                    or['verificationAll'] = false;
                } else if (num == 1) {
                    or['required'] = false;
                    or['numErr'] = false;
                    or['verificationAll'] = true;
                }
            } else {
                value = value.split(",")
                let err = true;
                for (let i = 0; i < value.length; i++) {
                    if (isNaN(Number(value[i]))) {
                        or['required'] = false;
                        or['numErr'] = true;
                        or['verificationAll'] = false;
                    } else {
                        or['required'] = false;
                        or['numErr'] = false;
                        or['verificationAll'] = true;
                    }
                }
            }
        } else {
            or['verificationAll'] = true;
        }
        if (type == 'manyString' && field == false && value) {
            if (value.indexOf("，") == -1) {
                value = value.split(",");
                or['symbolErr'] = false;
                or['verificationAll'] = true;
            } else {
                value = value.split("，");
                or['symbolErr'] = true;
                or['verificationAll'] = false;
            }
        }
        this.saveBtnStatus();
    }

    // 命名
    changeName(name: any) {
        let filter = DataStoreUtil.getFilterData(this.configApi.scope, this.cubeId);
        let NameArr = [];
        if (filter) {
            for (var key in filter) {
                NameArr.push(key);
            }
            if (this.updateName && this.update) {
                for (let i = 0; i < NameArr.length; i++) {
                    if (NameArr[i] == this.updateName) {
                        NameArr.splice(i, 1);
                    }
                }
            }
            for (let i = 0; i < NameArr.length; i++) {
                if (NameArr[i] == name) {
                    this.andArr['nameRepeat'] = true;
                    this.andArr['nameRequired'] = false;
                    return
                } else {
                    this.andArr['nameRepeat'] = false;
                }
            }
        }
        if (!name) {
            this.andArr['nameRequired'] = true;
        } else {
            this.andArr['nameRequired'] = false;
        }
        if (this.update == true) {
            this.disabled = false;
        }
    }

    /**
     * 保存按钮状态
     */
    saveBtnStatus() {
        let isSave = true;
        for (let i = 0; i < this.andArr.length; i++) {
            for (let j = 0; j < this.andArr[i].orArr.length; j++) {
                let orArr = this.andArr[i].orArr[j];
                if (orArr.textSelect.showTwoInput == true) {
                    let isVerif = true;
                    for (let k = 0; k < orArr.option4.length; k++) {
                        if (orArr.option4[k]['verificationAll'] == false) {
                            isVerif = false;
                        }
                    }
                    if (isVerif == true) {
                        orArr['verificationAll'] = true;
                    } else {
                        orArr['verificationAll'] = false;
                    }
                }
                if (this.andArr[i].orArr[j]['verificationAll'] == false) {
                    isSave = false;
                } else if (this.andArr['verificationAll'] == false) {
                    isSave = false;
                } else if (!this.andArr[i].orArr[j].option3) {
                    isSave = false;
                }
            }
        }
        if (isSave == true) {
            this.disabled = false;
        } else {
            this.disabled = true;
        }
    }

    // 过滤日期
    filterDate(or: any, date: any) {
        or['verificationAll'] = false;
        let option = null;
        if (date) {
            if (date.length > 1) {
                for (let i = 0; i < date.length; i++) {
                    option = [null, null];
                    if (date[0] !== null) {
                        option[0] = this.formatDate(date[0]);
                    }
                    if (date[1] !== null) {
                        option[1] = this.formatDate(Date.parse(date[1]) + (1000 * 60 * 60 * 24 - 1));
                    }
                }
            } else {
                option = this.formatDate(date);
            }
        }
        or.option4 = option;
        if (or.option4 == null || or.option4 == "") {
            or['required'] = true;
            or['verificationAll'] = false;
        } else if (date[0] === null && date[1] === null) {
            or['required'] = true;
            or['verificationAll'] = false;
        } else {
            or['required'] = false;
            or['verificationAll'] = true;
        }
        this.saveBtnStatus();
    }

    /**
     * 过滤器过滤数据
     * @param arr 过滤器数据
     */
    filterData(arr: any) {
        let filters = [];
        let temporary
        for (let i = 0; i < arr.length; i++) {
            let andItem = {};
            andItem['type'] = "or";
            andItem['condition'] = [];
            for (let j = 0; j < arr[i].orArr.length; j++) {
                if (arr[i].orArr[j].option1 == "包含") {
                    if (arr[i].orArr[j].type == "checkcascader" || arr[i].orArr[j].type == "cascader") {
                        let or = this.OrItem(arr[i].orArr[j].option2, arr[i].orArr[j].option3, arr[i].orArr[j].cascade);
                        andItem['condition'].push(or)
                    }
                } else {
                    let orItem = {};
                    orItem['type'] = "not";
                    orItem['condition'] = [];
                    if (arr[i].orArr[j].type == "checkcascader" || arr[i].orArr[j].type == "cascader") {
                        let or = this.OrItem(arr[i].orArr[j].option2, arr[i].orArr[j].option3, arr[i].orArr[j].cascade);
                        orItem['condition'].push(or)
                    }
                    andItem['condition'].push(orItem)
                }
            }
            filters.push(andItem)
        }
        return filters;
    }

    // 拼接or
    OrItem(field: any, operator: any, value: any) {
        let orItem = {
            "field": field,
            "operator": operator,
            "value": value
        };
        return orItem;
    }

    // 日期格式
    formatDate(time: any): any {
        let year, month, day, hours, minutes, seconds;
        if (time) {
            year = new Date(time).getFullYear()
            year = year < 10 ? "0" + year : year
            month = new Date(time).getMonth() + 1
            month = month < 10 ? "0" + month : month
            day = new Date(time).getDate()
            day = day < 10 ? "0" + day : day
            hours = new Date(time).getHours()
            hours = hours < 10 ? "0" + hours : hours
            minutes = new Date(time).getMinutes()
            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds = new Date(time).getSeconds()
            seconds = seconds < 10 ? "0" + seconds : seconds
            return `${year}-${month}-${day}`
        }
    }

    //深拷贝
    private deepCopy(data: any): any {
        let json = JSON.stringify(data);
        return JSON.parse(json);
    }
}

