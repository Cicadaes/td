import { Component, OnInit, Input, Output, Renderer2, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { PortalService } from './portal.service';
import { HttpHeaders } from '@angular/common/http';
import { portalPictureModel } from './portalPicture.model';
import { UserAccountModalComponent } from './user/user-account-modal/user-account-modal.component';
import { ResetPasswordModalComponent } from './user/reset-password-modal/reset-password-modal.component';
import { en_lang } from '../config/i18n/en';
import { zh_lang } from '../config/i18n/zh';
@Component({
  selector: 'lib-portal',
  templateUrl: `./portal.component.html`,
  styleUrls: ['./portal.component.less']
})
export class PortalComponent implements OnInit {
  navAppList = [];
  appNum = 0;
  _appCode = null;
  activeApp = null;
  _delayTimer = null;
  navDropdownShow = false;
  showData: any = zh_lang;
  hashTenant = false;
  _lang = 'zh';
  i18nData = {
    zh: { isLoad: false, data: {} },
    en: { isLoad: false, data: {} }
  };
  appConfig: any = {
    appCode: this._appCode,
    appName: '',
    authAppMap: {},
    user: {},
    authAppList: [],
    largeIcon: ''
  };
  isCollapsed = false;
  menuList = [];
  buttonList = [];
  menuUrl = null; // 菜单地址
  curUrl = null; // 当前路由地址
  _multiApp = true;
  _menuChange = true; // 菜单内容是否更新

  timer = null;
  @ViewChild('menuEl') menuEl: ElementRef;
  @ViewChild('libAccountModal') accountModal: UserAccountModalComponent;
  @ViewChild('libPasswordModal') passwordModal: ResetPasswordModalComponent;

  @Output() selectMenu = new EventEmitter<any>(); // 选中菜单
  @Output() selectApp = new EventEmitter<any>(); // 选中应用
  @Output() gotoProduct = new EventEmitter<any>(); // 返回应用列表
  @Output() goRuleSystem = new EventEmitter<any>(); // 权限管理
  portalPictureModel: portalPictureModel = new portalPictureModel();

  @Input()
  set multiApp(multiApp) {
    this._multiApp = multiApp;
  }

  @Input()
  set lang(_lang) {
    this._lang = _lang;
    this.getShowData();
  }

  @Input()
  set appCode(code) {
    this._appCode = code;
  }

  @Input()
  set curMenuUrl(url) {
    if (this.menuUrl !== url) {
      this.menuUrl = url;
      this.menuUrl && !this._menuChange && this.renderMenu(this.menuList, this.menuUrl);

      const tempMenuList = [].concat(this.menuList);
      if (url && url.indexOf('download-data') >= 0 && sessionStorage.getItem('reloadMenu')) {
        // 点击页面中下载按钮跳转后菜单重载
        this.menuList = [];
        setTimeout(() => {
          this.menuList = tempMenuList;
          this.activeMenuIntoView();
        }, 20);
      } else {
        this.activeMenuIntoView();
      }
    }
  }

  /**
   * 选中菜单进入视图
   */
  activeMenuIntoView() {
    setTimeout(() => {
      const activeMenuItem = document.querySelector('#menu-scroll .ant-menu-item-selected');
      activeMenuItem && activeMenuItem['scrollIntoViewIfNeeded']();
    }, 20);
  }

  @Input()
  set locationUrl(url) {
    this.curUrl = url;
    url && this.initLayout();
    this._appCode && this._menuChange && this.handleData();
  }

  // ngModel Access
  onChange: any = Function.prototype;
  onTouched: any = Function.prototype;

  constructor(private service: PortalService, private _render: Renderer2) {}

  ngOnInit() {
    window.onresize = (e: any) => {
      this.calculateNavHeight();
    };
  }

  initLayout() {
    // this.testAe = true;
    if ('tenant' === this._appCode) {
      this._render.setStyle(this.menuEl.nativeElement, 'width', '56px');
      this._render.removeClass(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'hide');
    } else if ('AEPLUS' === this._appCode) {
      this._render.removeClass(this.menuEl.nativeElement.querySelector('.top .logo'), '_logo');

      if (this.curUrl && this.curUrl.length > 0 && this.curUrl.indexOf('product-center') < 0) {
        this._render.removeClass(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'hide');
        if (1 === this.appNum || !this._multiApp) {
          this._render.setStyle(this.menuEl.nativeElement, 'width', '');
          this._render.addClass(this.menuEl.nativeElement.querySelector('.icon-left'), 'hide');
          this._render.setStyle(
            this.menuEl.nativeElement.querySelector('#menu-scroll'),
            'height',
            'calc(100% - 144px)'
          );
          this._render.setStyle(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'margin-left', '0');
        } else {
          this._render.setStyle(this.menuEl.nativeElement, 'width', '');
          this._render.removeClass(this.menuEl.nativeElement.querySelector('.icon-left'), 'hide');
          this._render.setStyle(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'margin-left', '56px');
          this._render.setStyle(
            this.menuEl.nativeElement.querySelector('#menu-scroll'),
            'height',
            'calc(100% - 100px)'
          );
        }
      } else {
        this._render.setStyle(this.menuEl.nativeElement, 'width', '56px');
        this._render.removeClass(this.menuEl.nativeElement.querySelector('.icon-left'), 'hide');
        this._render.addClass(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'hide');
        this._render.addClass(this.menuEl.nativeElement.querySelector('.top .logo'), '_logo');
      }
      this.calculateNavHeight();
    } else {
      this._render.removeClass(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'hide');
      if (this.appNum === 1) {
        this._render.addClass(this.menuEl.nativeElement.querySelector('.icon-left'), 'hide');
        this._render.setStyle(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'margin-left', '0');
        this._render.setStyle(this.menuEl.nativeElement.querySelector('#menu-scroll'), 'height', 'calc(100% - 100px)');
      } else {
        this._render.setStyle(this.menuEl.nativeElement, 'width', '256px');
        this._render.removeClass(this.menuEl.nativeElement.querySelector('.icon-left'), 'hide');
        this._render.setStyle(this.menuEl.nativeElement.querySelector('.menu-left-root'), 'margin-left', '56px');
        this._render.setStyle(this.menuEl.nativeElement.querySelector('#menu-scroll'), 'height', 'calc(100% - 100px)');
        this.calculateNavHeight();
      }
    }
  }

  calculateNavHeight() {
    const winHeight = window.innerHeight;
    const navHeight = winHeight - 130;
    this._render.setStyle(this.menuEl.nativeElement.querySelector('#nav-bar'), 'max-height', navHeight + 'px');
  }

  async handleData(): Promise<any> {
    this.getShowData();

    this.service
      .getAppConfig()
      .then(appconf => {
        if (appconf) {
          this.appConfig = appconf;
          this._appCode && (this.appConfig.appCode = this._appCode);

          this.menuList = appconf.menuList || [];
          this.buttonList = appconf.buttonList || [];
          this._handleAppByGroup(appconf.authAppList);

          if (appconf.token) {
            window.localStorage.setItem('token', appconf.token);
            this.service.headers = new HttpHeaders({
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST,GET,PUT,DELETE,OPTIONS',
              'Content-Type': 'application/json',
              'x-client-token': appconf.token
            });
          } else {
            window.localStorage.removeItem('token');
          }
          if (appconf.user && Object.keys(appconf.user).length) {
            window.localStorage.setItem('user', JSON.stringify(appconf.user));
          } else {
            window.localStorage.removeItem('user');
          }

          this.appConfig.appCode && this.getMenuList(this.appConfig.appCode);
        }
      })
      .catch(err => {});
  }

  _handleAppByGroup(list: any[]) {
    if (!list) {
      return;
    }
    this.navAppList = [];
    for (let i = 0; i < list.length; i++) {
      if ('tenant' !== list[i].appCode) {
        this.navAppList.push(list[i]);
        this.hashTenant = false;
      } else {
        this.hashTenant = true;
      }

      if (list[i].appCode == this.appConfig.appCode && list.length > 1) {
        this.appConfig.largeIcon = list[i].largeIcon;
      } else if (this._appCode) {
        this.appConfig.largeIcon = list[0].largeIcon;
      }
    }

    this.appNum = this.navAppList.length;
  }

  /**
   * 获取菜单
   */
  getMenuList(appCode) {
    this.service
      .getAppMenu(appCode)
      .then((data: any) => {
        this.menuList = [];
        this.buttonList = [];
        if (data && data.menuList) {
          this.curMenuUrl && this.curMenuUrl.indexOf('product-center') < 0 && (this._menuChange = false);
          this.menuList = data.menuList;
          this.buttonList = data.buttonList;
          if (this.menuList && this.menuList.length) {
            const arr = this.menuList[0];
            let obj = {};
            if (arr.childrens && arr.childrens.length) {
              obj = arr.childrens[0];
            } else {
              obj = arr;
            }
            this.pushMenuDetail(obj);
          }
          this.navChangeStatus();
          this.initLayout();
        }
      })
      .catch(err => {});
  }

  /**
   * 更新菜单状态
   */
  navChangeStatus() {
    const menuEl = this.menuEl && (this.menuEl.nativeElement as HTMLElement);
    this._render.removeClass(menuEl.querySelector('.logout'), 'active');
    if (this.navAppList.length > 1) {
      this._render.removeClass(menuEl.querySelector('#nav-bar .list'), 'active');
    }
    //针对刷新浏览器，自定义分析页面和 用户配置页面的菜单渲染问题
    const customReportInfo = localStorage.getItem('customReport') && JSON.parse(localStorage.getItem('customReport'));
    const dmpReport = localStorage.getItem('dmp') && JSON.parse(localStorage.getItem('dmp'));
    if (customReportInfo && customReportInfo.url) {
      this.renderMenu(this.menuList, this.menuUrl);
    } else if (dmpReport && dmpReport.url && dmpReport.url.split(';')[0]) {
      this.renderMenu(this.menuList, dmpReport.url.split(';')[0]);
    } else if (this.curUrl && this.curUrl.indexOf('studio') < 0) {
      this.renderMenu(this.menuList, this.menuUrl || this.curUrl);
    } else if (this.appNum == 1 || (this.appNum > 1 && this.appConfig.appCode != 'AEPLUS')) {
      let node;
      if (this.menuList[0].childrens && this.menuList[0].childrens.length) {
        node = this.menuList[0].childrens[0];
        this.menuList[0].opened = true;
      } else {
        node = this.menuList[0];
      }
      node.selected = true;
      this.renderMenu(this.menuList, this.menuUrl || node.resourceUri);
    }
  }

  /**
   * 高亮菜单
   */
  renderMenu(menuList: any, curUrl: any) {
    let match = false;
    if (!menuList || !menuList.length) {
      return false;
    }
    const len = menuList.length;
    for (let i = 0; i < len; i++) {
      if (menuList[i].childrens && menuList[i].childrens.length) {
        match = this.renderMenu(menuList[i].childrens, curUrl);
        if (match) {
          menuList[i].opened = true;
        } else {
          menuList[i].opened = false;
        }
      } else {
        if (curUrl && menuList[i].resourceUri === curUrl.split('?')[0]) {
          menuList[i].selected = true;
          match = true;
        } else {
          menuList[i].selected = false;
        }
      }
    }
    return match;
  }

  /**
   * 获取多语言数据
   */
  getShowData() {
    switch (this._lang) {
      case 'en':
        this.i18nData[this._lang].isLoad = true;
        this.i18nData[this._lang].data = this.showData = en_lang;
        break;
      default:
        this.i18nData[this._lang].data = this.showData = zh_lang;
        break;
    }
  }

  /**
   * 获取app的class
   * @param code 当前应用code
   */

  getAppLiCls(code: string) {
    return {
      active: this.appConfig && code === this.appConfig.appCode
    };
  }

  navAppCls(code: string) {
    return `icons-nav icon-nav-${code}`;
  }

  navMenuItemCls(item: any) {
    return {
      background: item.icon ? `url(${item.icon}) center center no-repeat` : 'none',
      backgroundSize: '16px 16px'
      // backgroundColor: 'red'
    };
  }
  navMenuItemClsem(item: any) {
    return {
      backgroundSize: '16px 16px'
      // backgroundColor: 'red'
    };
  }

  topstyle(): Object {
    let styles = {
      // 'overflow': 'hidden',
      padding: this.isCollapsed ? '0 20px' : '',
      width: this.isCollapsed ? 'auto' : '100%'
    };
    return styles;
  }

  lititle(): Object {
    let styles = {
      'margin-top': this.isCollapsed ? '- 4px !important' : '',
      'margin-bottom': this.isCollapsed ? ' -4px!important' : '',
      background: this.isCollapsed ? '#1F3159!important' : '',
      'border-radius': this.isCollapsed ? '5px!important' : '',
      color: this.isCollapsed ? ' #1890ff!important' : ''
    };
    return styles;
  }
  /**
   * 返回产品列表
   */
  goToProductList() {
    this.appNum = 0;
    // this._appCode = null;
    this.activeApp = null;
    this._delayTimer = null;
    this.navDropdownShow = false;
    this.showData = {};
    // this.appConfig = {
    //   appCode: "",
    //   appName: "",
    //   authAppMap: {},
    //   user: {},
    //   authAppList: [],
    //   largeIcon: ""
    // };

    this.isCollapsed = false;
    this.menuList = [];
    this.buttonList = [];
    this.menuUrl = null;
    this.curUrl = null;
    this.navAppList = [];
    this._menuChange = true;
    this.gotoProduct.emit();
  }

  /**
   * 鼠标hover应用菜单
   */
  onNavMouseEnter(app: any, event: any) {
    event.preventDefault();
    this.activeApp = app;
  }

  /**
   * 鼠标离开应用菜单
   */
  onNavMouseLeave(app: any, event: any) {
    event.preventDefault();
    this.activeApp = null;
  }

  /**
   * 选中某个应用
   * @param app 应用
   */
  navClick(app: any) {
    this.menuList = [];
    this.getMenuList(app.appCode);
    this.appConfig.largeIcon = app.largeIcon;
    this.appConfig.appCode = this._appCode = app.appCode;
    this.selectApp.emit(app);
  }

  /**
   * 选中应用下的某个菜单
   */
  selectItem(resourceUri: any, menuClick: boolean, menuArr: any, menuObj?: any) {
    this._menuChange = false;
    menuClick && sessionStorage.removeItem('reloadMenu');
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.pushMenuDetail(menuObj || menuArr);
      sessionStorage.setItem('menuUrl', resourceUri);
      this.selectMenu.emit({
        resourceUri: resourceUri,
        menuClick: menuClick,
        menuArr: menuArr,
        menuObj: menuObj
      });
    }, 200);
  }

  // 向后端传递当前菜单信息
  pushMenuDetail(obj: any) {
    const queryObj = {};
    if (!obj.rid || !obj.resourceName || !obj.appRid) {
      return;
    }
    queryObj['functionId'] = obj.rid;
    queryObj['functionName'] = obj.resourceName;
    queryObj['appId'] = obj.appRid;
    this.service
      .pushMenuDetail(queryObj)
      .then((data: any) => {})
      .catch(err => {});
  }

  toggleCollapsed(): void {
    if (this.isCollapsed) {
      if (this.appNum || !this._multiApp) {
        this._render.setStyle(this.menuEl.nativeElement, 'width', '200px');
      } else {
        this._render.setStyle(this.menuEl.nativeElement, 'width', '256px');
      }
    } else {
      this._render.setStyle(this.menuEl.nativeElement, 'width', 'auto');
    }
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * 点击账号菜单图标
   */
  showHideDropdown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.onTouched(); // set your control to 'touched'

    this.navDropdownShow = !this.navDropdownShow;
  }

  /**
   * 鼠标划入账户管理Tab
   * @param event 鼠标事件
   */
  onAccountMouseEnter(event: Event): void {
    if (this.navAppList) {
      event.preventDefault();
      event.stopPropagation();

      this.onTouched(); // set your control to 'touched'

      this.clearDelayTimer();

      this.navDropdownShow = true;
    }
  }

  /**
   * 鼠标划出账户管理Tab
   * @param event 鼠标事件
   */
  onAccountMouseLeave(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.delayInvisible(event);
  }

  clearDelayTimer(): void {
    if (this._delayTimer) {
      clearTimeout(this._delayTimer);
      this._delayTimer = null;
    }
  }

  delayInvisible(event: Event): void {
    this.clearDelayTimer();
    this._delayTimer = setTimeout(() => {
      this.navDropdownShow = false;

      this._delayTimer = null;
    }, 300);
  }

  /**
   * 账户管理
   */
  accountManage() {
    this.accountModal.userInfoshow = true;
    this.passwordModal.passwdDialogShow = false;
    this.appConfig = Object.assign({}, this.appConfig);
  }

  /**
   * 密码管理
   */
  managePassword() {
    this.accountModal.userInfoshow = false;
    this.passwordModal.passwdDialogShow = true;
    this.appConfig = Object.assign({}, this.appConfig);
  }

  /**
   * 权限管理
   */
  goToRuleSystem() {
    this.navDropdownShow = false;
    this.goRuleSystem.emit(true);
  }

  /**
   * 更新账户信息成功
   * @param $event
   */
  updateUser($event) {
    this.appConfig.user = $event;
    this.appConfig = Object.assign({}, this.appConfig);
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.service
      .logoutOneUI()
      .then((response: any) => {
        localStorage.clear();
        // 刷新页面
        window.location.href = response.redirectUrl + document.location.href;
      })
      .catch(err => {});
  }
  portalNavBackground() {
    let styles = {
      background: `url(${this.portalPictureModel.navImg}) no-repeat`
    };
    return styles;
  }
  portalSvgBackground() {
    let styles = {
      background: `url(${this.portalPictureModel.logoSvg})  no-repeat rgb(31, 49, 89)`,
      width: this.isCollapsed ? '33px' : '160px',
      margin: this.isCollapsed ? '16px 5px' : '16px 0 0 4px'
    };
    return styles;
  }
}
