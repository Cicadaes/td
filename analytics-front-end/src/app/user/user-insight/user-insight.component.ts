import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserInsightService } from './user-insight.service';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../common/config/page.size.config';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-user-insight',
  templateUrl: './user-insight.component.html',
  styles: [
    `
      ::ng-deep .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      ::ng-deep .vertical-center-modal .ant-modal {
        top: 0;
      }
    `
  ],
  styleUrls: ['./user-insight.component.less']
})
export class UserInsightComponent extends BaseComponent implements OnInit, OnChanges {
  searchList: any = []; // 查看用户数据的条件
  selectedValue: any; // 选择的绑定
  chartOption: any; // 图表数据
  chartOptionPie: any; // 环图数据
  chartType: any; // 选择的图表类型
  detailData: any = []; // 数据明细表格
  detailDataTableLoading = true; // 数据明细表格Loading
  parmas: any; // 查询数据明细数据参数
  moreSearchFlag = false; // 显示更多筛选
  isVisible = false; // 保存用户分群弹框flag
  // 分页数据
  _current = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 0; // 数据总量
  boolFilters: any;
  validateForm: FormGroup; // 保存用户分群弹框
  userTotal: any; // 用户总数
  loading = true; // loading动画
  obj_one: any;
  boolFiltersLength: any; // 筛选条件个数
  searchData = [];
  list: any = []; // 数据明细表格  (临时数据)

  pageSizeOptions: any[] = TABLE_PAGE_SIZE_OPTIONS; // Table页数选择器可选值

  constructor(private userInsightService: UserInsightService, private fb: FormBuilder, private injector: Injector) {
    super(injector);
    this.initRouterList('用户洞察');
  }

  ngOnInit() {
    // localStorage.removeItem('zw-one-user');
    this.boolFilters = [
      {
        operator: 'and',
        term: true,
        fieldName: null,
        eqType: null,
        value: null,
        value2: null
      }
    ];

    this.searchList = [
      {
        groupName: '总体',
        groupid: 1,
        list: [
          {
            displayname: '总体',
            esfieldname: 'all',
            value: '总体',
            name: '总体',
            id: 1
          }
        ]
      }
    ];

    this.selectedValue = '总体';

    this.parmas = {
      productId: this.productId,
      viewType: 1
    };
    this.searchData = JSON.parse(localStorage.getItem('userInsight')) || [];

    if (this.searchData.length > 0 && (this.searchData[0].value || this.searchData[0].value === 0)) {
      this.moreSearchFlag = true;
      for (let i = 0; i < this.searchData.length; i++) {
        if (this.searchData[i].displayType == 'Date') {
          if (this.searchData[i].eqType == 'between') {
            this.searchData[i].value[0] = this.timeFormat(this.searchData[i].value[0]);
            this.searchData[i].value[1] = this.timeFormat(this.searchData[i].value[1]);
          } else {
            this.searchData[i].value = this.timeFormat(this.searchData[i].value);
          }
          this.searchData[i].value2 = this.timeFormat(this.searchData[i].value2);
        }
      }
      this.boolFilters = this.searchData;
    }
    let UserInsightInto = localStorage.getItem('UserInsightInto') ? localStorage.getItem('UserInsightInto') : 'N';
    if (UserInsightInto == 'Y' && this.userInsightService.userInsight.attribute['name']) {
      this.selectedValue = this.userInsightService.userInsight.attribute['name'];
      if (this.userInsightService.userInsight.attribute['attributeCode']) {
        this.parmas.attributeCode = this.userInsightService.userInsight.attribute['attributeCode'];
        this.parmas.viewType = 2;
      }
    }
    localStorage.removeItem('UserInsightInto');
    this.validateForm = this.initialValidateForm();
    // this.chartType = 'line';

    this.updateParmas(this.parmas, this.boolFilters);
    this.getDetailData(this.parmas); // 查询表格和图表数据
    this.getAllArrtibute(); // 查询属性
    this.initEchart(); // 初始化三个图表
  }

  time(value: any) {
    const str = this.commonService.getDateStr(value);
    return str;
  }

  timeFormat(value: any) {
    const str = value ? new Date(value.substring(0, 10)) : null;
    return str;
  }

  // 根据选择的条件修改查询参数
  updateParmas(parmas: any, boolFilters: any) {
    const that = this;
    this.parmas['definition'] = null;
    if (
      boolFilters.length > 0 &&
      boolFilters[0].fieldName &&
      (boolFilters[0].value || boolFilters[0].value === 0) &&
      !(boolFilters[0].displayType == 'Tag' && (boolFilters[0].value == null || boolFilters[0].value.length == 0))
    ) {
      this.parmas['definition'] = {};
      this.parmas.definition['condition'] = {};
      this.parmas.definition['filters'] = [];
      this.parmas.definition.filters = [
        {
          condition: 'condition01',
          not: false,
          operator: ''
        }
      ];

      this.parmas.definition.condition['condition01'] = {
        indice: {
          type: 'attribute'
        },
        queryList: [
          {
            boolFilters: []
          }
        ]
      };

      const queryObj = [];
      boolFilters.map((item: any, index: any) => {
        const obj = {};
        if (item.eqType !== 'between') {
          if (item.displayType !== 'Date') {
            if (item.value || item.value === 0) {
              obj['must'] = {
                attributeCode: item.fieldName,
                attributeType: item.displayType,
                term: {
                  [item.eqType]: item.value
                }
              };
              if (boolFilters.length > 0 && index !== 0) {
                obj['operator'] = item.operator;
              }
            }
          } else {
            if (item.value instanceof Array) {
              item.value = item.value[0];
            }
            obj['must'] = {
              attributeCode: item.fieldName,
              attributeType: item.displayType,
              term: {
                [item.eqType]: that.time(item.value)
              }
            };
            if (boolFilters.length > 0 && index !== 0) {
              obj['operator'] = item.operator;
            }
          }
        } else {
          if (item.displayType !== 'Date') {
            if ((item.value || item.value === 0) && (item.value2 || item.value2 === 0)) {
              const arr = [];
              if (item.value > item.value2) {
                arr.push(item.value2);
                arr.push(item.value);
              } else {
                arr.push(item.value);
                arr.push(item.value2);
              }

              obj['must'] = {
                attributeCode: item.fieldName,
                attributeType: item.displayType,
                range: {
                  lte: arr[1],
                  gte: arr[0]
                }
              };

              if (boolFilters.length > 0 && index !== 0) {
                obj['operator'] = item.operator;
              }
            }
          } else {
            const arr = [];
            if (item.value[0] > item.value[1]) {
              arr.push(item.value[1]);
              arr.push(item.value[0]);
            } else {
              arr.push(item.value[0]);
              arr.push(item.value[1]);
            }
            obj['must'] = {
              attributeCode: item.fieldName,
              attributeType: item.displayType,
              range: {
                lte: that.time(arr[1]),
                gte: that.time(arr[0])
              }
            };

            if (boolFilters.length > 0 && index !== 0) {
              obj['operator'] = item.operator;
            }
          }
        }
        if (Object.keys(obj).length) {
          queryObj.push(obj);
        }
        this.parmas.definition.condition.condition01.queryList[0].boolFilters = queryObj;
      });
    }
  }

  // 初始化图标
  initEchart() {
    const that = this;
    this.chartOptionPie = {
      color: [
        '#2D8CF0',
        '#2DE2C5',
        '#FCC45F',
        '#FF8454',
        '#DB425A',
        '#34508C',
        '#5BB6FD',
        '#56D08B',
        '#B3E768',
        '#71808F'
      ],
      title: {
        subtext: '用户总数',
        x: 'center',
        y: '40%',
        textStyle: {
          fontWeight: 'normal',
          fontFamily: 'HelveticaNeue',
          fontSize: 35,
          color: '#1C2438'
        },
        subtextStyle: {
          fontWeight: 'normal',
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: '#495060'
        }
      },
      grid: {
        x: 'center',
        y: 'center'
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function(obj) {
          let valueStr = obj.value ? obj.value + '' : '';
          let valueNew = '';
          for (let i = valueStr.length - 1; i >= 0; i--) {
            let index = valueStr.length - i;
            if (index > 1 && index % 3 == 1) {
              valueNew += ',';
            }
            valueNew += valueStr[i];
          }

          let valueFinel = '';
          for (let j = valueNew.length - 1; j >= 0; j--) {
            valueFinel += valueNew[j];
          }

          if (that.list.length > 0) {
            for (let i = 0; i < that.list.length; i++) {
              if (that.list[i].name === obj.name) {
                obj.percent = that.list[i].percent;
              }
            }
          }

          return `${obj.name}: ${valueFinel} (${obj.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        y: 'center',
        right: 0,
        icon: 'rect',
        itemWidth: 10,
        itemHeight: 10,
        selectedMode: false,
        borderRadius: 5,
        formatter: function(params, a, b, c) {
          let percent;
          if (that.list.length > 0) {
            for (let i = 0; i < that.list.length; i++) {
              if (that.list[i].name === params) {
                percent = that.list[i].percent;
              }
            }

            // const arr = ['{b|' + params + '}' + '  ' + '{a|' + percent + '%}'];
            const arr = [`{b|${params}}  {a|${percent}%}`];
            return arr;
          }
        },
        textStyle: {
          rich: {
            a: {
              fontFamily: 'PingFangSC-Regular',
              fontSize: 12,
              color: '#495060'
            },
            b: {
              fontSize: 12,
              fontFamily: 'HelveticaNeue-Medium',
              color: '#495060'
            }
          }
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          legendHoverLink: true,
          label: {
            show: false
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    };
  }

  // 高级搜索组件的返回值
  attributeChange(value: any) {
    localStorage.removeItem('userInsight');
    this.boolFiltersLength = value.length;
    if (value.length < 1) {
      if (this.parmas.hasOwnProperty('definition')) {
        delete this.parmas.definition;
      }
      this.getDetailData(this.parmas);
      this.moreSearchFlag = false;
    }
    this.setSearchData();
    localStorage.setItem('userInsight', JSON.stringify(this.boolFilters));
  }

  // 高级搜索的查询
  queryDeatil() {
    let failure = false;
    let failureValue = false;
    // 检测所有属性检测项
    for (let k = 0; k < this.boolFilters.length; k++) {
      const boolFilter = this.boolFilters[k];
      if (!boolFilter.fieldName) {
        boolFilter.fieldNameCheckFailure = true;
        failure = true;
      }
      if (
        boolFilter.displayType === 'Tag' &&
        (boolFilter.value === null || (boolFilter.value && boolFilter.value.length === 0))
      ) {
        boolFilter.valueCheckFailure = true;
        failure = true;
      } else if (boolFilter.displayType === 'Date' && !boolFilter.value) {
        if (boolFilter.eqType === 'between') {
          if (!boolFilter.value || (boolFilter.value && boolFilter.value.length === 0)) {
            boolFilter.valueCheckFailure = true;
            failure = true;
          }
        } else {
          boolFilter.valueCheckFailure = true;
          failure = true;
        }
      } else if (
        boolFilter.displayType === 'integer' ||
        boolFilter.displayType === 'Integer' ||
        boolFilter.displayType === 'Double' ||
        boolFilter.displayType === 'String' ||
        boolFilter.displayType === 'Long'
      ) {
        if (
          boolFilter.eqType === 'between' &&
          (boolFilter.value2 === undefined || boolFilter.value2 === '' || boolFilter.value2 === null)
        ) {
          boolFilter.value2CheckFailure = true;
          failure = true;
        }
        if (boolFilter.value === undefined || boolFilter.value === '' || boolFilter.value === null) {
          boolFilter.valueCheckFailure = true;
          failure = true;
        }
        if (
          boolFilter.eqType === 'between' &&
          (boolFilter.value || boolFilter.value == 0) &&
          (boolFilter.value2 || boolFilter.value2 == 0)
        ) {
          if (boolFilter.value > boolFilter.value2) {
            boolFilter.valueCheckFailure = true;
            boolFilter.value2CheckFailure = true;
            failureValue = true;
          } else {
            boolFilter.valueCheckFailure = false;
            boolFilter.value2CheckFailure = false;
          }
        }
      }
    }

    if (failure) {
      this.message.create('error', '请为空白项输入值');
    } else if (failureValue) {
      this.message.create('error', '起始值应不大于结束值');
    } else {
      this.loading = true;
      this.updateParmas(this.parmas, this.boolFilters);
      this.getDetailData(this.parmas);
      // this.userInsightService.userInsight['userInsight'] = this.boolFilters;
      this.setSearchData();
      localStorage.setItem('userInsight', JSON.stringify(this.boolFilters));
    }
  }

  // 查询属性接口  下拉数据  type为Tag的
  getAllArrtibute() {
    this.userInsightService.getAllArrtibute().subscribe((response: any) => {
      const dataTmp = [];
      const groupMap = {};
      if (response && response.data && response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          const one = response.data[i];
          if (!one.groupid) {
            continue;
          }
          let groupObj = groupMap[one.groupid];
          if (!groupObj) {
            groupObj = {
              groupid: one.groupid,
              groupName: one.groupName,
              list: []
            };
            groupMap[one.groupid] = groupObj;
            dataTmp.push(groupObj);
          }
          if (one['displayType'] === 'Tag') {
            one['name'] = one.displayname;
            one['value'] = one.displayname;
            groupObj.list.push(one);
          }
        }
      }
      dataTmp.forEach((one: any) => {
        if (one && one.list && one.list.length > 0) {
          this.searchList.push(one);
        }
      });
    });
  }

  // 初始化表单
  initialValidateForm() {
    return this.fb.group({
      name: [
        null,
        [Validators.required, Validators.maxLength(50), this.replaceName, this.checkName],
        this.checkNameRepeat
      ] // 画像组名称
    });
  }

  // 校验人群名称是否重复
  checkNameRepeat = async (control: FormControl): Promise<any> => {
    let nameRepeat = false;
    const controlV = control.value;
    return await new Promise((resolve: any, reject: any) => {
      const obj = {
        productId: Number(this.productId),
        statuss: '1,2',
        cname: controlV
      };
      this.userInsightService.checkCrowdName(obj).subscribe((response: any) => {
        if (response && response.data && response.data.rows && response.data.rows.length > 0) {
          nameRepeat = true;
        } else {
          nameRepeat = false;
        }
        resolve(nameRepeat ? { nameRepeat: { value: control.value } } : null);
      });
    });
  };

  checkName = (control: FormControl): { [key: string]: any } => {
    let flag = false;
    if (control.value === null) {
      return null;
    }

    if (control.value === '') {
      return null;
    }
    if (control.value.length > 50) {
      return null;
    }

    const temp = /^[A-Za-z0-9\u4e00-\u9fa5\-_]+$/;
    if (!temp.test(control.value)) {
      flag = true;
    }
    return flag ? { auto: { value: control.value } } : null;
  };

  replaceName = (control: FormControl): { [key: string]: any } => {
    let nameNull = false;
    if (control.value === null) {
      return null;
    }

    if (control.value === '') {
      return null;
    }
    const controlV = control.value ? control.value.replace(/\s+/g, '') : '';
    if (this.validateForm && controlV.length > 0) {
      nameNull = false;
      return nameNull ? { nameNull: { value: controlV } } : null;
    } else if (this.validateForm && controlV.length === 0) {
      nameNull = true;
      return nameNull ? { nameNull: { value: controlV } } : null;
    }
  };

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  // 表单验证
  submitForm() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        // this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  // 保存
  save() {
    const _that = this;
    this.submitForm();
    if (!this.validateForm.controls.name.value) {
      return;
    }

    if (this.validateForm.invalid) {
      return;
    }

    const params = {
      crowd: {}
    };
    params.crowd['name'] = this.validateForm.get('name').value.replace(/\s+/g, '');
    params.crowd['productId'] = Number(this.productId);
    params.crowd['source'] = 'IC';
    if (this.obj_one.hasOwnProperty('definition')) {
      params['definition'] = this.obj_one.definition;
    }

    this.userInsightService.insertCrowdName(params).subscribe((response: any) => {
      if (response && response.code === 200) {
        _that.message.create('success', '保存用户分群成功！');
      }
      this.isVisible = false;
      this.globals.resetBodyStyle();
      this.validateForm.reset();
    });
  }

  //  取消
  handleCancel = e => {
    this.isVisible = false;
    this.globals.resetBodyStyle();
    this.validateForm.reset();
  };

  // select 选择框
  search(value: any) {
    this.detailDataTableLoading = true;
    this.loading = true;
    if (this.selectedValue === '总体') {
      this.parmas.viewType = 1;
      if (this.parmas.hasOwnProperty('attributeCode')) {
        delete this.parmas.attributeCode;
      }
      this.userInsightService.userInsight.attribute['name'] = this.selectedValue;
      this.userInsightService.userInsight.attribute['attributeCode'] = '';
    } else {
      this.searchList.map(item => {
        item.list.map(one => {
          if (value === one.displayname) {
            this.parmas.viewType = 2;
            this.parmas.attributeCode = one.fieldName || one.esfieldname;
            this.userInsightService.userInsight.attribute['name'] = this.selectedValue;
            this.userInsightService.userInsight.attribute['attributeCode'] = one.fieldName || one.esfieldname;
          }
        });
      });
    }

    this.updateParmas(this.parmas, this.boolFilters);
    if (
      !(
        this.boolFilters.length > 0 &&
        this.boolFilters[0].fieldName &&
        (this.boolFilters[0].value || this.boolFilters[0].value === 0)
      )
    ) {
      if (this.parmas.hasOwnProperty('definition')) {
        delete this.parmas.definition;
      }
    }
    this.getDetailData(this.parmas);
    localStorage.setItem('UserInsightInto', 'N');
  }

  // 更多筛选
  moreSearch() {
    localStorage.removeItem('userInsight');
    this.moreSearchFlag = !this.moreSearchFlag;
    // if (this.boolFilters.length < 1) {
    this.boolFilters = [
      {
        operator: 'and',
        term: true,
        fieldName: null,
        eqType: null,
        value: null,
        value2: null
      }
    ];
    // this.searchData= this.boolFilters;
    this.updateParmas(this.parmas, this.boolFilters);
    if (!this.moreSearchFlag) {
      this.getDetailData(this.parmas); // 查询表格和图表数据
    }
    this.setSearchData();
    localStorage.setItem('userInsight', JSON.stringify(this.boolFilters));
    // }
  }

  // 数据明细列表  图标展示
  getDetailData(parmas: any) {
    this.loading = true;
    this.detailDataTableLoading = true;
    this.detailData = [];
    this.userInsightService.getPortrait(parmas).subscribe((response: any) => {
      this.loading = false;
      this.detailDataTableLoading = false;
      this.detailData = [];
      this.userTotal = 0;
      this.chartOptionPie.legend['data'] = [];
      this.chartOptionPie.series[0]['data'] = [];

      response.data.data.map((item: any, index: any) => {
        this.userTotal = Number(this.userTotal) + Number(item.value);
        this.detailData.push({
          key: item.key,
          value: item.value,
          name: item.name
        });

        this.list.push({
          key: item.key,
          value: item.value,
          name: item.name,
          percent: item.percentage
        });
        if (index <= 9) {
          this.chartOptionPie.legend.data.push(item.name);
          this.chartOptionPie.series[0].data.push({
            value: item.value,
            name: item.name
          });
        }
      });
      this._total = response.data.data.length;
      this.chartOptionPie.title['text'] = this.userTotal.toLocaleString();
      this.chartOptionPie = Object.assign({}, this.chartOptionPie);
    });
    localStorage.setItem('userInsight', JSON.stringify(this.boolFilters));
  }

  // 改变每页数量
  PageSizeChange(e: any) {
    this.detailDataTableLoading = true;
    this.parmas.rows = this._pageSize;
  }

  // 改变页码
  PageIndexChange(e: number) {
    this.detailData = [];
    if (this._current === e) {
      this.parmas.page = e;
      this.detailDataTableLoading = true;
    } else {
      this._current = e;
    }
  }

  setSearchData(key?: any) {
    let obj = {};
    obj = this.parmas;
    if (
      this.boolFilters.length > 0 &&
      this.boolFilters[0].fieldName &&
      (this.boolFilters[0].value || this.boolFilters[0].value === 0) &&
      this.parmas.definition
    ) {
      const one = {
        operator: 'and'
      };
      if (this.boolFilters.length > 0) {
        one['boolFilters'] = [{}];
        if (this.boolFilters.length > 1) {
          one['boolFilters'][0]['operator'] = 'and';
        }
      }

      if (this.selectedValue !== '总体' && key) {
        one['boolFilters'][0]['must'] = {
          attributeCode: this.parmas.attributeCode,
          term: {
            eq: key
          }
        };
        obj['definition'].condition.condition01.queryList.push(one);
      }
    } else {
      if (this.selectedValue !== '总体') {
        obj['definition'] = {};
        obj['definition']['condition'] = {};
        obj['definition']['filters'] = [];
        obj['definition'].filters = [
          {
            condition: 'condition01',
            not: false,
            operator: ''
          }
        ];

        obj['definition'].condition['condition01'] = {
          indice: {
            type: 'attribute'
          },
          queryList: [
            {
              boolFilters: [
                {
                  must: {
                    attributeCode: this.parmas.attributeCode,
                    term: {
                      eq: key
                    }
                  }
                }
              ]
            }
          ]
        };
      }
    }

    //  this.userInsightService.userInsight['userInsight'] = this.boolFilters;
    // localStorage.setItem("userInsight",JSON.stringify(this.boolFilters));
    //        if (obj['definition']) {
    this.userInsightService.userInsightParmas = obj;
    this.userInsightService.userListParmas = obj;
    //       }
    this.userInsightService.userInsight['userList'] = [];
  }

  // 用户列表详情页
  detail(item: any, event: Event) {
    this.setSearchData(item.key);
    localStorage.removeItem('userList');
    this.goInto({
      name: '用户列表',
      url: '/user/user-insight/list',
      params: {
        id: this.productId
      }
    });
  }

  // 保存用户分群
  configReport(item: any, event: Event) {
    this.isVisible = true;
    let obj = {};
    obj = this.parmas;
    if (
      this.boolFilters.length > 0 &&
      this.boolFilters[0].fieldName &&
      (this.boolFilters[0].value || this.boolFilters[0].value === 0) &&
      this.parmas.definition
    ) {
      const one = {
        operator: 'and'
      };
      if (this.boolFilters.length > 0) {
        one['boolFilters'] = [{}];
        one['boolFilters'][0]['operator'] = 'and';
      }

      if (this.selectedValue !== '总体') {
        one['boolFilters'][0]['must'] = {
          attributeCode: this.parmas.attributeCode,
          term: {
            eq: item.key
          }
        };
        obj['definition'].condition.condition01.queryList.push(one);
      }
    } else {
      if (this.selectedValue !== '总体') {
        obj['definition'] = {};
        obj['definition']['condition'] = {};
        obj['definition']['filters'] = [];
        obj['definition'].filters = [
          {
            condition: 'condition01',
            not: false,
            operator: ''
          }
        ];

        obj['definition'].condition['condition01'] = {
          indice: {
            type: 'attribute'
          },
          queryList: [
            {
              boolFilters: [
                {
                  must: {
                    attributeCode: this.parmas.attributeCode,
                    term: {
                      eq: item.key
                    }
                  }
                }
              ]
            }
          ]
        };
      }
    }
    this.obj_one = obj;
    event.stopPropagation();
  }
}
