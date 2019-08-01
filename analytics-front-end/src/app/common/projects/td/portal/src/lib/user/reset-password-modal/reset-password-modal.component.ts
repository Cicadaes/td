import { Component, OnInit, Input } from '@angular/core';
import { PortalService } from '../../portal.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'lib-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.less']
})
export class ResetPasswordModalComponent implements OnInit {
  oldPassword = '';
  newPassword = '';
  rePassword = '';
  oldPasswdMsg = '';
  newPasswdMsg = '';
  rePasswdMsg = '';
  btnSumbitTxt = '保存';
  oldPasswdErr = false;
  newPasswdErr = false;
  rePasswdErr = false;
  canSumbit = false;
  showdata;
  passwdDialogShow = false;
  appConfig: any;

  @Input()
  set config(appConfig) {
    this.appConfig = JSON.parse(JSON.stringify(appConfig));
  }

  @Input()
  set langData(data) {
    if (data) {
      this.showdata = data;
      this.btnSumbitTxt = this.showdata.publicSave || '保存';
    }
  }

  constructor(private service: PortalService, private msgService: NzMessageService) {}

  ngOnInit() {}

  get _oldPasswdCls(): any {
    return {
      [`input-text-h30`]: true,
      [`input-error`]: this.oldPasswdErr
    };
  }

  get _newPasswdCls(): any {
    return {
      [`input-text-h30`]: true,
      [`input-error`]: this.newPasswdErr
    };
  }

  get _rePasswdCls(): any {
    return {
      [`input-text-h30`]: true,
      [`input-error`]: this.rePasswdErr
    };
  }

  /**
   * 最短
   * @param val
   */
  checkStrongminlength(val: string) {
    let ls = 'minlength';
    if (val.length < 6) {
      return ls;
    }
  }
  /**
   * 最长
   * @param val
   */
  checkStrongmaxlength(val: string) {
    let ls = 'maxlength';
    if (val.length > 32) {
      return ls;
    }
  }
  /**
   * 正则验证
   * @param val
   */
  checkStrongRegExp(val: string) {
    let enterpassword = new RegExp(/^\s*[\S]*[0-9]+[\S]*$/);
    let valueRe = /^[\d]+$/;
    return enterpassword.test(val) ? !valueRe.test(val) : enterpassword.test(val);
  }
  checkOldPassword(event: MouseEvent) {
    event.preventDefault();
    this.oldPassword = this.service.trim(this.oldPassword);
    if (this.oldPassword) {
      this.oldPasswdErr = false;
      this.oldPasswdMsg = '';
    } else {
      this.oldPasswdErr = true;
      this.oldPasswdMsg = this.showdata.startMenuPart6 || '请输入原始密码';
    }
  }

  checkNewPassword(event: MouseEvent) {
    event.preventDefault();
    this.newPassword = this.service.trim(this.newPassword);

    if (this.newPassword) {
      if ('minlength' == this.checkStrongminlength(this.newPassword)) {
        this.newPasswdErr = true;
        this.newPasswdMsg = '长度至少6个字符';
      } else if ('maxlength' == this.checkStrongmaxlength(this.newPassword)) {
        this.newPasswdErr = true;
        this.newPasswdMsg = '长度最多32个字符';
      } else if (!this.checkStrongRegExp(this.newPassword)) {
        this.newPasswdErr = true;
        this.newPasswdMsg = '不能包括空格，必须包含至少1个数字和1个字符';
      } else {
        if (this.newPassword.indexOf(' ') === -1) {
          this.newPasswdErr = false;

          // 旧密码与新密码一致
          if (this.newPassword === this.oldPassword) {
            this.newPasswdErr = true;
            this.newPasswdMsg = this.showdata.startMenuPart10 || '新密码不能与原始密码相同';
          } else {
            this.newPasswdErr = false;
          }

          // 新密码与确认密码不一致
          if (this.rePassword && this.newPassword !== this.rePassword) {
            this.rePasswdErr = true;
            this.rePasswdMsg = this.showdata.startMenuPart8 || '两次密码不一致';
          } else {
            this.rePasswdErr = false;
          }
        } else {
          this.newPasswdErr = true;
          this.newPasswdErr = this.showdata.startMenuPart9 || '输入的密码不能包括空格，必须包含至少1个数字和1个字符';
        }
      }
    } else {
      this.newPasswdMsg = '请输入新密码';
      this.newPasswdErr = true;
    }
  }

  checkRePassword(event: MouseEvent) {
    event.preventDefault();

    if (this.rePassword) {
      if ('minlength' == this.checkStrongminlength(this.newPassword)) {
        this.newPasswdErr = true;
        this.newPasswdMsg = '长度至少6个字符';
      } else if ('maxlength' == this.checkStrongmaxlength(this.newPassword)) {
        this.newPasswdErr = true;
        this.newPasswdMsg = '长度最多32个字符';
      } else if (!this.checkStrongRegExp(this.newPassword)) {
        this.newPasswdErr = true;
        this.newPasswdMsg = '不能包括空格，必须包含至少1个数字和1个字符';
      } else {
        if (this.rePassword.indexOf(' ') === -1) {
          this.rePasswdErr = false;

          if (this.rePassword !== this.newPassword) {
            this.rePasswdErr = true;
            this.rePasswdMsg = this.showdata.startMenuPart8 || '两次密码不一致';
          }
        } else {
          this.rePasswdErr = true;
          this.rePasswdMsg = this.showdata.startMenuPart9 || '输入的密码不能包括空格，必须包含至少1个数字和1个字符';
        }
      }
    } else {
      this.rePasswdErr = true;
      this.rePasswdMsg = '请确认新密码';
    }
  }

  updatePassword(event: MouseEvent) {
    event.preventDefault();

    if (!this.oldPassword) {
      this.oldPasswdErr = true;
      this.oldPasswdMsg = this.showdata.startMenuPart6 || '请输入原始密码';
      return false;
    } else {
      this.oldPasswdErr = false;
    }

    if (!this.newPassword) {
      this.newPasswdErr = true;
      this.newPasswdMsg = '请输入新密码';
      return false;
    } else if (this.newPassword.length < 6 || this.newPassword.length > 32) {
      this.newPasswdErr = true;
      this.newPasswdMsg = '长度限制在6-32位字符，支持字母、数字、英文符号';
      return false;
    } else if (this.newPassword.indexOf(' ') !== -1) {
      this.newPasswdErr = true;
      this.newPasswdMsg = this.showdata.startMenuPart9 || '输入的密码不能包括空格，必须包含至少1个数字和1个字符';
      return false;
    } else if (this.oldPassword === this.newPassword) {
      this.newPasswdErr = true;
      this.newPasswdMsg = this.showdata.startMenuPart10 || '新密码不能与原始密码相同';
      return false;
    } else if (!this.checkStrongRegExp(this.newPassword)) {
      this.newPasswdErr = true;
      this.newPasswdMsg = '不能包括空格，必须包含至少1个数字和1个字符';
      return false;
    } else {
      this.newPasswdErr = false;
    }

    if (!this.rePassword) {
      this.rePasswdErr = true;
      this.rePasswdMsg = '请确认新密码';
      return false;
    } else if (this.rePassword.length < 6 || this.rePassword.length > 32) {
      this.rePasswdErr = true;
      this.rePasswdMsg = '长度限制在6-32位字符，支持字母、数字、英文符号';
      return false;
    } else if (this.rePassword.indexOf(' ') !== -1) {
      this.rePasswdErr = true;
      this.rePasswdMsg = this.showdata.startMenuPart9 || '输入的密码不能包括空格，必须包含至少1个数字和1个字符';
      return false;
    } else if (this.rePassword !== this.newPassword) {
      this.rePasswdErr = true;
      this.rePasswdMsg = this.showdata.startMenuPart8 || '两次密码不一致';
      return false;
    } else if (!this.checkStrongRegExp(this.rePassword)) {
      this.rePasswdErr = true;
      this.rePasswdMsg = '不能包括空格，必须包含至少1个数字和1个字符';
      return false;
    } else {
      this.rePasswdErr = false;
    }

    const param = {
      oldPassword: this.service.encodersa(this.oldPassword),
      newPassword: this.service.encodersa(this.newPassword)
    };
    this.canSumbit = true;
    this.btnSumbitTxt = this.showdata.publicWaiting || '请求中';

    this.service
      .updataPasswd(param)
      .then(response => {
        this.msgService.success('密码修改成功!');
        this.canSumbit = false;
        this.btnSumbitTxt = this.showdata.publicSave || '保存';
        this.hidePasswdDialog();
        window.location.href = response + document.location.href;
      })
      .catch((err: any) => {
        this.canSumbit = false;
        this.btnSumbitTxt = this.showdata.publicSave || '保存';
        this.oldPasswdErr = true;
        this.oldPasswdMsg = '原密码错误';
      });
  }

  hidePasswdDialog() {
    this.passwdDialogShow = false;
    this.oldPassword = this.newPassword = this.rePassword = '';
    this.oldPasswdMsg = this.newPasswdMsg = this.rePasswdMsg = '';
    this.oldPasswdErr = this.newPasswdErr = this.rePasswdErr = false;
  }
}
