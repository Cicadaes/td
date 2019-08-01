import { Component, ViewChild, Injector } from '@angular/core';
import { ActivityCenterAppPushService } from './activity-center-app-push.service';
import { SegmentDataService } from '../segment-data.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { BaseComponent } from '../../../common/base-component';

declare var CKEDITOR: any;

@Component({
  selector: 'app-activity-center-app-push',
  templateUrl: './activity-center-app-push.component.html',
  styleUrls: ['./activity-center-app-push.component.less'],
  providers: [ActivityCenterAppPushService]
})
export class ActivityCenterAppPushComponent extends BaseComponent {
  vm: any;
  segment: any; // 投放信息
  appPush: any; // 投放数据  [{},{},{}] A/B test
  appConfig: any = {}; // app配置

  sendType = '1'; // 投放类型
  customParamList: any[] = []; // 自定义参数列表
  pieceList = []; // AB test列表
  changeBeforPoeceList = []; // AB test 改变之前的列表
  seletABIndex: number; // 选中的AB
  min = 5; // 最小选择流量
  max = 100; // 最大选择流量
  variableList: any[] = []; // 插入变量列表

  sendTime: any; // 投放时间（定时）
  hourList: any = []; // 小时（定时）
  selectedHour: number = 0; // 选中的小时（定时）
  minuteList: any = []; // 分钟（定时）
  selectedMinute: number = 0; // 选中的分钟（定时）

  // 离线用户存活时间
  liveTimeList: any = [
    { label: '4小时', value: 4 },
    { label: '8小时', value: 8 },
    { label: '1天', value: 24 },
    { label: '2天', value: 48 }
  ];

  editorConfig: any = {
    width: '398px',
    height: '158px',
    toolbar: [
      // 工具栏
      ['Font', 'FontSize', 'TextColor', '-', 'Bold', 'Italic', 'Underline']
    ],
    removePlugins: 'elementspath',
    resize_enabled: false
  };

  @ViewChild('ckEditor') ckEditor: any;

  constructor(
    private activityCenterAppPushService: ActivityCenterAppPushService,
    public notification: NzNotificationService,
    public segmentDataService: SegmentDataService,
    private injector: Injector
  ) {
    super(injector);
    this.initError();

    const appId = localStorage.getItem('appkey');
    if (appId) {
      activityCenterAppPushService.getAppConfig(appId).subscribe(data => {
        if (data['code'] === 200) {
          this.appConfig = data['data'];
        }
      });
    }

    for (let i = 0; i < 24; i++) {
      this.hourList.push({ label: i + '时', value: i });
    }

    for (let i = 0; i < 60; i++) {
      this.minuteList.push({ label: i + '分', value: i });
    }

    activityCenterAppPushService.getCustomParamList().subscribe(data => {
      if (data['code'] !== 'OK' && data['code'] !== 200) {
        return;
      }
      this.variableList = data['data'];
    });

    this.initSegment();
  }

  ngOnInit() {
    const that = this;

    // 监听富文本外层的滚动事件，调用focus(关闭工具栏的弹出)
    document.getElementById('push-form').addEventListener('scroll', that.hideToolSelection);
  }

  hideToolSelection = () => {
    let editor = this.ckEditor && this.ckEditor.instance;
    if (editor) {
      // 聚焦
      editor.focus();

      // 将光标移至最末
      let range = editor.createRange();
      range.moveToElementEditEnd(editor.editable());
      range.select();
      range.scrollIntoView();
    }
  };

  /**
   * 初始化错误
   */
  initError() {
    this.vm = {
      timeError: false,
      timeErrorInfo: '',
      extendAttrError: false,
      prodError: false,
      titleError: [],
      titleErrorInfo: [],
      contentError: [],
      contentErrorInfo: [],
      soundNameError: [],
      badgeError: []
    };
  }

  /**
   * 初始化应用推送数据
   */
  initSegment() {
    let appPush;
    this.segment = this.segmentDataService.segmentInfo;
    this.segment['channelCode'] = this.segment['channelCode'] || 'tdpush';
    // if(this.segment[''])
    this.segment['channelType'] = 1;
    this.segment['platform'] = this.segment['platform'] || 'android';
    this.segment['triggerType'] = (this.segment['triggerType'] || '1') + ''; // 投放方式
    if ('number' === typeof this.segment['prod']) {
      this.segment['prod'] = this.segment['prod'] + '';
    }

    if (!this.segment['timeToLive']) {
      this.segment['timeToLive'] = 4;
    }

    this.changePlatform(this.segment['platform']);

    if (this.segment['appointedTime']) {
      const date = new Date(this.segment['appointedTime']);
      this.sendTime = date;
      this.selectedHour = date.getHours();
      this.selectedMinute = date.getMinutes();
    }
  }

  /**
   * 设置A/B流量比数组
   * @param type
   */
  setGroupRatioList(type: string) {
    if (type === 'android') {
      this.appPush = this.segment.androidData;
    } else {
      this.appPush = this.segment.iosData;
    }
    this.appPush.forEach(element => {
      if (element['groupOption'] && element['ratio']) {
        this.pieceList.push({
          type: element['groupOption'],
          flowCount: element['ratio']
        });
      } else {
        return;
      }
    });
    if (this.pieceList.length == 0) {
      this.pieceList = [
        {
          flowCount: 100,
          type: 'A'
        }
      ];
    }
    this.setRatio(this.pieceList);
    this.changeBeforPoeceList = JSON.parse(JSON.stringify(this.pieceList));
    this.seletABIndex = 0;
  }

  /**
   * 选择设置自定义参数
   * @param value
   */
  changeCustomParam(value: any) {
    if (value) {
      if (!this.appPush[this.seletABIndex].extendAttr) {
        this.appPush[this.seletABIndex].extendAttr = [];
      }
      if (this.appPush[this.seletABIndex].extendAttr.length === 0) {
        this.appPush[this.seletABIndex].extendAttr = [{}];
      }
    }
  }

  /**
   * 添加自定义参数
   */
  addCustomParam() {
    const that = this;
    const length = that.appPush[that.seletABIndex].extendAttr.length;
    if (
      that.appPush[that.seletABIndex].extendAttr[length - 1]['key'] &&
      that.appPush[that.seletABIndex].extendAttr[length - 1]['value']
    ) {
      that.vm.extendAttr = false;
      that.appPush[that.seletABIndex].extendAttr.push({});
    } else {
      that.vm.extendAttr = true;
    }
  }

  /**
   * 删除自定义参数
   * @param data
   * @param i
   */
  removeCustomParam(data, i) {
    // this.customParamList.splice(i, 1);
    this.vm.extendAttr = false;
    this.appPush[this.seletABIndex].extendAttr.splice(i, 1);
  }

  /**
   * 切换平台
   * @param type
   * @param isPage 是否是页面上的操作
   */
  changePlatform(type: string, isPage?: boolean) {
    const that = this;
    if (this.segmentDataService.isUpdate === 0 && isPage) {
      return;
    }
    that.segment['platform'] = type;
    if (this.segment['platform'] === 'android' && !this.segment['androidData']) {
      this.segment['androidData'] = [{}];
    } else if (this.segment['platform'] === 'ios' && !this.segment['iosData']) {
      this.segment['iosData'] = [{}];
    }
    this.pieceList = [];
    this.setGroupRatioList(type);
  }

  /**
   * 改变IOS的推送通道
   * @param event
   */
  changeIOSChannel(event: any) {
    if (event === '1') {
      this.segment['channelCode'] = `${this.productId}.iosprod`;
    } else if (event === '0') {
      this.segment['channelCode'] = `${this.productId}.iostest`;
    }
  }

  /**
   * 添加ABTest
   */
  addAbTest() {
    if (this.segment['platform'] === 'android') {
      this.segment['androidData'][this.pieceList.length] = {};
    } else if (this.segment['platform'] === 'ios') {
      this.segment['iosData'][this.pieceList.length] = {};
    }

    if (this.pieceList.length === 1) {
      this.pieceList = [
        {
          flowCount: 95,
          type: 'A'
        },
        {
          flowCount: 5,
          type: 'B'
        }
      ];
      this.max = 95;
    } else if (this.pieceList.length === 2) {
      this.pieceList = [
        {
          flowCount: 90,
          type: 'A'
        },
        {
          flowCount: 5,
          type: 'B'
        },
        {
          flowCount: 5,
          type: 'C'
        }
      ];
      this.max = 90;
    }
    this.changeBeforPoeceList = JSON.parse(JSON.stringify(this.pieceList));

    this.setRatio(this.pieceList);
  }

  /**
   * 删除ABtest       TDOD: //
   * @param index
   */
  deletePiece(index: number) {
    const that = this;
    if (that.pieceList.length > 1) {
      that.pieceList.splice(index, 1);
      if (this.pieceList.length === 1) {
        this.pieceList = [
          {
            flowCount: 100,
            type: 'A'
          }
        ];
        this.max = 100;
      } else if (this.pieceList.length === 2) {
        this.pieceList = [
          {
            flowCount: 95,
            type: 'A'
          },
          {
            flowCount: 5,
            type: 'B'
          }
        ];
        this.max = 95;
      }
      this.changeBeforPoeceList = JSON.parse(JSON.stringify(this.pieceList));
      // 删除AB test 也要把相应的数据内容删除  start
      let appPush;
      if (this.segment.platform === 'android') {
        appPush = this.segment.androidData;
      } else {
        appPush = this.segment.iosData;
      }
      appPush.splice(index, 1);
      this.seletABIndex = that.pieceList.length - 1;
      // 删除AB test 也要把相应的数据内容删除  end
      this.setRatio(this.pieceList);
    }
  }

  /**
   * 选中
   * @param index
   */
  onSelect(index: number) {
    this.seletABIndex = index;
    if (this.segment['platform'] == 'android') {
      this.segment['androidData'][this.seletABIndex] = this.segment['androidData'][this.seletABIndex] || {};
    } else if (this.segment['platform'] == 'ios') {
      this.segment['iosData'][this.seletABIndex] = this.segment['iosData'][this.seletABIndex] || {};
    }
  }

  /**
   * 改变推广内容的流量
   * @param piece
   * @param index
   */
  changeFlowCount(piece: any, index: number) {
    const growCount = piece.flowCount - this.changeBeforPoeceList[index].flowCount; // 该次选择改变了多少流量
    const nextIndex = index + 1 >= this.pieceList.length ? 0 : index + 1;
    // 如果只有一个标签永远为100 不能改变
    if (nextIndex === index) {
      piece.flowCount = 100;
      return;
    }
    // 如果有两个标签
    if (this.pieceList.length === 2) {
      this.pieceList[nextIndex].flowCount = 100 - piece.flowCount;
    } else if (this.pieceList.length === 3) {
      // 如果有三个标签
      let otherIndex: number = nextIndex + 1 >= this.pieceList.length ? 0 : nextIndex + 1; // 获取第三个标签的index
      // 下一个推送内容流量数量当前推送内容流量的增减范围
      if (this.pieceList[nextIndex].flowCount - growCount > 5 && this.pieceList[nextIndex].flowCount - growCount < 90) {
        this.pieceList[index].flowCount = piece.flowCount;
        this.pieceList[nextIndex].flowCount = this.pieceList[nextIndex].flowCount - growCount;
      } else if (this.pieceList[nextIndex].flowCount - growCount <= 5) {
        // 下个一个推送内容流量数量不满足当前推送内容流量的增加的数量
        this.pieceList[index].flowCount = piece.flowCount;
        this.pieceList[otherIndex].flowCount =
          this.pieceList[otherIndex].flowCount - (growCount - (this.pieceList[nextIndex].flowCount - 5));
        this.pieceList[nextIndex].flowCount = 5;
      } else if (this.pieceList[nextIndex].flowCount - growCount >= 90) {
        // 下个一个推送内容流量数量不满足当前推送内容流量的减少的数量
        this.pieceList[index].flowCount = 5;
        this.pieceList[otherIndex].flowCount =
          this.pieceList[otherIndex].flowCount + (this.pieceList[nextIndex].flowCount - growCount - 90);
        this.pieceList[nextIndex].flowCount = 90;
      }
    }
    this.setRatio(this.pieceList);
    this.changeBeforPoeceList = JSON.parse(JSON.stringify(this.pieceList));
  }

  /**
   * 改变流量时，需要将新的流量比设置给对象中
   * @param data
   */
  setRatio(data: any): any {
    let appPush;
    if (this.segment.platform === 'android') {
      appPush = this.segment.androidData;
    } else {
      appPush = this.segment.iosData;
    }
    for (let i = 0; i < data.length; i++) {
      appPush[i]['groupOption'] = data[i]['type'];
      appPush[i]['ratio'] = data[i]['flowCount'];
    }
  }

  /**
   * 插入变量
   * @param data
   */
  insertVariable(data: any) {
    const inputText = document.getElementById('content');
    const textIndex = this.doGetCaretPosition(inputText);
    let appPush;

    if (this.segment.platform === 'android') {
      appPush = this.segment.androidData;
    } else {
      appPush = this.segment.iosData;
    }

    if (!appPush[this.seletABIndex]['customParameters']) {
      appPush[this.seletABIndex]['customParameters'] = [];
    }
    if (appPush[this.seletABIndex]['customParameters'].indexOf(data.key) === -1) {
      appPush[this.seletABIndex]['customParameters'].push(data.key);
    }
    let content = appPush[this.seletABIndex].message;
    if (!content) {
      content = `\${${data.key}}`;
    } else {
      const length = content.length;
      const first = '${',
        last = '}';
      content = `${content.substring(0, textIndex)}${first}${data.key}${last}${content.substring(textIndex, length)}`;
    }
    appPush[this.seletABIndex].message = content;
  }

  /**
   * 插入变量（富文本）
   * @param data
   */
  editorInsertVariable(data: any) {
    let oEditor, appPush;

    if (this.segment.platform === 'android') {
      appPush = this.segment.androidData;
    } else {
      appPush = this.segment.iosData;
    }

    if (!appPush[this.seletABIndex]['customParameters']) {
      appPush[this.seletABIndex]['customParameters'] = [];
    }
    if (appPush[this.seletABIndex]['customParameters'].indexOf(data.key) === -1) {
      appPush[this.seletABIndex]['customParameters'].push(data.key);
    }

    oEditor = this.ckEditor.instance;
    let value = `\${${data.key}}`;
    // Check the active editing mode.
    if (oEditor.mode == 'wysiwyg') {
      // Insert HTML code.
      oEditor.insertHtml(value);
    }
  }

  doGetCaretPosition(oField: any) {
    let iCaretPos = 0;
    if (document['selection']) {
      // IE
      oField.focus();
      const oSel = document['selection'].createRange();
      oSel.moveStart('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      // Firefox suppor  测试chrome v56.0.2924.87无问题
      iCaretPos = oField.selectionStart;
    }
    return iCaretPos;
  }

  /**
   * 禁止选择的日期
   */
  disabledDate = (current: Date): boolean => {
    const nowDate = new Date();
    return nowDate.getTime() - 24 * 60 * 60 * 1000 > current.getTime();
  };

  /**
   * 改变时间
   * @param value
   */
  buildSendTime(value: any) {
    this.initError();
    const hour = this.selectedHour < 10 ? `0${this.selectedHour}` : this.selectedHour;
    const minute = this.selectedMinute < 10 ? `0${this.selectedMinute}` : this.selectedMinute;
    const sendTime = `${this.sendTime.getFullYear()}-${this.sendTime.getMonth() +
      1}-${this.sendTime.getDate()} ${hour}:${minute}:00`;
    this.segment['appointedTime'] = sendTime;
  }

  /**
   * 检查参数
   */
  checkParam() {
    let flag = true,
      pushData;
    if (this.segment['triggerType'] == 2) {
      this.vm.timeError = false;
      if (!this.sendTime) {
        this.vm.timeError = true;
        this.vm.timeErrorInfo = '请选择日期';
        flag = false;
      } else if (new Date() > new Date(this.segment['appointedTime'])) {
        this.vm.timeError = true;
        this.vm.timeErrorInfo = '定时发送时间需要大于当前时间';
        flag = false;
      }
    } else if (this.segment['triggerType'] == 1) {
      delete this.segment['appointedTime'];
    }

    if (this.segment['channelCode'] != 'tdpush') {
      this.segment['xiaomi'] = false;
      this.segment['huawei'] = false;
    }

    if (this.segment.platform === 'android') {
      pushData = this.segment.androidData;
    } else {
      pushData = this.segment.iosData;
    }

    let length = pushData.length;
    for (let i = 0; i < length; i++) {
      if (!pushData[i].action) {
        if (this.segment.platform === 'android') {
          if (!pushData[i].title) {
            this.vm.titleError[i] = true;
            this.vm.titleErrorInfo[i] = '请输入消息标题';
            flag = false;
          } else {
            this.vm.titleError[i] = false;
            if (pushData[i].title.length > 25) {
              this.vm.titleError[i] = true;
              this.vm.titleErrorInfo[i] = '消息标题长度不能超过25';
              flag = false;
            }
          }

          if (!pushData[i].message) {
            this.vm.contentError[i] = true;
            this.vm.contentErrorInfo[i] = '请输入消息内容';
            flag = false;
          } else {
            this.vm.contentError[i] = false;
            let editorContent;
            editorContent = this.ckEditor.instance.document.getBody().getText();
            if (editorContent.length > 240) {
              this.vm.contentError[i] = true;
              this.vm.contentErrorInfo[i] = '消息内容长度不能超过240';
              flag = false;
            }
          }
        } else {
          if (!pushData[i].message) {
            this.vm.contentError[i] = true;
            this.vm.contentErrorInfo[i] = '请输入消息内容';
            flag = false;
          } else {
            this.vm.contentError[i] = false;
            if (pushData[i].message.length > 240) {
              this.vm.contentError[i] = true;
              this.vm.contentErrorInfo[i] = '消息内容长度不能超过240';
              flag = false;
            }
          }
          if (this.segment.prod != 0 && this.segment.prod != 1) {
            this.vm.prodError = true;
            flag = false;
          } else {
            this.vm.prodError = false;
          }
        }
        if (pushData[i].sound) {
          // 自定义声音
          this.vm.soundNameError[i] = false;
          if (!pushData[i].soundName) {
            this.vm.soundNameError[i] = true;
            flag = false;
          }
        }
        if (pushData[i].digitalAngle) {
          // 数字角标
          this.vm.badgeError[i] = false;
          if (!pushData[i].badge) {
            this.vm.badgeError[i] = true;
            flag = false;
          }
        }
        if (!flag) {
          this.seletABIndex = i;
          break;
        }
      }
    }

    return flag;
  }

  ngOnDestroy() {
    document.getElementById('push-form').removeEventListener('scroll', this.hideToolSelection);
  }
}
