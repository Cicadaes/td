import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, Injector } from '@angular/core';
import { CrowdCreateService } from '../crowd-create.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-attribute-builder',
  templateUrl: './attribute-builder.component.html',
  styleUrls: ['./attribute-builder.component.less']
})
export class AttributeBuilderComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() boolFilters: Array<any>; // 表单条目（必填）
  @Input() hideAndOr: any = false; // 隐藏并且或者（人群构建行为属性使用）
  @Input() hideAddBtn: any = false; // 表单条目为0时，隐藏添加属性按钮
  @Input() hideButton: any = false; // 表单条目为1且隐藏添加属性按钮
  @Input() maxCount: any; // 属性限制最大条数
  @Input() types?: any; // type类型
  @Input() eventAttr: any = false; // 是否是事件详情的筛选调用
  @Input() useListGroup: any = true; // 属性列表按分组显示（不分组时，用于外部传入属性列表时用）
  @Input() defaultAttrList: any = false; // 是否自动查询属性备选列表
  @Output() attributeChange = new EventEmitter<any>(); // 回调事件
  @Output() valueChange = new EventEmitter<any>(); // 回调事件，用于检测json是否有变化
  // this.onChange.emit(this.boolFilters);

  @Input() metaAttributeList: Array<any> = []; // 属性备选列表
  isLoading: boolean; //懒加载loading
  page: number = 1; //懒加载默认页数
  tmpDict: any; //懒加载暂存数据
  _temDict: any = []; //返现暂存数据
  crowdId: any; //对应数据ID
  btnFlag = true;

  displayMap: any = {};

  constructor(private crowdCreateService: CrowdCreateService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    if (this.defaultAttrList) {
      this.isLoading = true;
      this.page = 1;
      this.crowdCreateService.metaAttributeList().subscribe((response: any) => {
        const dataTmp = [];
        const groupMap = {};
        for (let i = 0; i < response.data.length; i++) {
          const obj = response.data[i];
          if (!obj.groupid) {
            continue;
          }
          let groupObj = groupMap[obj.groupid];
          if (!groupObj) {
            groupObj = {
              groupid: obj.groupid,
              groupName: obj.groupName,
              list: []
            };
            groupMap[obj.groupid] = groupObj;
            dataTmp.push(groupObj);
          }

          groupObj.list.push({
            name: obj.displayname,
            value: obj.esfieldname,
            displayType: obj.displayType
          });

          this.displayMap[obj.esfieldname] = obj.displayType;
        }
        this.metaAttributeList = dataTmp;
        if (this.eventAttr && !this.boolFilters[0].fieldName) {
          this.boolFilters[0].fieldName = dataTmp[0] && dataTmp[0].list[0] ? dataTmp[0].list[0].value : '';
        }

        //编辑时加载字典
        for (let i = 0; i < this.boolFilters.length; i++) {
          let attr = this.boolFilters[i];
          attr.displayType = this.displayMap[attr.fieldName];
          if (attr.displayType === 'Tag') {
            this.onSearch(attr, '', false, 1);
          }
        }
      });
    }
  }
  /***
   * 返现查询
   */
  onSearchId() {
    // 判断是否为编辑功能
    return new Promise((resolve, reject) => {
      const id = this.route.snapshot.params['id'];
      if (id && id !== 'null' && id !== 'undefined') {
        this.crowdId = Number(id);
      }
      if (this.crowdId) {
        this._temDict = [];
        this.crowdCreateService.queryCrowd(this.crowdId).subscribe(
          (response: any) => {
            if (response && response.code == '200' && response.data.definition && response.data.definition.condition) {
              let _key = response.data.definition.condition;
              for (let key in _key) {
                if (_key[key]) {
                  _key[key].queryList.forEach((element: any) => {
                    element.boolFilters.forEach((conts: any) => {
                      this._temDict = this._temDict.concat(conts.must.term.eq);
                    });
                  });
                }
              }
            }
            resolve();
          },
          () => {
            reject();
          }
        );
      } else {
        resolve();
      }
    });
  }
  /**
   * 下拉框到底部懒加载
   * @param data
   */
  scrollToBottom(data: any) {
    if (this.isLoading) {
      this.page = this.page + 1;
      this.onSearch(data, '', true, this.page);
    }
  }
  async onSearch(attr: any, searchValue: any, paging: boolean = false, page: number = 1, conts?: any) {
    await this.onSearchId();
    if (searchValue) {
      this.page = 1;
    }
    this.crowdCreateService._queryDict2(attr.fieldName, searchValue, page, this._temDict).subscribe(resp => {
      const tmpList = resp['list'][0];
      const sum = resp['list'][1]['total'];
      if (!paging) {
        this.tmpDict = [];
      }
      if (sum) {
        if (tmpList && tmpList.length > 0) {
          let _tmpDict: any = [];
          for (let i = 0; i < tmpList.length; i++) {
            const obj = tmpList[i];
            _tmpDict.push({
              dicItemKey: obj.id,
              dicItemValue: obj.dicItemValue
            });
          }
          this.tmpDict = [...this.tmpDict, ..._tmpDict];
        }
        attr.prop1ValueList = this.tmpDict;
        if (attr.prop1ValueList.length < sum) {
          this.isLoading = true;
        } else {
          this.isLoading = false;
        }
      } else if (conts == 'search') {
        attr.prop1ValueList = [];
        this.isLoading = false;
      } else if (page == 1 && conts !== 'search') {
        this.isLoading = true;
        attr.prop1ValueList = [];
      } else {
        this.isLoading = false;
      }
    });
  }
  /**
   * 数组对象去重（根据属性）
   * @param arr
   * @param name
   */
  arrUniqueByAttr(arr, name) {
    const hash = {};
    return arr.reduce((item, next) => {
      if (!hash[next[name]]) {
        hash[next[name]] = true && item.push(next);
      }
      return item;
    }, []);
  }

  changeOperator(condition) {
    if (condition.operator === 'and') {
      condition.operator = 'or';
    } else {
      condition.operator = 'and';
    }
    this.valueChange.emit();
  }

  changeAttribute(attr) {
    attr.displayType = this.displayMap[attr.fieldName];
    attr.eqType = attr.displayType === 'String' ? 'like' : 'eq';
    attr.value = null;
    attr.value2 = null;
    if (attr.displayType === 'Tag') {
      this.page = 1;
      this.onSearch(attr, '', false);
    }
    this.valueChange.emit();
    attr['fieldNameCheckFailure'] = false;
  }

  removeItem(list, index) {
    list.splice(index, 1);
    if (this.maxCount && list.length < this.maxCount) {
      this.btnFlag = true;
    }
    if (this.types !== 'behavior') {
      if (this.boolFilters && this.boolFilters[0]) {
        this.boolFilters[0].operator = '';
      }
    }

    localStorage.setItem('userList', JSON.stringify(this.boolFilters));
    this.attributeChange.emit(this.boolFilters);
    this.valueChange.emit();
  }

  addItem(list, type) {
    if (this.maxCount && list.length >= this.maxCount) {
      return;
    }
    let operTmp = this.hideAndOr ? 'and' : ''; //人群场景时，默认值为and
    if (list.length > 0) {
      operTmp = 'and';
    }
    if (type === 'prop') {
      list.push({
        operator: operTmp,
        term: true,
        fieldName: null,
        eqType: 'eq',
        value: null,
        value2: null
      });
    }

    if (this.maxCount && list.length >= this.maxCount) {
      this.btnFlag = false;
    }

    this.attributeChange.emit(this.boolFilters);
    this.valueChange.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['metaAttributeList'] && changes['metaAttributeList'].firstChange === false) {
      const displayList = changes['metaAttributeList'].currentValue;
      for (let i = 0; i < displayList.length; i++) {
        const obj = displayList[i];
        this.displayMap[obj.value] = obj.displayType;
      }
      for (let i = 0; i < this.boolFilters.length; i++) {
        const attr = this.boolFilters[i];
        attr.displayType = this.displayMap[attr.fieldName];

        if (attr.displayType === 'Tag') {
          this.onSearch(attr, '');
        }
      }
    }
  }

  logChange(obj?, field?) {
    this.valueChange.emit();
    if (obj && typeof obj === 'object' && field) {
      obj[field + 'CheckFailure'] = false;
    }
  }

  logChangeOperator(obj?, field?) {
    if (obj && obj.displayType === 'Date') {
      obj[field] = null;
      this.valueChange.emit();
    }
  }
}
