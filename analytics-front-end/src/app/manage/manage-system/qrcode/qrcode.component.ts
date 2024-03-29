import { Component, Injector, OnInit } from '@angular/core';
import { QrcodeService } from './qrcode.service';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../common/config/page.size.config';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.less'],
  providers: [QrcodeService]
})
export class QrcodeComponent extends BaseComponent implements OnInit {
  showModal: boolean; // 是否显示弹框
  showCompoment: string; // 判断是显示创建二维码还是编辑二维码活完成创建二维码
  total: number; // table列表总条数
  tableList: any[]; // 后端数据占时放这
  setTimeoutParam: any; // 用来记录setTimeout 用于处理搜索时防止一直请求
  laoding: boolean; // 是否显示loading
  modelTitle: string; // 弹框title文字
  deatilQrcode: any; // qrcode详情
  modalWidth: number; // 对话框宽度
  pageIndex: number = 1; // table页数
  pageSize: number; // table每页条数
  oldPageSize: number;
  serachParam: string; // 搜索文字   、
  nzPageSizeOptions: number[];
  creatResult: any; //批量创建提交返回结果
  percentComplete: number = 0;
  downloadNum: number = 0;
  downloadSize: number = 0;
  token: string;

  appId: string; // appid
  secret: string; // appsecret

  constructor(public service: QrcodeService, private injector: Injector) {
    super(injector);
    const that = this;
    that.tableList = [];
    that.laoding = true;
    that.pageSize = 10;
    that.nzPageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
    if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
      that.token = localStorage.getItem('token');
    }
  }

  // TODO 缺少翻页时候处理
  ngOnInit() {
    this.getList();
  }

  /**
   * 获取二维码列表
   * @param page
   */
  getList(page?: number) {
    const that = this;
    if (page) {
      that.pageIndex = page;
    }
    const json = {
      page: page || that.pageIndex,
      pageSize: that.pageSize,
      orderBy: 'createTime',
      order: 'desc',
      productId: that.productId
    };
    if (that.serachParam) {
      json['qrcodeName'] = that.serachParam;
    }
    that.laoding = true;
    that.service.getList(json).subscribe((res: any) => {
      if (res.code === 200) {
        if (json['pageSize'] === that.pageSize && json['page'] === that.pageIndex) {
          that.laoding = false;
          that.tableList = res.data.data;
          if (that.tableList) {
            that.tableList = res.data.data.sort((a, b) => (b.id > a.id ? 1 : -1));
            that.tableList.forEach((data: any) => {
              data.qrcodeParams = JSON.parse(data.qrcodeParams);
              let tempString = '';
              if (data.qrcodeParams) {
                for (let i = 0; i < data.qrcodeParams.length; i++) {
                  if (!data.qrcodeParams[i].paramName || !data.qrcodeParams[i].paramValue) {
                    continue;
                  }
                  tempString += `${data.qrcodeParams[i].paramName}:${data.qrcodeParams[i].paramValue}; `;
                }
                data['params'] = tempString;
              }
              return data;
            });
          }
          that.total = res.data.total;
        }
      } else {
        if (res.message) {
          that.message.create('warning', res.message);
        }
      }
    });
  }

  /**
   * 修改二维码状态
   * @param data 二维码数据
   */
  setStatus(data: any) {
    const that = this;
    let tempContent = '启用后报表中将显示和统计该二维码的数据，您确定要启用吗？';
    const json = {
      ids: data.id,
      status: 1,
      qrcodeName: data.qrcodeName
    };
    if (data.status === 1) {
      tempContent = '禁用后报表中将不再显示和统计该二维码的数据，确定要禁用？';
      json.status = -1;
    }
    that.modalService.confirm({
      nzTitle: `提示`,
      nzContent: tempContent,
      nzOkText: '确认',
      nzOnOk: () => {
        that.service.setStatus(json).subscribe((res: any) => {
          if (res.code === 200) {
            that.getList();
          }
        });
      },
      nzCancelText: '取消',
      nzOnCancel: () => {}
    });
  }

  /**
   * 根据name搜索二维码
   */
  serachQrcode(name: string) {
    const that = this;
    that.laoding = true;
    that.serachParam = name;
    if (that.setTimeoutParam) {
      clearTimeout(that.setTimeoutParam);
    }
    that.setTimeoutParam = setTimeout(function() {
      that.pageIndex = 1;
      that.getList();
    }, 500);
  }

  /**
   * 显示创建二维码弹框
   */
  showCreateModal() {
    const that = this;
    that.service.getAppId().subscribe((data: any) => {
      if (data.code === 200) {
        that.appId = data.data.miniprogram_appid;
        that.secret = data.data.miniprogram_secret;
        that.modalWidth = 550;
        that.modelTitle = '创建二维码';
        that.showModal = true;
        that.showCompoment = 'create';
      } else {
        that.message.create('warning', data.message);
      }
    });
  }

  /**
   * 显示批量创建二维码弹框
   */
  showBatchCreateModal() {
    const that = this;
    that.service.getAppId().subscribe((data: any) => {
      if (data.code === 200) {
        that.appId = data.data.miniprogram_appid;
        that.secret = data.data.miniprogram_secret;
        that.modalWidth = 550;
        that.modelTitle = '批量创建二维码';
        that.showModal = true;
        that.showCompoment = 'batchCreate';
      } else {
        that.message.create('warning', data.message);
      }
    });
  }

  /**
   * 显示完成二维码创建弹框
   */
  show(data: any) {
    const that = this;
    that.deatilQrcode = JSON.parse(JSON.stringify(data));
    that.deatilQrcode.qrcodeParams = JSON.parse(that.deatilQrcode.qrcodeParams);
    that.deatilQrcode.type = 'end';
    that.modalWidth = 600;
    that.modelTitle = '完成二维码创建';
    that.showModal = true;
    that.showCompoment = 'edit';
  }

  /**
   * 显示完成批量二维码创建弹框
   */
  showBatchCreateResultModal(data: any) {
    const that = this;
    that.creatResult = JSON.parse(JSON.stringify(data));
    // that.deatilQrcode.qrcodeParams = JSON.parse(that.deatilQrcode.qrcodeParams);
    //that.deatilQrcode.type = 'end';
    that.modalWidth = 860;
    that.modelTitle = '完成批量创建二维码';
    that.showModal = true;
    that.showCompoment = 'batchCreateResult';
  }

  /**
   * 显示批量下载二维码创建弹框
   */
  batchDownload() {
    const that = this;
    that.modalWidth = 860;
    that.modelTitle = '下载完成';
    that.showModal = true;
    that.showCompoment = 'downloadQrcode';
  }

  downloadStart() {
    const that = this;
    that.modalWidth = 860;
    that.modelTitle = '下载完成';
    that.showModal = true;
    that.showCompoment = 'downloadQrcode';
    let ids = '';
    this.downloadNum = 0;
    that.percentComplete = 0;

    for (let i = 0; i < this.creatResult.errorQrcodes.length; i++) {
      if (this.creatResult.errorQrcodes[i].success) {
        if (ids == '') {
          ids += this.creatResult.errorQrcodes[i].id;
        } else {
          ids += ',' + this.creatResult.errorQrcodes[i].id;
        }
        this.downloadNum++;
      }
    }

    const downloadUrl = that.service.baseUrl + '/qrcode/download';
    let req = new XMLHttpRequest();
    req.open('POST', downloadUrl, true, '');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    //监听进度事件

    req.responseType = 'blob';
    req.onreadystatechange = function() {
      if (req.readyState === 4 && req.status === 200) {
        const filename = '小程序二维码.zip';
        if (navigator.userAgent.toLowerCase().match(/chrome/) != null) {
          // Chrome version
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(req.response);
          link.download = filename;
          link.click();
        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE version
          var blob = new Blob([req.response], { type: 'application/force-download' });
          window.navigator.msSaveBlob(blob, filename);
        } else {
          // Firefox version
          var file = new File([req.response], filename, { type: 'application/force-download' });
          window.open(URL.createObjectURL(file));
        }
      }
    };
    req.addEventListener(
      'progress',
      function(evt) {
        if (evt.lengthComputable) {
          that.percentComplete = evt.loaded / evt.total;
        } else {
          that.percentComplete = 0;
        }
      },
      false
    );
    req.send('ids=' + ids);
  }

  /**
   * 显示修改二维码弹框
   */
  editQrcode(data: any) {
    const that = this;
    that.modalWidth = 600;
    that.modelTitle = '编辑';
    that.service.getQrcode(data.id).subscribe((res: any) => {
      if (res.code === 200) {
        that.showModal = true;
        that.showCompoment = 'edit';
        res.data.qrcodeParams = JSON.parse(res.data.qrcodeParams);
        that.deatilQrcode = res.data;
        that.deatilQrcode.type = 'edit';
      }
    });
  }

  /**
   * 关闭弹框
   */
  cancelModal() {
    const that = this;
    that.showModal = false;
    that.percentComplete = 0;
    that.getList();
  }
}
