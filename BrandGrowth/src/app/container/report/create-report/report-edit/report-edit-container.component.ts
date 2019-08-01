import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

const _ = require('lodash');
const moment = require('moment');

import { Observable } from 'rxjs/Observable';

// import Services
import { DictSourceService } from '../../../../services/source/dict.source.service';
import { ReportModelService } from '../../../../services/model/report.model.service';
import { ReportSourceService } from '../../../../services/source/report.source.service';
import { AdcampSourceService } from '../../../../services/source/adcamp.source.service';
import { IndicatorsSourceService } from '../../../../services/source/indicators.source.service';

@Component({
  selector: 'app-report-edit-container',
  templateUrl: './report-edit-container.component.html',
  styleUrls: ['./report-edit-container.component.less'],
  providers: [DictSourceService, ReportSourceService, AdcampSourceService, IndicatorsSourceService]
})
export class ReportEditContainerComponent implements OnInit {
  validateForm: FormGroup;

  timeDimension = [
    { label: 'Total', value: 'total' },
    { label: 'By day', value: 'byday' },
  ];

  peopleDimension = [
    { label: 'ALL', value: 'total' },
    { label: '目标人群', value: 'targetPeople' },
  ];

  deviceDimension = [
    { label: '设备类型', value: 'deviceType' },
    { label: '操作系统', value: 'osVersion' },
    { label: '联网方式', value: 'network' },
  ];

  areasDimension: any = [
    { label: '城市', value: 'city' },
    { label: '省市', value: 'province' },
  ];

  metricOptions = [
    { isSelect: false, title: '曝光', code: 'impression_pv', indeterminate: false },
    { isSelect: false, title: '独立曝光', code: 'impression_uv', indeterminate: false },
    { isSelect: false, title: '点击', code: 'click_pv', indeterminate: false },
    { isSelect: false, title: '独立点击', code: 'click_uv', indeterminate: false },
    { isSelect: false, title: '异常曝光', code: 'impression_anti', indeterminate: false },
    { isSelect: false, title: '异常点击', code: 'click_anti', indeterminate: false },
    { isSelect: false, title: '异常IP曝光', code: 'click_anti_ip', indeterminate: false },
    { isSelect: false, title: '异常设备曝光', code: 'impression_anti_device', indeterminate: false },
    { isSelect: false, title: '异常设备点击', code: 'click_anti_device', indeterminate: false },
  ];

  searchValue: string = '';              // 搜索活动
  selectedChannelNum: number = 0;        // 已选媒体数量
  selectedMonitorNum: number = 0;        // 已选监测连接数目
  isEdit: boolean = false;               // 是否处于编辑状态
  id: any;                               // id
  name: any;                             // name

  monitorList: any = [];

  constructor(private router: Router, 
    private dictSourceService: DictSourceService,
    private reportModel: ReportModelService,
    private fb: FormBuilder,
    private reportSourceService: ReportSourceService,
    private adcampSourceService: AdcampSourceService,
    private indicatorsSourceService: IndicatorsSourceService,
    private cdRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.determineEditState();
    if (this.isEdit) {
      this.getDataForUrl();
    }
    this.initialValidateForm();
    if (!this.reportModel.reportType) {
      this.backUp();
      return;
    }

    // this.getRegionList();
  }

  /**
   * 初始化表单
   */
  initialValidateForm(): void {
    if (this.isEdit) {
      this.timeDimension = this.parsedCheckboxControlValue(this.reportModel.timeDimension, this.timeDimension);
      this.peopleDimension = this.parsedCheckboxControlValue(this.reportModel.peopleDimension, this.peopleDimension);
      this.deviceDimension = this.parsedCheckboxControlValue(this.reportModel.deviceDimension, this.deviceDimension);
      this.metricOptions = this.parsedSelectPaneControlValue(this.reportModel.metric, this.metricOptions);
      this.validateForm = this.fb.group({
        exportName:      [this.reportModel.exportName],                            // 报告名称
        timeRange:       [[this.reportModel.startTime, this.reportModel.endTime]], // 时间范围
        timeDimension:   [this.timeDimension],                                     // 时间维度
        peopleDimension: [this.peopleDimension],                                   // 人群维度
        deviceDimension: [this.deviceDimension],                                   // 设备维度
        regionDimension: [this.reportModel.regionDimension],                       // 地域维度
        metric:          [this.metricOptions],                                     // 指标选择
      });
      this.getMonitorList();
    } else {
      this.validateForm = this.fb.group({
        exportName:      [null, [ Validators.required ]],              // 报告名称
        timeRange:       [null, [ Validators.required ]],              // 时间范围
        timeDimension:   [this.timeDimension],                         // 时间维度
        peopleDimension: [this.peopleDimension],                       // 人群维度
        deviceDimension: [this.deviceDimension],                       // 设备维度
        regionDimension: [null],                                       // 地域维度
        metric:          [this.metricOptions],                         // 指标选择
      });
    }
  }

  nextStep() {
    // 将所有的表单控件都变成已修改状态
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[ i ].markAsDirty();
    }
    // 检查表单是否有效
    if (this.validateForm.invalid) return;

    // 获取exportName
    if (this.validateForm.get('exportName').value) {
      this.reportModel.exportName = this.validateForm.get('exportName').value;
    }

    // 获取startTime和endTime
    if (this.validateForm.get('timeRange').value) {
      this.reportModel.startTime = moment(this.validateForm.get('timeRange').value[0]).format('YYYY-MM-DD');
      this.reportModel.endTime = moment(this.validateForm.get('timeRange').value[1]).format('YYYY-MM-DD');
    }

    // 获取monitorLinks
    this.reportModel.monitorLinks = '';
    this.monitorList.forEach((monitor: any) => {
      this.validateForm.get('monitorLinks' + monitor.index).value.forEach((item: any) => {
        item.children.forEach((it: any) => {
          if (it.isSelect) {
            this.reportModel.monitorLinks += it.code + ",";
          }
        });
      });
    });
    if (this.reportModel.monitorLinks && this.reportModel.monitorLinks[this.reportModel.monitorLinks.length-1] === ',') {
      this.reportModel.monitorLinks = this.reportModel.monitorLinks.slice(0, -1);
    }

    // 获取timeDimension
    if (this.validateForm.get('timeDimension').value && this.jointCheckboxControlValue(this.validateForm.get('timeDimension').value)) {
      this.reportModel.timeDimension = this.jointCheckboxControlValue(this.validateForm.get('timeDimension').value);
    }

    // 获取peopleDimension
    if (this.validateForm.get('peopleDimension').value && this.jointCheckboxControlValue(this.validateForm.get('peopleDimension').value)) {
      this.reportModel.peopleDimension = this.jointCheckboxControlValue(this.validateForm.get('peopleDimension').value);
    }

    // 获取deviceDimension
    if (this.validateForm.get('deviceDimension').value && this.jointCheckboxControlValue(this.validateForm.get('deviceDimension').value)) {
      this.reportModel.deviceDimension = this.jointCheckboxControlValue(this.validateForm.get('deviceDimension').value);
    }

    // 获取regionDimension
    if (this.validateForm.get('regionDimension').value) {
      this.reportModel.regionDimension = this.validateForm.get('regionDimension').value + '';
    }

    // 获取指标
    if (this.reportModel.reportType === 10) {
      this.reportModel.metric = '';
      this.validateForm.get('metric').value.forEach((item: any) => {
        if (item.isSelect) {
          this.reportModel.metric += item.code + ",";
        }
      });
      if (this.reportModel.metric && this.reportModel.metric[this.reportModel.metric.length-1] === ',') {
        this.reportModel.metric = this.reportModel.metric.slice(0, -1);
      }
    }

    if (this.isEdit) {
      let params = this.reportModel;
      params['id'] = this.id;
      // 编辑营销报告
      this.reportSourceService.updateMarketReport(params).then((data: any) => {
        if (data && data.code == 200) {
          this.router.navigate(['/report']);
        }
      });
    } else {
      // 新建营销报告
      this.reportSourceService.insertMarketReport(this.reportModel).then((data: any) => {
        if (data && data.code == 200) {
          this.router.navigate(['/report']);
        }
      });
    }
  }

  backUp() {
    if (this.isEdit) {
      this.router.navigate(['/report/edit/select-type', this.name, this.id, this.reportModel]);
    } else {
      this.router.navigate(['/report/create/select-type', '新建报告']);
    }
  }

  /**
   * 获取地域列表
   */
  getRegionList() {
    this.dictSourceService.getRegionList().then((data: any) => {
      if (data && data.result) {
        this.areasDimension = data.result.map((item: any) => {
          return { label: item.city, value: item.currCode }
        });
        this.areasDimension = _.cloneDeep(this.areasDimension);
      }
    })
  }

  getFormControl(name: any) {
    return this.validateForm.controls[ name ];
  }

  jointCheckboxControlValue(options: any) {
    let str = '';
    options.forEach((op: any) => {
      if (op.checked) {
        str += op.value + ',';
      }
    });
    if (str[str.length - 1] === ',') {
      str = str.slice(0, -1);
    }
    return str;
  }

  parsedCheckboxControlValue(str: string, options: any) {
    let arrTmp = str.split(',');
    arrTmp.forEach((item: any) => {
      options.forEach((option: any) => {
        if (item === option.value) {
          option['checked'] = true;
        }
      });
    });
    return options;
  }

  parsedSelectPaneControlValue(str: string, options: any) {
    let arrTmp = str.split(',');
    arrTmp.forEach((item: any) => {
      options.forEach((option: any) => {
        if (item == option.code) {
          option.isSelect = true;
        }
      });
    });
    
    return options;
  }

  getMonitorList() {
    this.adcampSourceService.getActivityList().then((data: any) => {
      if (data.code == 200 && data.result) {
        let activityList = data.result;
        activityList.forEach((act: any, index: number) => {
          if (index > 10) return;
          let param = {
            metrics: ['impression_pv'],
            dimension: 'monitor',
            conditions: {
              activityKey: act.activityKey,
              start: moment(this.validateForm.get('timeRange').value[0]).format('YYYY-MM-DD'),
              end: moment(this.validateForm.get('timeRange').value[1]).format('YYYY-MM-DD')
            },
            detail: true,
          };
          this.indicatorsSourceService.queryMetricData(param).then((metricData: any) => {
            if (metricData.code == 200 && metricData.result && metricData.result.length !== 0) {
              let list = metricData.result;
              let options: any = [];
              list.forEach((monitor: any) => {
                options.push({
                  isSelect: false,
                  title: monitor.channelName,
                  code: '无所谓',
                  indeterminate: false,
                  children: []
                });
              });
              options = _.uniqBy(options, (item: any) => {
                return item.title;
              });
              list.forEach((monitor: any) => {
                options.forEach((op: any) => {
                  if (monitor.channelName === op.title) {
                    op.children.push({
                      isSelect: false,
                      title: monitor.monitorName,
                      code: monitor.monitorLinkId,
                    });
                  }
                });
              });

              this.monitorList.push({
                activityName: act.name,
                options,
                index,
                show: true
              });

              if (this.isEdit) {
                options.forEach((option: any) => {
                  option.children = this.parsedSelectPaneControlValue(this.reportModel.monitorLinks, option.children);
                });
              }

              this.validateForm.addControl('monitorLinks' + index, new FormControl(options));
              this.monitorList = _.cloneDeep(this.monitorList);
            }
          });
        });
        
      };
    });
  }

  operateSelectedNum() {
    this.selectedChannelNum = 0;
    this.selectedMonitorNum = 0;
    this.monitorList.forEach((monitor: any) => {
      this.validateForm.get('monitorLinks' + monitor.index).value.forEach((item: any) => {
        if (item.isSelect || item.indeterminate) {
          this.selectedChannelNum ++;
        }
        item.children.forEach((it: any) => {
          if (it.isSelect) {
            this.selectedMonitorNum ++;
          }
        });
      });
    });
  }

  determineEditState() {
    let urlStr = this.router.url;
    let urlPaths = urlStr.split('/');
    if (urlPaths[2] === 'edit') {
      this.isEdit = true;
    }
  }

  getDataForUrl() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.name = params.get('name');
      this.reportModel.exportName = params.get('exportName');
      this.reportModel.startTime = params.get('startTime');
      this.reportModel.endTime = params.get('endTime');
      this.reportModel.monitorLinks = params.get('monitorLinks');
      this.reportModel.metric = params.get('metric');
      this.reportModel.reportType = Number(params.get('reportType')).valueOf();
      this.reportModel.timeDimension = params.get('timeDimension');
      this.reportModel.peopleDimension = params.get('peopleDimension');
      this.reportModel.deviceDimension = params.get('deviceDimension');
      this.reportModel.regionDimension = params.get('regionDimension');
    });
  }
}
