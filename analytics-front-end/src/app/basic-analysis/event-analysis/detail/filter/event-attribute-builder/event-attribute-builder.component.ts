import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { EventAnalysisDetailService } from '../../event-analysis-detail.service';

@Component({
  selector: 'app-event-attribute-builder',
  templateUrl: './event-attribute-builder.component.html',
  styleUrls: ['./event-attribute-builder.component.less']
})
export class EventAttributeBuilderComponent implements OnInit, OnChanges {
  @Input() query: any; // 表单条目（必填）
  @Input() hideAndOr: any = false; // 隐藏并且或者（人群构建行为属性使用）
  @Input() hideAddBtn: any = false; // 表单条目为0时，隐藏添加属性按钮
  @Input() maxCount: any; // 属性限制最大条数
  @Input() eventId: any; //事件Id
  @Input() types?: any; // type类型
  @Input() useListGroup: any = true; // 属性列表按分组显示（不分组时，用于外部传入属性列表时用）
  @Input() defaultAttrList: any = false; // 是否自动查询属性备选列表
  @Output() attributeChange = new EventEmitter<any>(); // 回调事件
  @Output() valueChange = new EventEmitter<any>(); // 回调事件，用于检测json是否有变化
  @Input() metaAttributeList: Array<any> = []; // 属性备选列表

  btnFlag = true;
  displayMap: any = {};
  verLineHeight: any = '60px';

  constructor(private EventAnalysisDetailService: EventAnalysisDetailService) {}

  ngOnInit() {
    if (this.eventId) {
      this.EventAnalysisDetailService.metaAttributeList(this.eventId).subscribe((response: any) => {
        if (response.success) {
          let dataTmp = [];
          for (let i in response.list) {
            let groupMap = [];
            if (response.list[i] && response.list[i].length > 0) {
              for (let j = 0; j < response.list[i].length; j++) {
                const obj = response.list[i][j];
                let groupObj = {
                  name: obj.displayname,
                  value: obj.esfieldname,
                  displayType: obj.displayType
                };
                this.displayMap[obj.esfieldname] = obj.displayType;
                groupMap.push(groupObj);
              }
            }
            dataTmp.push({ groupName: i, list: groupMap });
          }
          this.metaAttributeList = dataTmp;
          if (!this.query.boolFilters[0].fieldName) {
            this.query.boolFilters[0].fieldName = dataTmp[0] && dataTmp[0].list[0] ? dataTmp[0].list[0].value : '';
          }
          if (this.query.boolFilters[0].displayType == 'tag') {
            this.onSearch(this.query.boolFilters[0], '');
          }
          this.operatorMove();
          //编辑时加载字典
          for (let i = 0; i < this.query.boolFilters.length; i++) {
            let attr = this.query.boolFilters[i];
            attr.displayType = this.displayMap[attr.fieldName];

            if (attr.displayType === 'Tag') {
              this.onSearch(attr, '');
            }
          }
        }
      });
    }
  }

  onSearch(attr: any, searchValue: any) {
    this.EventAnalysisDetailService.queryDict2(attr.fieldName, searchValue).subscribe(resp => {
      //修改接口返回参数变更
      resp = {
        data: resp['data']['list']
      };
      const tmpList = resp['data'];
      const tmpDict = [];
      if (tmpList && tmpList.length > 0) {
        for (let i = 0; i < tmpList.length; i++) {
          const obj = tmpList[i];
          tmpDict.push({
            dicItemKey: obj.id,
            dicItemValue: obj.dicItemValue
          });
        }
      }
      attr.prop1ValueList = tmpDict;
      this.valueChange.emit();
    });
  }

  changeOperator() {
    if (this.query.operator === 'and') {
      this.query.operator = 'or';
    } else {
      this.query.operator = 'and';
    }
    this.valueChange.emit();
  }

  changeAttribute(attr: any) {
    attr.displayType = this.displayMap[attr.fieldName];
    attr.eqType = attr.displayType === 'String' ? 'like' : 'eq';
    attr.value = null;
    attr.value2 = null;
    if (attr.displayType === 'Tag') {
      this.onSearch(attr, '');
    }
    this.valueChange.emit();
    attr['fieldNameCheckFailure'] = false;
  }

  removeItem(list: any, index: any) {
    list.splice(index, 1);
    if (this.maxCount && list.length < this.maxCount) {
      this.btnFlag = true;
    }
    this.operatorMove();
    this.attributeChange.emit(this.query.boolFilters);
    this.valueChange.emit();
  }

  addItem(list: any, type: any) {
    if (this.maxCount && list.length >= this.maxCount) {
      return;
    }
    const attrlist = this.metaAttributeList;
    if (type === 'prop') {
      list.push({
        term: true,
        fieldName: attrlist[0] && attrlist[0].list[0] ? attrlist[0].list[0].value : '',
        eqType: 'eq',
        value: null,
        value2: null
      });
    }
    this.changeAttribute(list[list.length - 1]);
    if (this.maxCount && list.length >= this.maxCount) {
      this.btnFlag = false;
    }
    this.operatorMove();
    this.attributeChange.emit(this.query.boolFilters);
    this.valueChange.emit();
  }

  operatorMove() {
    let translateY = 8;
    let lineHeight = 50;
    if (this.query.boolFilters.length > 1) {
      for (let i = 0; i < this.query.boolFilters.length - 1; i++) {
        translateY += 25;
      }
    }
    lineHeight += translateY;
    this.verLineHeight = `${lineHeight}px`;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['metaAttributeList'] && changes['metaAttributeList'].firstChange === false) {
      const displayList = changes['metaAttributeList'].currentValue;
      for (let i = 0; i < displayList.length; i++) {
        const obj = displayList[i];
        this.displayMap[obj.value] = obj.displayType;
      }
      for (let i = 0; i < this.query.boolFilters.length; i++) {
        const attr = this.query.boolFilters[i];
        attr.displayType = this.displayMap[attr.fieldName];

        if (attr.displayType === 'Tag') {
          this.onSearch(attr, '');
        }
      }
    }
  }

  logChange(obj?: any, field?: any) {
    this.valueChange.emit();
    if (obj && typeof obj === 'object' && field) {
      obj[field + 'CheckFailure'] = false;
    }
  }

  logChangeOperator(obj?: any, field?: any) {
    if (obj && obj.displayType === 'Date') {
      obj[field] = null;
      this.valueChange.emit();
    }
  }
}
