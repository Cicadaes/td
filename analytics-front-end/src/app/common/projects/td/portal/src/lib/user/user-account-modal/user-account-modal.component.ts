import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { PortalService } from '../../portal.service';

@Component({
  selector: 'lib-user-account-modal',
  templateUrl: './user-account-modal.component.html',
  styleUrls: ['./user-account-modal.component.less']
})
export class UserAccountModalComponent implements OnInit {
  nameprompt = '';
  namepromptshow = false;
  phoneNumberprompt = '';
  phoneNumberpromptshow = false;
  phoneprompt = '';
  phonepromptshow = false;
  qqprompt = '';
  qqpromptshow = false;
  wxprompt = '';
  wxpromptshow = false;
  userInfoshow = false;
  name = '';
  phoneNumber = '';
  phone = '';
  QQ = '';
  WX = '';
  radioValue = '';
  position = '';
  soure: boolean = false;
  soure1: boolean = false;
  soure2: boolean = false;
  soure3: boolean = false;
  soure4: boolean = false;

  positionprompt: any;
  positionpromptshow: boolean = false;
  appConfig = null;

  showdata: any;
  @Output() updateUserInfo = new EventEmitter<any>(); // 更新账户信息

  @Input()
  set config(appConfig) {
    this.appConfig = JSON.parse(JSON.stringify(appConfig));
    this.username();
  }

  @Input()
  set langData(data) {
    if (data) {
      this.showdata = data;
    }
  }
  get _oldPasswdCls(): any {
    return {
      [`input-text-h30`]: true,
      [`input-error`]: false
    };
  }

  constructor(private modalService: NzModalService, private service: PortalService) {}

  ngOnInit() {}

  username() {
    if (this.appConfig && this.appConfig.user) {
      this.name = this.appConfig.user.name;
      this.phoneNumber = this.appConfig.user.mobile;
      this.phone = this.appConfig.user.phone;
      this.QQ = this.appConfig.user.qq;
      this.WX = this.appConfig.user.wechat;
      if (this.appConfig.user.gender == '0') {
        this.radioValue = 'woman';
      } else if (this.appConfig.user.gender == '1') {
        this.radioValue = 'male';
      } else if (this.appConfig.user.gender == '-1') {
        this.radioValue = '';
      }
      this.position = this.appConfig.user.title;
    }
  }

  updateuser(event: MouseEvent) {
    this.prompt();
    this.promptphone();
    this.promptqq();
    this.promptwx();
    this.promptposition();
    if (!this.soure) {
      this.soure = false;
      return;
    }
    if (!this.soure1) {
      this.soure1 = false;
      return;
    }
    if (!this.soure2) {
      this.soure2 = false;
      return;
    }
    if (!this.soure3) {
      this.soure3 = false;
      return;
    }
    if (!this.soure4) {
      this.soure4 = false;
      return;
    }
    this.nameprompt = '';
    this.namepromptshow = false;
    this.phoneNumberprompt = '';
    this.phoneNumberpromptshow = false;
    this.phoneprompt = '';
    this.phonepromptshow = false;
    this.qqprompt = '';
    this.qqpromptshow = false;
    this.wxprompt = '';
    this.wxpromptshow = false;
    this.positionprompt = '';
    this.positionpromptshow = false;
    let param = {
      email: this.appConfig.user.email,
      id: this.appConfig.user.id,
      name: this.trim(this.name),
      title: this.trim(this.position) ? this.trim(this.position) : '',
      mobile: this.phoneNumber,
      phone: this.phone,
      qq: this.QQ,
      wechat: this.WX,
      gender: this.radioValue == 'woman' ? 0 : 1
    };
    this.service
      .updataUserName(param)
      .then(response => {
        this.userInfoshow = false;
        this.appConfig.user = JSON.parse(response).appConfig.user;
        this.updateUserInfo.emit(this.appConfig.user);
        setTimeout(() => {
          this.success();
        }, 800);
      })
      .catch((err: any) => {
        this.userInfoshow = false;
        setTimeout(() => {
          this.error();
        }, 800);
      });
  }

  prompt(event?: any) {
    if (this.name) {
      if (!/^([\u4E00-\u9FA5]|[A-Za-z0-9]|[ ])+$/.test(this.name)) {
        this.soure = false;
        this.namepromptshow = true;
        return (this.nameprompt = '只能输入中文、数字、26个英文字母(大小写)、空格.');
      } else if (this.name.length < 2 || this.name.length > 50) {
        this.soure = false;
        this.namepromptshow = true;
        return (this.nameprompt = '长度最少2位、最多50个字符.');
      } else if (this.trim(this.name) == '') {
        this.soure = false;
        this.namepromptshow = true;
        return (this.nameprompt = '空格前后必须有字符');
      } else {
        this.soure = true;
        this.namepromptshow = false;
      }
    } else if (!this.name) {
      this.soure = false;
      this.namepromptshow = true;
      return (this.nameprompt = '请输入姓名');
    }
    if (this.phoneNumber) {
      // if (!(/^(?!\b(0)\1+\b)(\+?\d{1,3}[. -]?)?\(?\d{3}\)?([. -]?)\d{3}\3\d{4}$/).test(this.phoneNumber)) {
      if (!/0?(13|14|15|17|18|19)[0-9]{9}/.test(this.phoneNumber) || this.phoneNumber.length > 11) {
        this.phoneNumberpromptshow = true;
        this.soure = false;
        return (this.phoneNumberprompt = '请输入正确的手机号');
      } else {
        this.phoneNumberpromptshow = false;
        this.soure = true;
      }
    } else if (!this.phoneNumber) {
      this.phoneNumberpromptshow = true;
      this.soure = false;
      return (this.phoneNumberprompt = '请输入手机');
    }
    this.nameprompt = '';
    this.namepromptshow = false;
    this.phoneNumberprompt = '';
    this.phoneNumberpromptshow = false;
    this.soure = true;
  }

  promptphone(event?: any) {
    if (this.phone) {
      // if (!(/^\s*\+?\s*(\(\s*\d+\s*\)|\d+)(\s*-?\s*(\(\s*\d+\s*\)|\s*\d+\s*))*\s*$/).test(this.phone)) {
      if (!/^(((0\d{2,3}[\-])?[1-9]\d{6}|(0\d{2}[\-])?[1-9]\d{7}))([\-]\d{3,5})?$/.test(this.phone)) {
        this.phonepromptshow = true;
        this.soure1 = false;
        return (this.phoneprompt = '请输入正确的联系电话');
      }
    }
    this.phoneprompt = '';
    this.phonepromptshow = false;
    this.soure1 = true;
  }

  promptqq(event?: any) {
    if (this.QQ) {
      if (!/^\d{5,20}$/.test(this.QQ)) {
        this.qqpromptshow = true;
        this.soure2 = false;
        return (this.qqprompt = '只能输入数字,最少5个字符、最多20个字符.');
      }
    }
    this.qqprompt = '';
    this.qqpromptshow = false;
    this.soure2 = true;
  }

  promptwx(event?: any) {
    if (this.WX) {
      if (!/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(this.WX)) {
        this.wxpromptshow = true;
        this.soure3 = false;
        return (this.wxprompt = '只能6-20个字母|数字|下划线和减号,必须以字母开头.');
      }
    }
    this.wxprompt = '';
    this.wxpromptshow = false;
    this.soure3 = true;
  }
  promptposition(event?: any) {
    if (this.position) {
      if (!/^([\u4E00-\u9FA5]|[A-Za-z]|[ ])+$/.test(this.position)) {
        this.positionpromptshow = true;
        this.soure4 = false;
        return (this.positionprompt = '只能输入中文、26个英文字母（大小写）、空格.');
      } else if (this.position.length > 50) {
        this.soure4 = false;
        this.positionpromptshow = true;
        return (this.positionprompt = '总长度不超过50个字符.');
      }
    }
    this.positionprompt = '';
    this.positionpromptshow = false;
    this.soure4 = true;
  }

  //   去左右空格
  trim(str: string) {
    if (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '');
    }
  }
  success(): void {
    this.modalService.success({
      nzTitle: '修改账户信息成功！',
      nzBodyStyle: { marginTop: `32px ` }
    });
  }
  error(): void {
    this.modalService.error({
      nzTitle: '修改账户信息失败！',
      nzContent: '<p>请联系系统管理员。</p>',
      nzBodyStyle: { marginTop: `32px ` }
    });
  }
  /**
   * 取消
   */
  hideuser() {
    this.nameprompt = '';
    this.namepromptshow = false;
    this.phoneNumberprompt = '';
    this.phoneNumberpromptshow = false;
    this.phoneprompt = '';
    this.phonepromptshow = false;
    this.qqprompt = '';
    this.qqpromptshow = false;
    this.wxprompt = '';
    this.wxpromptshow = false;
    this.userInfoshow = false;
    this.name = '';
    this.phoneNumber = '';
    this.phone = '';
    this.QQ = '';
    this.WX = '';
    this.radioValue = '';
    this.position = '';
  }
}
