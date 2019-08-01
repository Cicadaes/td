import { Component, OnInit, OnDestroy } from '@angular/core';
import { PipelineService } from '../../pipeline.service';
import { PipelineCommunicationService } from '../../pipeline-communication.service';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sms-panel',
  templateUrl: './sms-panel.component.html',
  styleUrls: ['./sms-panel.component.less']
})
export class SmsPanelComponent implements OnInit, OnDestroy {
  productId: any; // 产品Id
  channeltype = 2; // 短信渠道类型
  groupId: any; // 投放组Id TODO 占时绑定id
  groupList: any[]; // 投放组列表
  showGroupList: boolean; // 是否显示投放组下拉列表
  timeTabs: any = [];
  hourList: any[];
  minuteList: any[];
  channelList: any = []; // 投放渠道列表
  signList: any = []; // 签名列表
  subCodeList: any = []; // 通道号码列表
  fileName: any; // 文件名称
  _channelCode: any;
  variableList: any = []; // 参数列表

  smsTypeList: any = []; // 短信渠道类型列表

  constructor(
    public pipelineService: PipelineService,
    public pcs: PipelineCommunicationService,
    public notification: NzNotificationService,
    private modalService: NzModalService
  ) {
    const that = this;
    that.productId = localStorage.getItem('productId');
    if (!that.pcs.nodeData['signPosition']) {
      that.pcs.nodeData['signPosition'] = 'before';
    }
    if (!that.pcs.nodeData.triggerType) {
      that.pcs.nodeData.triggerType = '1';
    } else {
      that.pcs.nodeData.triggerType += '';
    }
    if (that.pcs.nodeData.shortMessageType) {
      that.pcs.nodeData.shortMessageType += '';
    } else {
      that.pcs.nodeData.shortMessageType = '1';
    }
    that.smsTypeList = [
      {
        label: '营销类短信',
        value: '1'
      },
      {
        label: '非营销类短信',
        value: '2'
      }
    ];

    that.hourList = [];
    that.minuteList = [];
    for (let i = 0; i < 24; i++) {
      let one;
      if (i < 10) {
        one = '0' + i.toString();
      } else {
        one = i.toString();
      }
      that.hourList.push(one);
    }
    for (let i = 0; i < 60; i++) {
      let one;
      if (i < 10) {
        one = '0' + i.toString();
      } else {
        one = i.toString();
      }
      that.minuteList.push(one);
    }

    if (that.pcs.nodeData.frontendAttr) {
      const temp = JSON.parse(that.pcs.nodeData.frontendAttr);
      that.pcs.nodeData.date = temp.date;
      that.pcs.nodeData.hour = temp.hour;
      that.pcs.nodeData.minute = temp.minute;
    }
    that.getGroupList();
    that.getCustomParameters();
  }

  ngOnInit() {
    const that = this;
    this.timeTabs = [
      {
        name: '立即投放',
        type: 1
      },
      {
        name: '定时投放',
        type: 2
      }
    ];

    /**
     * 处理group下拉框的隐藏
     */
    document.addEventListener('click', (e: any) => {
      if (that.showGroupList) {
        that.showGroupList = !that.showGroupList;
      }
    });

    this.getChannelList();
  }

  /**
   * 获取渠道列表
   */
  getChannelList() {
    this.pipelineService.getChannelList(this.channeltype).subscribe(response => {
      if (response.code === 200) {
        this.channelList = response.data;
        for (let i = 0, j = this.channelList.length; i < j; i++) {
          if (this.pcs.nodeData.channelCode === this.channelList[i].code) {
            this._channelCode = this.channelList[i];
            this.signList = this.channelList[i].param.signList;
            this.subCodeList = this.channelList[i].param.subCodeList;
          }
        }
      }
    });
  }

  /**
   * 改变渠道code
   * @param value
   * @param flag 内部调用传ture
   */
  changeChannelCode(value: any, flag?: boolean) {
    this.signList = [];
    this.subCodeList = [];
    if (!flag) {
      this.pcs.nodeData['sign'] = null;
      this.pcs.nodeData['shortCode'] = null;
    }
    this.channelList.forEach((element: any) => {
      if (value === element['code']) {
        this.signList = element['param'] && element['param']['signList'];
        this.subCodeList = element['param'] && element['param']['subCodeList'];
      }
    });
  }

  /**
   * 控制投放组列表是否显示
   */
  showGroups(e: any) {
    e.stopPropagation();
    const that = this;
    that.showGroupList = !that.showGroupList;
  }

  /**
   * 获取投放组列表
   */
  getGroupList() {
    const that = this;
    that.pipelineService.getSegmentGroupList(that.pcs.campaignId).subscribe((data: any) => {
      if (data.code === 200) {
        that.groupList = data.data;
      }
    });
  }

  /**
   * 上传黑名单
   * @param event
   */
  handleChange(event: any) {
    if (event.type === 'success') {
      const response = event.file.response;
      if (response.code === 200) {
        this.pcs.nodeData['attachmentId'] = response.data.uploadUUID;
        this.pcs.nodeData['attachmentName'] = event.file.name;
        this.fileName = event.file.name;
      } else if (response.code) {
        this.notification.create('error', '错误提示', response.message);
      }
    }
  }

  // 清楚黑名单
  clearFile() {
    if (!this.pcs.isPipelineEdit) {
      return;
    }
    delete this.pcs.nodeData['attachmentId'];
    delete this.pcs.nodeData['attachmentName'];
  }

  /**
   * 获取插入参数列表
   */
  getCustomParameters() {
    const that = this;
    that.pipelineService.getCustomParameters(that.pcs.pipelineId).subscribe((result: any) => {
      if (result.code === 200) {
        const customList = JSON.parse(result.data.customParameterVoList);
        const equityList = JSON.parse(result.data.pipelineEquityList);
        that.variableList = customList.concat(equityList);
        that.variableList.map((value: any, index: number) => {
          value.value = value.value || value.name;
          value.key = value.key || `${value.name}_${value.equityId}`;
          return value;
        });
      }
    });
  }

  /**
   * 插入变量
   * @param data
   */
  insertVariable(data: any) {
    const that = this;
    if (that.pcs.nodeData.content && data.key.length + 3 + that.pcs.nodeData.content.length > 500) {
      // 3 是 ${}的长度
      this.notification.create('error', '错误提示', '剩余内容不足，无法插入变量');
      return;
    }
    let inputText = document.getElementById('content');
    const textIndex = this.doGetCaretPosition(inputText);
    let content = this.pcs.nodeData.content;
    if (!data.id) {
      if (that.pcs.nodeData.customParameters) {
        that.pcs.nodeData.customParameters.push(data.key);
      } else {
        that.pcs.nodeData.customParameters = [data.key];
      }
    } else {
      if (that.pcs.nodeData.equitys) {
        that.pcs.nodeData.equitys.push(`${data.name}_${data.equityId}`);
      } else {
        that.pcs.nodeData.equitys = [`${data.name}_${data.equityId}`];
      }
    }
    data = `\$\{${data.key}\}`;
    if (!content) {
      content = data;
    } else {
      let length = content.length;
      content = content.substring(0, textIndex) + data + content.substring(textIndex, length);
    }
    this.pcs.nodeData.content = content;
  }

  doGetCaretPosition(oField: any) {
    let iCaretPos = 0;
    if (document['selection']) {
      // IE
      oField.focus();
      let oSel = document['selection'].createRange();
      oSel.moveStart('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      // Firefox suppor  测试chrome v56.0.2924.87无问题
      iCaretPos = oField.selectionStart;
    }
    return iCaretPos;
  }

  /**
   * 选中投放列表中的某一个分组
   */
  selectGroup(group: any) {
    const that = this;
    that.showGroupList = false;
    that.pcs.nodeData.groupName = group.groupName;
    that.pcs.nodeData.groupId = group.id;
  }

  /**
   * 创建投放组
   */
  saveGroup(e: any) {
    if (e && e.keyCode === 13) {
      const that = this;
      if (!that.pcs.nodeData.groupName) {
        return;
      }
      that.pipelineService
        .saveSegmentGroup(that.pcs.campaignId, that.pcs.nodeData.groupName, that.productId)
        .subscribe((data: any) => {
          if (data.code === 200) {
            that.pcs.nodeData.groupId = data.data.id;
            that.getGroupList();
          }
        });
    }
  }

  /**
   * 删除投放组
   */
  deleteGroup(data: any, e: any) {
    e.stopPropagation();
    const that = this;
    if (data && data.groupName) {
      that.modalService.confirm({
        nzTitle: '提示',
        nzContent: `确定要删除投放组"${data['groupName']}"？`,
        nzOnOk: () => {
          that.pipelineService.deleteSegmentGroup(data.id).subscribe((data: any) => {
            if (data.code === 200) {
              that.getGroupList();
            }
          });
        }
      });
    }
  }

  /**
   * 改变签名位置
   * @param value
   */
  changeSignPosition(value: any) {
    this.changeSign(this.pcs.nodeData.sign);
  }

  /**
   * 改变签名
   * @param value
   */
  changeSign(value: any) {
    this.signList.forEach(element => {
      if (element['key'] === value) {
        this.replaceSign(this.pcs.nodeData.content, element['sign']);
      }
    });
    // this.replaceSign(this.content, value);
  }

  /**
   * 替换内容中的签名
   * @param content
   * @param newSign
   */
  replaceSign(content: string, newSign: string) {
    const reg = new RegExp('[【][\\S\\s]+?[】]', 'gm');
    const execData = reg.exec(content);
    if (!execData) {
      // 没有匹配到就是新增
      if (this.pcs.nodeData.signPosition === 'before') {
        this.pcs.nodeData.content = `【${newSign}】${content}`;
      } else {
        this.pcs.nodeData.content = `${content}【${newSign}】`;
      }
    } else {
      if (this.pcs.nodeData.signPosition === 'before') {
        //改变位置
        content = content.replace(reg, '');
        this.pcs.nodeData.content = `【${newSign}】${content}`;
      } else {
        content = content.replace(reg, '');
        this.pcs.nodeData.content = `${content}【${newSign}】`;
      }
    }
  }

  /**
   * 改变投放时间
   */
  changeTime(type: any) {
    const that = this;
    if (!that.pcs.isPipelineEdit) {
      return;
    }
    if (type === 1) {
      that.pcs.nodeData.triggerType = 1;
    } else if (type === 2) {
      that.pcs.nodeData.triggerType = 2;
    }
  }

  /**
   * 控制日历选择未来时间
   */
  disabledDate = (current: Date): boolean => {
    const that = this;
    return !(current.getTime() >= that.pcs.startTime.getTime() && current.getTime() <= that.pcs.endTime.getTime());
  };

  ngOnDestroy() {
    document.removeEventListener('click', () => {}, false);
  }
}
