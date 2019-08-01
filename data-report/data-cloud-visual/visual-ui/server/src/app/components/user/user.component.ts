import {Component, OnInit} from '@angular/core';
import {UserResourceService} from '../../services/user.resource.service';
import {UserCommunicationService} from "../../services/user.communication.service";
import {AppCommunicationService} from "../../services/app.communication.service"
import { Message } from 'primeng/primeng';

@Component({
  selector: 'my-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css'],
  providers: [UserResourceService]
})

export class UserComponent implements OnInit {
  private userName: string
  private display: boolean = false;
  private passwordData: string = "";//原始密码
  private userpassword: string = "";//新密码
  private userpasswordTrue: string = "";//再次新密码
  private userTips: any;
  msgs: Message[] = [];
  constructor(
    public appCommunicationService: AppCommunicationService,
    private UserResourceService: UserResourceService,
    private UserCommunicationService: UserCommunicationService) {
    this.UserCommunicationService.missionMessage$.subscribe(msg => {
      this.msgs = []
      this.msgs.push(msg)
    })
  }


  ngOnInit() {
    this.userMessage();
  }

  //user
  userMessage() {
    this.UserResourceService.query()
      .then((data: any) => {
        this.userName = data.userName;
        if (data.userName) {
          this.appCommunicationService.loginSuccessMission(true)
        }


        this.UserCommunicationService.currentUserName = this.userName;
        this.UserCommunicationService.currentUserFullId = data.loginUser;
        this.UserCommunicationService.currentUserId = data.loginUser.replace(/@.*$/, "");
        this.UserCommunicationService.privilegeConfirmMission(data.privilegeList);
        this.UserCommunicationService.userAfterTreeMission();
        this.appCommunicationService.allModulePermissions = data
        this.appCommunicationService.btnlistPermissions = this.getBtnPermissions(data)
        // console.log(this.appCommunicationService.btnlistPermissions)
        this.appCommunicationService.announceModulePermissions({ modulePermissions: data, btnlistPermissions: this.getBtnPermissions(data) })


      }).catch(err => console.log(err))
  }

  getBtnPermissions(permissions: any) {
    return permissions.buttonList.map((item: any) => {
      return item.resourceId
    })
  }

  //退出
  layoutUser() {
    this.UserResourceService.logout()
      .then(data => {
        document.location.href = data.logOutUrlPrefix + document.location.origin + data.redirect + document.location.href
      }).catch(err => console.log(err))
  }

  //修改密码
  revisePassword() {
    this.display = true;

    this.passwordData = '';
    this.userpassword = '';
    this.userpasswordTrue = '';
    this.userTips = '';
  }

  //判断
  passwordFromData() {
    function getStringLen(_value: any) {
      var i, sum;
      sum = 0;
      for (i = 0; i < _value.length; i++) {
        if ((_value.charCodeAt(i) >= 0) && (_value.charCodeAt(i) <= 255)) {
          sum = sum + 1;
        }
        else {
          sum = sum + 2;
        }
      }
      return sum;
    }

    if (this.passwordData == '' || this.passwordData == '输入原始密码（6-32位）') {
      this.userTips = "原始密码不能为空";
      return false;
    }
    if (this.userpasswordTrue !== this.userpassword) {
      this.userTips = "新密码不一致请重新输入";
      return false;
    }
    if (getStringLen(this.userpassword) < 6 || getStringLen(this.userpassword) > 32) {
      this.userTips = "密码长度需在6-32位";
      return false;
    }
    return true;
  }

  iptHidden() {
    this.userTips = '';
  }

  //确定
  confirm() {
    if (!this.passwordFromData()) {
      return;
    }

    function encode64(input: any) {
      var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
        + "wxyz0123456789+/" + "=";
      var output = "";
      var chr1, chr2, chr3: any;
      var enc1, enc2, enc3, enc4: any;
      var i = 0;
      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
          + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    }

    this.UserResourceService.create({ oldPassword: encode64(this.passwordData), newPassword: encode64(this.userpasswordTrue) })
      .then(data => {
        console.log(data)
        this.userpassword = this.userpasswordTrue = data;
        this.display = false;
        this.UserCommunicationService.addMessage({ severity: 'success', summary: '修改密码成功', detail: '' })
      }).catch(error => this.userTips = "原始密码错误，请重新输入")
  }
}
