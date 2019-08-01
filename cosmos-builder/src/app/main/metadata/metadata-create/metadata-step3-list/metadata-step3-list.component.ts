import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetadataCreateService } from '../metadata-create.service';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MetadataService } from '../../metadata-list/metadata-list.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { MetadataStep3ListService } from './metadata-step3-list.service'

interface AppState {
    metadata: any;
}

@Component({
    selector: 'metadata-step3-list',
    templateUrl: './metadata-step3-list.component.html',
    styleUrls: ['./metadata-step3-list.component.less']
})
export class MetadataStep3ListComponent implements OnInit, OnDestroy {
    inputValue: string;
    _checked: boolean = true;
    isEnumchecked: boolean = false;
    pageSizeSelectorValues: any[] = [10, 20, 50, 100];
    parentListObj: any[] = [];
    dataDic: any;
    step3ListValidator = {
        requiredError: {
            show: false,
            info: '请至少添加一条映射的属性'
        },
        attributeError: {
            show: false,
            info: '属性名称不能为空'
        },
        physicalError: {
            show: false,
            info: '物理字段名称不能为空'
        },
        cubeError: {
            show: false,
            info: '类型至少有一个为指标类型'
        },
        eventError: {
            show: false,
            info: '类型至少有一个为时间类型'
        },
        nameError: {
            show: false,
            info: '属性名称已存在，请修改'
        },
        physicalNameError: {
            show: false,
            info: '物理字段名称已存在，请修改'
        },
        dicError: {
            show: false,
            info: '数据字典不能为空'
        },
        parentNameError: {
            show: false,
            info: '级联属性不能为空'
        },
        topParentNameError: {
            show: false,
            info: ''
        }
    }

    //下拉菜单的
    options: any = [];
    selectedOption: number;
    physicalMetaObjectAttributeTable: any[] = [];
    metaAttributeTypeCube: any[] = [];//CUBE类型
    metaAttributeTypeNotCube: any[] = [];//非CUBE类型
    physicalMetaAttributeType: any[] = [];//es  cube 的物理字段类型
    metaObjectType: number;
    metadata$: any;
    isRestApi: boolean = false;
    currentStepSubscribe: any;
    metadataObjSubscribe: any;
    stepSubscribe: any;
    pageIndex: number = 1;
    pageSize: number = 10;
    dataSourceType: string;//数据源类型
    addAttr: boolean = false;

    op = [
        {
            label: "string",
            value: "string"
        },
        {
            label: "double",
            value: "double"
        }
    ]

    constructor(
        private store: Store<AppState>,
        private metadataCreateService: MetadataCreateService,
        private metadataService: MetadataService,
        private _notification: CmNotificationService,
        private router: Router,
        private metadataStep3ListService: MetadataStep3ListService
    ) {

        this.isRestApi = (metadataCreateService._metadataStep1Obj['type'] == "RESTAPI" || (metadataCreateService.metadataObj && metadataCreateService.metadataObj['dataSourceType'] == "RESTAPI")) ? true : false;
        this.metaAttributeTypeCube = this.metadataCreateService.dictionaryData['metaAttributeTypeCube'];
        this.metaAttributeTypeNotCube = this.metadataCreateService.dictionaryData['metaAttributeTypeNotCube'];
        this.physicalMetaAttributeType = this.metadataCreateService.dictionaryData['physicalMetaAttributeType'];

        //获取数据字典
        this.getDictionay();

        this.dataSourceType = this.metadataCreateService._metadataStep1Obj['type'] || (metadataCreateService.metadataObj && metadataCreateService.metadataObj['dataSourceType']);

        if (this.metadataCreateService._metadataStep3Obj['attributes'] && this.metadataCreateService._metadataStep3Obj['attributes'].length > 0) {
            this.physicalMetaObjectAttributeTable = this.metadataCreateService._metadataStep3Obj['attributes'];
            this.pageIndex = metadataCreateService._metadataStepInfo['step3']['pageIndex'];
            this.pageSize = metadataCreateService._metadataStepInfo['step3']['pageSize'];
        }

        //监听元数据对象类型
        this.metadataObjSubscribe = this.metadataCreateService.missionMetaObjectType$.subscribe((metaObjectType: any) => {
            this.resetValidator();
            this.metaObjectType = metaObjectType;
            this.selectedOption = (this.metaObjectType == 1 && this.dataSourceType !== "SPARK") ? 3 : 1;

            if (metadataCreateService.metadataObjId) {
                if (this.isRestApi && metadataCreateService.metadataObj["attributes"]["parameter"] && !metadataCreateService.metadataObj["attributes"]["parameter"][0]["physicalMetaAttributeType"]) {
                    this.physicalMetaObjectAttributeTable = this.handlerData(metadataCreateService.metadataObj["attributes"]);
                } else
                    if (!metadataCreateService.metadataObj["attributes"][0]["physicalMetaAttributeType"]) {//如果修改后获取的属性不对，就重新编辑下数据（获取新的属性需要重新构建一下）
                        this.physicalMetaObjectAttributeTable = this.handlerData(metadataCreateService.metadataObj["attributes"]);
                    } else {
                        // this.physicalMetaObjectAttributeTable = metadataCreateService.metadataObj["attributes"];
                        this.physicalMetaObjectAttributeTable = this.compareNewData(metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable'], metadataCreateService.metadataObj["attributes"]);
                        console.log("this.physicalMetaObjectAttributeTable=====>>>", this.physicalMetaObjectAttributeTable);
                        if (metadataCreateService.hadModify || metadataCreateService.metadataObj["metaObjectType"] != metaObjectType) {
                            this.initAttributeType();
                        }
                    }
                metadataCreateService.metadataObj["metaObjectType"] = metaObjectType;
            } else {
                if (!metadataCreateService._metadataStep3Obj['metaObjectType'] || this.physicalMetaObjectAttributeTable.length == 0) {
                    this.metadataCreateService._metadataStep3Obj['metaObjectType'] = metaObjectType;
                    this.physicalMetaObjectAttributeTable = this.handlerData(metadataCreateService._metadataStep2Obj['physicalMetaObjectAttributeTable']);
                } else {
                    this.physicalMetaObjectAttributeTable = metadataCreateService._metadataStep3Obj['attributes'];
                    this.initAttributeType();
                }

            }
            metadataCreateService._metadataStep3Obj['attributes'] = this.physicalMetaObjectAttributeTable;
            this.getParentListObj();

            this._checked = this.checkIsAllChecked('isLogic');
            this.isEnumchecked = this.checkIsAllChecked('isEnum');
        })


        this.metadata$ = store.select('metadata');
        this.currentStepSubscribe = this.metadata$.subscribe((data: any) => {
            if (data.action == "step3InfoIsTrue") {
                //验证
                if (!this.checkHasLogicAttribute()) {
                    this.step3ListValidator.requiredError['show'] = true;
                    return;
                } else if (this.checkHasLogicAttribute() && this.checkLogicAttributeIsNull()) {
                    this.step3ListValidator.attributeError['show'] = true;
                    return;
                }  else if (this.checkHasLogicAttribute() && !this.checkLogicAttributeIsNull() && this.checkLogicPhysicalAttributeIsNull()) {
                    this.step3ListValidator.physicalError['show'] = true;
                    return;
                }else if (this.checkHasLogicAttribute() && !this.checkLogicAttributeIsNull() && !this.checkTypeIsValid()) {
                    if (this.metaObjectType == 1) {
                        this.step3ListValidator.cubeError['show'] = true;
                        return;
                    }
                    if (this.metaObjectType == 2) {
                        this.step3ListValidator.eventError['show'] = true;
                        return;
                    }
                } else if (this.checkHasLogicAttribute()
                    && !this.checkLogicAttributeIsNull()
                    && this.checkTypeIsValid()
                    && this.checkDicAndParent('dictionaryId')) {
                    this.step3ListValidator.dicError['show'] = true;
                } else if (this.checkHasLogicAttribute()
                    && !this.checkLogicAttributeIsNull()
                    && this.checkTypeIsValid()
                    && !this.checkDicAndParent('dictionaryId')
                    && this.checkDicAndParent('parentName')) {
                    this.step3ListValidator.parentNameError['show'] = true;
                } else if (this.checkHasLogicAttribute()
                    && !this.checkLogicAttributeIsNull()
                    && this.checkTypeIsValid()
                    && !this.checkDicAndParent('dictionaryId')
                    && !this.checkDicAndParent('parentName')
                    && !this.checkHasTopParent()) {
                    this.step3ListValidator.topParentNameError['show'] = true;
                } else if (!metadataCreateService.hasSaved) {
                    if (!metadataCreateService.metadataObjId) {
                        let params = JSON.parse(JSON.stringify(metadataCreateService._metadataStep3Obj));
                        params['attributes'].forEach((item:any) => {
                            if(item['isAdd']){
                                delete item['isAdd'];
                            }
                        });
                        this.metadataService.create(params).then(res => {
                            if (res.success) {
                                metadataCreateService.hasSaved = true;
                                this._notification.success(res.msg, '', metadataCreateService.msg['notification']['success']);
                                setTimeout(() => {
                                    this.router.navigateByUrl('main/metadata');
                                }, 1000);
                            } else {
                                this._notification.error(res.msg, '', metadataCreateService.msg['notification']['error']);
                            }

                        }).catch(err => {
                            this._notification.error("错误", err);
                        });
                    } else {
                        metadataCreateService._metadataStep3Obj["id"] = metadataCreateService.metadataObjId;
                        this.metadataService.update(metadataCreateService._metadataStep3Obj).then(res => {
                            if (res && res._body) {
                                res = JSON.parse(res._body);
                            }
                            if (res.success) {
                                metadataCreateService.hasSaved = true;
                                this._notification.success(res.msg, '', metadataCreateService.msg['notification']['success']);
                                setTimeout(() => {
                                    this.router.navigate(['main/metadata/detail', metadataCreateService.metadataObjId]);
                                }, 1000);
                            } else {
                                this._notification.error(res.msg, '', metadataCreateService.msg['notification']['error']);
                            }

                        }).catch(err => {
                            this._notification.error("错误", err);
                        });
                    }

                }

            }
        });

        //监听step
        this.stepSubscribe = metadataCreateService.missionCurrentStep$.subscribe((step: any) => {
            if (step == 2 || step == -1) {
                metadataCreateService._metadataStep3Obj['attributes'] = this.physicalMetaObjectAttributeTable;
                metadataCreateService._metadataStepInfo['step3']['pageIndex'] = this.pageIndex;
                metadataCreateService._metadataStepInfo['step3']['pageSize'] = this.pageSize;
            }
        })

    }


    ngOnInit() {
    }

    /**
     * 比较新老数据
     * @param newData 属性表最新数据
     * @param beforData 之前保存的数据
     */
    compareNewData(newData: any[], beforData: any[]) {
        let newDataTrans = this.handlerData(newData);
        let arr = [];
        for (let i = 0; i < newDataTrans.length; i++) {
            for (let j = 0; j < beforData.length; j++) {
                if (newDataTrans[i]["physicalMetaAttributeName"] == beforData[j]["physicalMetaAttributeName"]) {
                    arr.push(beforData[j]);
                    break;
                }
            }
            if (arr.length == i) {
                arr.push(newDataTrans[i]);
            }
        }
        return arr;
    }

    //处理数据
    handlerData(data: any) {
        let attr = [{}];
        if (data) {
            if (!this.isRestApi) {
                let len = data.length;
                for (let i = 0; i < len; i++) {
                    attr[i] = {
                        "metaAttributeName": data[i]['columnName'],
                        "metaAttributeType": this.matchMetaAttributeType(data[i]['columnType']),
                        "metaAttributeDescription": data[i]['columnDescription'] || '',
                        "isLogic": 1,
                        "physicalMetaAttributeName": data[i]['columnName'],
                        "physicalMetaAttributeType": data[i]['columnType'],
                        "physicalMetaAttributeDescripte": data[i]['columnDescription'],
                        "isEnum": 0,
                        "dictionaryId": null,
                        "parentName": null,
                    }
                    if (this.metaObjectType == 1) {
                        attr[i]['type'] = this.matchMetaAttributeType(data[i]['columnType']);
                        switch (this.matchMetaAttributeType(data[i]['columnType'])) {
                            case 2:
                                attr[i]['type'] = 1;
                                break;
                            case 3:
                                attr[i]['type'] = 5;
                                break;
                            default:
                                attr[i]['type'] = 1;
                                break;
                        }
                    }
                }
            } else {
                let len = data.parameter.length;
                for (let i = 0; i < len; i++) {
                    let aggregators = data.parameter[i]['aggregators'];
                    let interval = data.parameter[i]['interval'];

                    attr[i] = {
                        "metaAttributeName": data.parameter[i]['name'],
                        "metaAttributeType": this.matchMetaAttributeType(data.parameter[i]['type']),
                        "metaAttributeDescription": '',
                        "isLogic": 1,
                        "physicalMetaAttributeName": data.parameter[i]['name'],
                        "physicalMetaAttributeType": data.parameter[i]['type'],
                        "physicalMetaAttributeDescripte": '',
                        "isInput": data.parameter[i]['isInput'],
                        "aggregators": aggregators ? aggregators.join('、') : null,
                        "interval": interval ? interval.join('、') : null,
                        "isEnum": 0,
                        "dictionaryId": null,
                        "parentName": null
                    };
                    if (this.metaObjectType == 1) {
                        attr[i]['type'] = this.matchMetaAttributeType(data.parameter[i]['type']);
                        switch (this.matchMetaAttributeType(data.parameter[i]['type'])) {
                            case 2:
                                attr[i]['type'] = 1;
                                break;
                            case 3:
                                attr[i]['type'] = 5;
                                break;
                            default:
                                attr[i]['type'] = 1;
                                break;
                        }
                    }
                }
            }
        }

        return attr;
    }

    /**
     * 初始化属性的属性类型
     */
    initAttributeType() {
        for (let i = 0; i < this.physicalMetaObjectAttributeTable.length; i++) {
            this.physicalMetaObjectAttributeTable[i]["metaAttributeType"] = this.matchMetaAttributeType(this.physicalMetaObjectAttributeTable[i]["physicalMetaAttributeType"]);
        }
    }

    //匹配物理字段类型
    matchMetaAttributeType(type: any) {
        let attrType: number;
        if (this.metaObjectType == 1) {
            let typeList: any[];
            if (this.dataSourceType == "JDBC" || this.dataSourceType == "SPARK") {
                typeList = "int、bit、tinyint、smallint、integer、bigint、float、double、numeric、decimal".split('、');
            } else if (this.dataSourceType == "ELASTICSEARCH") {
                typeList = "text、keyword、long、integer、short、byte、double、float、half_float、scaled_float、date、boolean、binary".split('、');
            } else if (this.dataSourceType == "RESTAPI") {
                typeList = "int、long、double".split('、');
            }
            attrType = typeList.indexOf(type.toLocaleLowerCase()) >= 0 ? 3 : 2;
        } else {
            attrType = 1;
        }
        return attrType;
    }

    //获取数据字典
    getDictionay() {
        this.metadataStep3ListService.getDictionary().then((data: any) => {
            this.dataDic = data['data'];
        }).catch((err: any) => {
            this._notification.error('错误', err);
        })
    }

    //获取级联对象
    getParentListObj() {
        this.parentListObj = [];
        let data = this.physicalMetaObjectAttributeTable;
        let len = data.length;
        for (let i = 0; i < len; i++) {
            let parentList = this.getParentList(data[i])
            this.parentListObj.push(parentList);
        }
    }

    //获取级联列表
    getParentList(attr: any) {
        let parentList: any[] = [{ 'name': '不级联', 'dictionaryId': -1 }];
        let data = this.physicalMetaObjectAttributeTable;
        let len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i]['isLogic'] && data[i]['isEnum'] && attr['metaAttributeName'] != data[i]['metaAttributeName'] && data[i]['dictionaryId']) {
                parentList.push({
                    name: data[i]['metaAttributeName'],
                    dictionaryId: data[i]['dictionaryId']
                })
            }
        }
        return parentList;
    }

    //切换数据字典
    dictionaryIdChange(data: any, index: number) {
        if (data) {
            data['parentName'] = null;
            setTimeout(() => {
                //更新级联对象
                this.getParentListObj();
            }, 0);

            //重置验证
            this.resetValidator();
        }

    }

    //切换级联属性
    parentNameChange(data: any, index: number) {
        if (data) {
            //重置验证
            this.resetValidator();
        }
    }

    //更新级联值
    updateParentName(data: any, index: any) {
        if (data) {
            let obj = this.parentListObj[index];
            let len = obj.length;
            data['parentName'] = '不级联';
            for (let i = 0; i < len; i++) {
                if (obj[i]['dictionaryId'] == data['dictionaryId']) {
                    data['parentName'] = obj[i]['name'];
                    break;
                }
            }
        }

    }

    //点击全选枚举
    isEnumAllChange(_checked: boolean) {
        let start = (this.pageIndex - 1) * this.pageSize;
        let len = this.physicalMetaObjectAttributeTable.length;
        let end = this.pageIndex < Math.ceil(len / this.pageSize) ? this.pageIndex * this.pageSize : len;
        for (let i = start; i < end; i++) {
            let physicalMetaObjectAttributeItem = this.physicalMetaObjectAttributeTable[i];
            physicalMetaObjectAttributeItem['isEnum'] = _checked ? 1 : 0;
            if (!physicalMetaObjectAttributeItem['isEnum']) {
                physicalMetaObjectAttributeItem['parentName'] = null;
                physicalMetaObjectAttributeItem['dictionaryId'] = null;
            }
        }

        this.resetValidator();
    }

    //点击枚举
    isEnumChange(attrObj: Object) {
        if (attrObj) {
            this.isEnumchecked = this.checkIsAllChecked('isEnum');
            attrObj['isEnum'] = attrObj['isEnum'] ? 1 : 0;
            this.getParentListObj();
            attrObj['parentName'] = null;
            attrObj['dictionaryId'] = null;
            this.resetValidator();
        }

    }

    //检查是否全选中
    checkIsAllChecked(type: string) {
        let start = (this.pageIndex - 1) * this.pageSize;
        let len = this.physicalMetaObjectAttributeTable.length;
        let end = this.pageIndex < Math.ceil(len / this.pageSize) ? this.pageIndex * this.pageSize : len;
        let isAllChecked = true;
        // let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = start; i < end; i++) {
            let physicalMetaObjectAttributeItem = this.physicalMetaObjectAttributeTable[i];
            if (!physicalMetaObjectAttributeItem[type]) {
                isAllChecked = false;
                break;
            }
        }
        return isAllChecked;

    }

    //点击全选映射
    logicAllChange(_checked: boolean) {
        let start = (this.pageIndex - 1) * this.pageSize;
        let len = this.physicalMetaObjectAttributeTable.length;
        let end = this.pageIndex < Math.ceil(len / this.pageSize) ? this.pageIndex * this.pageSize : len;
        for (let i = start; i < end; i++) {
            let physicalMetaObjectAttributeItem = this.physicalMetaObjectAttributeTable[i];
            physicalMetaObjectAttributeItem['isLogic'] = _checked ? 1 : 0;
        }
        //重置验证
        this.resetValidator();
    }

    //点击映射
    logicChange(attrObj: Object) {
        this._checked = this.checkIsAllChecked('isLogic');
        attrObj['isLogic'] = attrObj['isLogic'] ? 1 : 0;
        //重置验证
        this.resetValidator();
    }


    //验证类型
    checkTypeIsValid() {
        let isValid = false;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (attrTable['isLogic'] && (attrTable['metaAttributeName'].trim()).length > 0) {
                if (this.metaObjectType == 1 && attrTable['metaAttributeType'] == 3) {
                    //CUBE类 && 指标
                    isValid = true;
                    break;
                } else if (this.metaObjectType == 2 && (attrTable['metaAttributeType'] == 3 || attrTable['metaAttributeType'] == 4)) {
                    // 事件类 && 时间
                    isValid = true;
                    break;
                } else if (this.metaObjectType == 3) {
                    //属性类
                    isValid = true;
                    break;
                }
            }

        }
        return isValid;
    }

    //验证是否至少有一条映射属性
    checkHasLogicAttribute() {
        let isValid = false;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (attrTable['isLogic']) {
                isValid = true;
                break;
            }
        }
        return isValid;
    }

    //验证映射属性名称是否为空
    checkLogicAttributeIsNull() {
        let isNull = false;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (attrTable['isLogic'] && (attrTable['metaAttributeName'].trim()).length <= 0) {
                isNull = true;
                break;
            }
        }
        return isNull;
    }

      //验证映射物理字段名称是否为空
      checkLogicPhysicalAttributeIsNull() {
        let isNull = false;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (attrTable['isLogic'] && (attrTable['physicalMetaAttributeName'].trim()).length <= 0) {
                isNull = true;
                break;
            }
        }
        return isNull;
    }

    //验证枚举，数据字典或者级联不为空
    checkDicAndParent(type: string) {
        let isNull = false;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (attrTable['isEnum'] && !attrTable[type]) {
                isNull = true;
                break;
            }
        }
        return isNull;
    }

    //验证某一个选择的数据字典中，级联中必须有一个是不级联
    checkHasTopParent() {

        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {

            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (attrTable['parentName'] && attrTable['dictionaryId']) {
                let info = {
                    name: '',
                    valid: false
                }
                for (let j = 0; j < len; j++) {
                    let obj = this.physicalMetaObjectAttributeTable[j];
                    if (attrTable['dictionaryId'] == obj['dictionaryId'] && obj['parentName'] == '不级联') {
                        info['valid'] = true;
                        break;
                    }
                }
                if (!info.valid) {
                    let name = this.getNameByDictionaryId(attrTable['dictionaryId']);
                    this.step3ListValidator['topParentNameError']['info'] = `为保证后续应用正常，请从关联数据字典${name}的属性中选择一个，将其级联属性设置为“不级联”`

                    return false;
                }
            }

        }
        return true;

    }

    //通过id获取字典名字
    getNameByDictionaryId(id: number) {
        let name = '';
        let len = this.dataDic.length;
        for (let i = 0; i < len; i++) {
            let dic = this.dataDic[i];
            if (dic['id'] == id) {
                name = dic['name'];
                break;
            }
        }
        return name;
    }

    //验证属性名称不能重复
    checkAttributeNameRepeat(data: any) {
        let isValid = true;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (data['metaAttributeName'] && attrTable['metaAttributeName'] == data['metaAttributeName'] && attrTable['physicalMetaAttributeName'] != data['physicalMetaAttributeName']) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }

    metaAttributeNameBlur(data: any) {
        if (!this.checkAttributeNameRepeat(data)) {
            data['metaAttributeName'] = '';
            this.step3ListValidator['nameError']['show'] = true;
        }

        this.getParentListObj();
    }

    checkPhysicalAttributeNameRepeat(data: any) {
        let isValid = true;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let attrTable = this.physicalMetaObjectAttributeTable[i];
            if (data['metaAttributeName'] && attrTable['metaAttributeName'] != data['metaAttributeName'] && data['physicalMetaAttributeName'] && attrTable['physicalMetaAttributeName'] == data['physicalMetaAttributeName']) {
                isValid = false;
                break;
            }
        }
        return isValid;
    }
    physicalMetaAttributeNameBlur(data:any){
        if (!this.checkPhysicalAttributeNameRepeat(data)) {
            data['physicalMetaAttributeName'] = '';
            this.step3ListValidator['physicalNameError']['show'] = true;
        }

    }

    //重置验证信息
    resetValidator() {
        for (let key in this.step3ListValidator) {
            this.step3ListValidator[key]['show'] = false;
        }
    }

    pageIndexChange(index: number) {
        // this.pageIndex = index;
        this._checked = this.checkIsAllChecked('isLogic');
        this.isEnumchecked = this.checkIsAllChecked('isEnum');
    }

    /**
     * 添加属性
     */
    addAttribute() {
        // this.pageIndex =  Math.ceil((this.physicalMetaObjectAttributeTable.length+1) / this.pageSize)
        this.addAttr = true;
        let newAttr = [{
            "metaAttributeName": '',
            "metaAttributeType": this.metaAttributeTypeCube[0]['value'],
            "metaAttributeDescription": '',
            "isLogic": 1,
            "physicalMetaAttributeName": '',
            "physicalMetaAttributeType": this.physicalMetaAttributeType[0]['value'],
            "physicalMetaAttributeDescripte": '',
            "isEnum": 0,
            "dictionaryId": '',
            "parentName": '',
            "type": 1,
            "isAdd": true
        }];
        this.physicalMetaObjectAttributeTable = this.physicalMetaObjectAttributeTable.concat(newAttr);

        setTimeout(() => {
            this.pageIndex =  Math.ceil(this.physicalMetaObjectAttributeTable.length / this.pageSize)
        }, 100);
       
    }

    /**
     * 删除属性
     */
    removeAttribute(index: any) {
        this.physicalMetaObjectAttributeTable.splice(index, 1);
        this.pageIndex =  Math.ceil(this.physicalMetaObjectAttributeTable.length / this.pageSize)
        this.physicalMetaObjectAttributeTable = JSON.parse(JSON.stringify(this.physicalMetaObjectAttributeTable));
        this.addAttr = this.checkAddAttribute();
        this.getParentListObj();
    }

    /**
     * 检查是否有添加的属性
     */
    checkAddAttribute() {
        let hasAttr: boolean = false;
        let len = this.physicalMetaObjectAttributeTable.length;
        for (let i = 0; i < len; i++) {
            let item = this.physicalMetaObjectAttributeTable[i];
            if (item.hasOwnProperty('isAdd')) {
                hasAttr = true;
                break;
            }

        }
        return hasAttr;
    }

    ngOnDestroy() {
        this.currentStepSubscribe.unsubscribe();
        this.metadataObjSubscribe.unsubscribe();
        this.stepSubscribe.unsubscribe();
        this.metadataCreateService.hadModify = false;
    }
}