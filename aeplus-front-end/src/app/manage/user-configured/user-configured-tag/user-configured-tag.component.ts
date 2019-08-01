import {Component, Injector, ViewChild, OnInit, OnChanges} from '@angular/core';
import {UserConfiguredService} from '../user-configured.service';
import {BaseComponent} from '../../../common/base-component';

@Component({
    selector: 'app-user-configured-tag',
    templateUrl: './user-configured-tag.component.html',
    styleUrls: ['./user-configured-tag.component.less']
})
export class UserConfiguredTagComponent extends BaseComponent implements OnInit, OnChanges {
    @ViewChild('myInput') input;
    tabList: any = [
        {
            url: '/manage/user-configured/crowd',
            name: '用户分群配置'
        }, {
            url: '/manage/user-configured/insight',
            name: '用户洞察配置'
        }, {
            url: '/manage/user-configured/tag',
            name: '自定义标签管理'
        }
    ];

    tagCategoryList: any = [];         // 左侧菜单列表
    tagCategoryIndex: number;
    tagCategoryKeyword: string;
    _newTagCategoryName: string;
    _currentTagCategory: any;
    _isShowNewTagCategory: boolean;
    containerStyle: any;            // 根据页面高度渲染左边的菜单
    _appConfig: any;
    _tenantAdmin: boolean;

    constructor(private userConfiguredService: UserConfiguredService,
                private injector: Injector) {
        super(injector);
    }

    queryAppConfig() {
        this.userConfiguredService.getAppConfig().subscribe((response: any) => {
            this._appConfig = response || {};
            if (this._appConfig && this._appConfig.user && this._appConfig.user.tenantAdmin) {
                this._tenantAdmin = this._appConfig.user.tenantAdmin;
            }
        });
    }

    newCreateTagCategory() {
        this._isShowNewTagCategory = true;
        this.hideAllTagCategoryEdit();
        this._setInputFocus();
    }

    cancelEdit() {
        this.hideAllTagCategoryEdit();
    }

    _setInputFocus() {
        setTimeout(() => {
            this.input.nativeElement.focus();
        }, 100);
    }

    resetInputValue() {
        this._newTagCategoryName = '';
        this._isShowNewTagCategory = false;
//                this.tagCategoryKeyword = '';
    }
    replaceTagCategory(){
        this._newTagCategoryName =  this.globals.trimTag(this._newTagCategoryName);
    }

    replaceEditTagCategory(item: any){
        item.newName =  this.globals.trimTag(item.newName);
    }

    blurNewTagCategory() {
        if (this._newTagCategoryName) {
            this._saveNewTagCategory();
        } else {
            this.resetInputValue();
        }
    }

    blurEditTagCategory(item: any) {
        if (item.newName) {
            this._saveEditTagCategory(item);
        } else {
            this.hideTagCategoryEdit(item);
        }
    }

    _saveEditTagCategory(item: any) {
        const params = {
            productId: this.productId,
            name: item.newName,
            id: item.id,
            parentId: 0,
            tagId: 0
        };
        this.userConfiguredService.editTagCategory(params, item).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.modalService.success({
                    nzTitle: '提示',
                    nzContent: '标签分类"' + params.name + '"编辑成功'
                });
                this.queryTagCategoryList(false);
                this.hideTagCategoryEdit(item);
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: response.message
                });
            }
        });
    }

    _saveNewTagCategory() {
        const params = {
            productId: this.productId,
            name: this._newTagCategoryName,
            parentId: 0,
            tagId: 0
        };
        this.userConfiguredService.createTagCategory(params).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.modalService.success({
                    nzTitle: '提示',
                    nzContent: '标签分类"' + params.name + '"创建成功'
                });
                this.queryTagCategoryList(false);
                this.resetInputValue();
                this._currentTagCategory = response.data;
                this.tagCategoryIndex = 2;
                this.storageLocalTagCategory();
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: response.message
                });
            }
        });
    }

    _onSearchTagCate(value: any) {
        this.tagCategoryKeyword = value || '';
        this.queryTagCategoryList(false);
    }

    checkTagCategory(item: any, index: number) {
        this.hideAllTagCategoryEdit();
        this._currentTagCategory = item;
        this.tagCategoryIndex = index;
        this.storageLocalTagCategory();
    }

    storageLocalTagCategory() {
        if (this._currentTagCategory) {
            this._currentTagCategory['productId'] = this.productId;
            this.globals.setStorageLocal('user-configured-tag-category', this._currentTagCategory);
        }
    }

    mouseoverTagCategory(item: any) {
        item.isShowOperator = true;
    }

    mouseleaveTagCategory(item: any) {
        item.isShowOperator = false;
    }

    hideAllTagCategoryEdit() {
        if (this.tagCategoryList && this.tagCategoryList.length > 0) {
            for (let i = 0; i < this.tagCategoryList.length; i++) {
                this.tagCategoryList[i].isEdit = false;
            }
        }
    }
    showTagCategoryEdit(item: any) {
        item.newName =  item.name;
        this.hideAllTagCategoryEdit();
        item.isEdit = true;
        this._setInputFocus();
    }

    hideTagCategoryEdit(item: any) {
        item.isEdit = false;
    }

    removeTagCategory(item: any) {
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: '确定要删除标签分类"' + item.name + '"吗？',
            nzOnOk: () => {
                this.deleteTagCategory(item);
            }
        });
    }

    deleteTagCategory(data: any) {
        this.userConfiguredService.delTagCategory(data).subscribe((response: any) => {
            if (response && response.code === 200) {
                // this.modalService.success({
                //     nzTitle: '提示',
                //     nzContent: '标签分类"' + data.name + '"删除成功'
                // });
                this._currentTagCategory = this.tagCategoryList[0];
                this.tagCategoryIndex = 0;
                this.storageLocalTagCategory();
                this.queryTagCategoryList(true);
                this.resetInputValue();
            } else {
                this.modalService.warning({
                    nzTitle: '提示',
                    nzContent: response.message
                });
            }
        });
    }

    queryTagCategoryList(init: boolean) {
        const params = {
            productId: this.productId,
            name: this.tagCategoryKeyword
        };
        this.userConfiguredService.queryTagCategories(params).subscribe((response: any) => {
            if (response && response.code === 200) {
                this.tagCategoryList = response.data.data;
                if (init && this.tagCategoryList && this.tagCategoryList.length > 0) {
                    const tagCategory = this.globals.getStorageLocal('user-configured-tag-category');
                    if (tagCategory && this.productId === tagCategory.productId) {
                        this._currentTagCategory = tagCategory;
                        this._changeTagCategoryIndex();
                    } else {
                        this._currentTagCategory = this.tagCategoryList[0];
                        this.tagCategoryIndex = 0;
                        this.storageLocalTagCategory();
                    }
                } else {
                    this.checkTagCategory(this.tagCategoryList[1],1)
                    this._changeTagCategoryIndex();
                }
            }
        });
    }

    _changeTagCategoryIndex() {
        if (this._currentTagCategory && this.tagCategoryList && this.tagCategoryList.length > 0) {
            for (let i = 0; i < this.tagCategoryList.length; i++) {
                if (this._currentTagCategory.id === this.tagCategoryList[i].id) {
                    this.tagCategoryIndex = i;
                    break;
                }
            }
        }
    }

    _onLoadTagCate(value: any) {
        if (value) {
            this.queryTagCategoryList(false);
        }
    }

    ngOnInit() {
        this.queryAppConfig();
        this.queryTagCategoryList(true);
        this.calContainerStyle();
    }

    calContainerStyle(): void {
        this.containerStyle = {
            height: window.innerHeight - 85 - 32 - 49 - 110 + 'px'
        };
    }
}
