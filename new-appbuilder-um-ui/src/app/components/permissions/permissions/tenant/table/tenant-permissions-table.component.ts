import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { permissionsService } from '../../permissions.service';
import { RoleListService } from '../../../../../@themes/transform-service';
import { NzModalService, NzNotificationService } from 'ng-cosmos-ui';

@Component({
	selector: 'tenant-permissions-table',
	templateUrl: './tenant-permissions-table.component.html',
	styleUrls: ['./tenant-permissions-table.component.css']
})

export class TenantPermissionsTableComponent implements OnInit, OnChanges {
	@Input() queryParams: any;
	@Input() tenantId: number = 0;
	@Input() reload: boolean = false;
	@Input() userId: number = 0;
	rolecode: any;
	isReloadUserTable: boolean = false;
	// @Input() role:any;
	role: any;
	isOper: boolean = false;

	roleIndex: number;
	isShowAddRoleModal: boolean = false;

	private nameList: any = [];

	_current = 1;
	_pageSize = 10;
	_total = 1;
	_dataSet: any = [];
	_loading = true;
	_sortValue: any = null;

	@Output()
	toEditorDataObj = new EventEmitter<any>();				// 去编辑数据对象页面

	constructor(
		private roleListSer: RoleListService,
		private service: permissionsService,
		private notificationService: NzNotificationService,
		private confirmServ: NzModalService, ) {
		this.getRoleCode();
	}

	sort(value: any) {
		this._sortValue = value;
		this.refreshData();
	}

	reset() {
		this.refreshData(true);
	}
	getRoleCode(): void {
		this.service.getRoleCode().then((roleCode: any) => {
			console.log(roleCode);
			// alert(roleCode);
			this.isOper = (roleCode === 'UM_OPER_ADMIN');
		}).catch((err: any) => {
			console.log(err);
		});
	}

	showEditRoleModal(role: any, roleIndex: number) {
		this.role = role;
		this.roleIndex = roleIndex;
		this.isShowAddRoleModal = true;
	}

	hideAddRoleModal(newRole: any) {
		this.isShowAddRoleModal = false;
	}

	refreshData(reset = false) {
		if (!this.tenantId) {
			return;
		}
		if (reset) {
			this._current = 1;
		}
		let param = {
			tenantId: this.tenantId,
			page: this._current || 1,
			pageSize: this._pageSize
		}
		this.service.queryTenantRolesByPage(param).then((data: any) => {
			if(data.code === 200){
				data = data.data;
				this._dataSet = data.data;
				this._total = data.total
				this.setNameList(this._dataSet)
				this._loading = false;
			} else {
				this.notificationService.warning('warning', data['message']);
			}
		});
	}

	onSubmitUserFormData(params: boolean) {
		this.isReloadUserTable = params || false;
		this.refreshData();
	}

	ngOnChanges(changes: SimpleChanges) {

		if (changes.queryParams) {
			this.queryParams = changes.queryParams.currentValue || {};
		} else {
			this.queryParams = {};
		}
		if (changes.reload) {
			this.reload = changes.reload.currentValue || false;
		} else {
			this.reload = false;
		}

		if (this.reload == true) {
			this.refreshData();
		} else {
			this.reset();
		}
	}

	ngOnInit() {
		this.rolecode = window['appConfig'].rolecode;
	}

	setNameList(data: any) {
		this.nameList = ''
		if (data && data.length) {
			this.nameList = data.map((item: any) => {
				return item.name
			})
		}
	}

	/**
	 * 编辑数据对象
	 * @param data 
	 */
	editorDataObj(data: any) {
		this.toEditorDataObj.emit(data);
	}

	/**
	 * 删除数据对象
	 * @param data 
	 */
	deleteDataObj(data: any) {
		this.confirmServ.confirm({
			nzMaskClosable: false,
			nzTitle: '您确定要刪除\'' + data.name + '\'吗？',
			nzOnOk: () => {
				this.service.deleteDataObj(data.id).then((response: any) => {
					if (response['code'] === 200) {
						this.refreshData();
					} else {
						this.notificationService.warning('warning', response['message']);
					}
				});
			}
		});
	}

}
