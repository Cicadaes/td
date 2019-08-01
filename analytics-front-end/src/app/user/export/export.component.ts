import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { ExportService } from './export.service';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.less'],
  providers: [ExportService]
})
export class ExportComponent extends BaseComponent implements OnInit, OnChanges {
  crowdId: number;

  crowd: any = {}; // 人群信息

  tabList: any = [];

  attributeMap: any = {};

  tabIndex: number;

  selectList: any = [];

  allChecked: boolean;

  indeterminate: boolean;

  error: boolean;

  _isVisible: boolean;

  showTab: boolean;

  constructor(public exportService: ExportService, private injector: Injector) {
    super(injector);
    this.initRouterList('导出');

    const that = this;
    that.tabIndex = 0;
    that.allChecked = false;
    that.indeterminate = false;
    this._isVisible = false;
    this.showTab = false;
    that.crowdId = 22;
    that.route.paramMap.subscribe((params: any) => {
      that.crowdId = params.get('crowdId');
      that.exportService.getCrowdById(that.crowdId).subscribe((data: any) => {
        if (data.code === 200) {
          that.crowd = data.data.crowd;
        }
      });
      that.exportService.getListDetails().subscribe((data: any) => {
        if (data.code === 200) {
          const tempData = data.data;
          const tempDataLength = data.data.length;
          that.exportService.getListDetailsForId().subscribe((data2: any) => {
            if (data2.code === 200) {
              const length = data2.data.length;
              const tempList = [];
              for (let i = 0; i < length; i++) {
                for (let j = 0; j < tempDataLength; j++) {
                  if (data2.data[i].attributeId === tempData[j].id) {
                    tempList.push(tempData[j]);
                  }
                }
              }
              const tempListLength = tempList.length;
              for (let i = 0; i < tempListLength; i++) {
                if (!that.attributeMap[tempList[i].groupName]) {
                  that.tabList.push(tempList[i].groupName);
                  that.attributeMap[tempList[i].groupName] = [
                    {
                      label: tempList[i].displayname,
                      value: tempList[i].esfieldname
                    }
                  ];
                } else {
                  that.attributeMap[tempList[i].groupName].push({
                    label: tempList[i].displayname,
                    value: tempList[i].esfieldname
                  });
                }
              }
              this.showTab = true;
            }
          });
        }
      });
    });
  }

  ngOnInit() {}

  changeTab(data: any, i: number) {
    const that = this;
    that.tabIndex = i;
    that.checkoutCheckBox(that.attributeMap[that.tabList[that.tabIndex]]);
    that.selectList = [];
    that.attributeMap[that.tabList[that.tabIndex]].forEach((item: any, index: number) => {
      if (item.checked === true) {
        const json = {
          value: item.value,
          label: item.label,
          index: index
        };
        that.selectList.push(json);
      }
    });
  }

  changeCheckbox(data: any, i: number) {
    const that = this;
    if (data.checked) {
      const json = {
        label: data.label,
        value: data.value,
        index: i
      };
      that.selectList.push(json);
    } else {
      for (let n = 0; n < that.selectList.length; n++) {
        if (that.selectList[n].index === i && that.selectList[n].value === data.value) {
          that.selectList.splice(n, 1);
          break;
        }
      }
    }
    that.checkoutCheckBox(that.attributeMap[that.tabList[that.tabIndex]]);
  }

  removeSelect(data: any, i: number) {
    const that = this;
    that.selectList.splice(i, 1);
    that.attributeMap[that.tabList[that.tabIndex]][data.index].checked = false;
    that.checkoutCheckBox(that.attributeMap[that.tabList[that.tabIndex]]);
  }

  updateAllChecked() {
    const that = this;
    this.error = false;
    that.indeterminate = false;
    if (that.allChecked) {
      that.selectList = [];
      that.attributeMap[that.tabList[that.tabIndex]].forEach((item, i) => {
        item.checked = true;
        const json = {
          label: item.label,
          value: item.value,
          index: i
        };
        that.selectList.push(json);
      });
    } else {
      that.selectList = [];
      that.attributeMap[that.tabList[that.tabIndex]].forEach(item => (item.checked = false));
    }
  }

  checkoutCheckBox(data: any) {
    const that = this;
    if (data.every(item => item.checked === true)) {
      that.allChecked = true;
      that.indeterminate = false;
    } else if (data.every(item => item.checked === false || item.checked === undefined)) {
      that.allChecked = false;
      that.indeterminate = false;
    } else {
      that.allChecked = false;
      that.indeterminate = true;
    }
    this.error = false;
  }

  cancel() {
    const that = this;
    that.selectList = [];
    that.allChecked = false;
    that.indeterminate = false;
    for (let i = 0; i < that.tabList.length; i++) {
      that.attributeMap[that.tabList[i]].forEach(item => (item.checked = false));
    }
    that.goLastPage();
  }

  save() {
    const that = this;
    const json = { data: [], crowdId: that.crowdId };
    for (let i = 0; i < that.tabList.length; i++) {
      that.attributeMap[that.tabList[i]].forEach(item => {
        if (item.checked === true) {
          json.data.push({ attributeCode: item.value });
        }
      });
    }
    if (json.data.length < 1) {
      this.error = true;
      return;
    }
    that.exportService.exportCrowd(that.crowdId, json).subscribe((data: any) => {
      if (data.code === 200) {
        // TODO导出
        // that.modalService.success({
        //     nzTitle: '人群导出',
        //     nzContent: data.message,
        //     nzOnOk: () => {
        //         that.goLastPage();
        //     }
        // });
        that._isVisible = true;
      }
    });
  }

  _hideDialog() {
    this._isVisible = false;
    this.globals.resetBodyStyle();
    this.commonService.goBack();
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  handleOk = (e: any) => {
    this._hideDialog();
  };

  handleCancel = (e: any) => {
    this.globals.resetBodyStyle();
    this._isVisible = false;
  };

  goLastPage() {
    this.commonService.goBack();
  }
}
