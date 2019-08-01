import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

const _ = require("lodash");

// import Services
import { ReportModelService } from './../../../../services/model/report.model.service';
import { ReportSourceService } from '../../../../services/source/report.source.service';

@Component({
  selector: 'app-select-type-container',
  templateUrl: './select-type-container.component.html',
  styleUrls: ['./select-type-container.component.less'],
  providers: [ReportSourceService]
})
export class SelectTypeContainerComponent implements OnInit {
  templateOptions = [
    {
      cover: '/assets/images/rowdata.png',
      reportType: 10,
      name: 'rowdata',
      title: 'Rowata',
      intro: '分析投放效果、洞察人群画像了解品牌声量',
      custom: false,
    },
    {
      cover: '/assets/images/day.png',
      reportType: 20,
      name: 'day',
      title: '日报',
      intro: '分析投放效果、洞察人群画像了解品牌声量',
      custom: false,
    },
    {
      cover: '/assets/images/week.png',
      reportType: 30,
      name: 'week',
      title: '周报',
      intro: '分析投放效果、洞察人群画像了解品牌声量',
      custom: false,
    },
    {
      cover: '/assets/images/report.png',
      reportType: 40,
      name: 'report',
      title: '结案报告',
      intro: '分析投放效果、洞察人群画像了解品牌声量',
      custom: false,
    },
    {
      cover: '/assets/images/operator.png',
      reportType: 50,
      name: 'custom',
      title: '自定义模版',
      intro: '分析投放效果、洞察人群画像了解品牌声量',
      custom: true,
    },
  ];

  selectedOption: any;        // 已选的选项
  id: any;                    // 营销报告id
  name: any;                  // 营销报告名
  reportType: any;            // 报告类型

  shouldReportPreviewShow: boolean = false;    // 是否展示预览页面
  shouldCustomTemplateShow: boolean = false;   // 是否展示自定义模版页面

  listDiyChart: any = [];     // 自定义报告类型左侧图标列表

  isEdit: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reportModel: ReportModelService,
    private nzMessageService: NzMessageService,
    private reportSourceService: ReportSourceService
  ) { }

  ngOnInit() {
    this.determineEditState();
    if (this.isEdit) {
      this.getDataForUrl();
    }
    this.getMarketReportListDiyChart();
  }

  nextStep() {
    if (this.selectedOption && this.reportModel.reportType) {
      if (this.reportModel.reportType !== 50) {
        if (this.isEdit) {
          this.router.navigate(['/report/edit/edit-data', this.name, this.id, this.reportModel]);
        } else {
          this.router.navigate(['/report/create/edit-data', '新建报告']);
        }
      }
    } else {
      this.nzMessageService.info("请选择报告类型后重试！");
    }
  }

  backUp() {
    this.router.navigate(['/report']);
  }

  selectTemplateOption(temp: any) {
    this.selectedOption = temp.reportType;
    this.reportModel.reportType = temp.reportType;

    if (this.reportModel.reportType === 50) {
      this.shouldCustomTemplateShow = true;
    }
  }

  showReportPreview(option: any) {
    this.shouldReportPreviewShow = true;
    this.reportType = option.reportType
  }

  closeReportPreviewShow(flag: boolean) {
    this.shouldReportPreviewShow = flag;
  }

  closeCustomTemplateShow(flag: boolean) {
    this.shouldCustomTemplateShow = flag;
  }

  getMarketReportListDiyChart() {
    this.reportSourceService.getMarketReportListDiyChart().then((data: any) => {
      if (data.code == 200 && data.result) {
        this.listDiyChart = _.cloneDeep(data.result);
      }
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
      this.selectedOption = this.reportModel.reportType;
      this.reportModel.timeDimension = params.get('timeDimension');
      this.reportModel.peopleDimension = params.get('peopleDimension');
      this.reportModel.deviceDimension = params.get('deviceDimension');
      this.reportModel.regionDimension = params.get('regionDimension');
    });
  }
}
