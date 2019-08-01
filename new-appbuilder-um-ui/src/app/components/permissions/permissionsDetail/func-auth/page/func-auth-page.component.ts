import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { funcAuthPageService } from './func-auth-page.service';
import { NzModalService } from 'ng-cosmos-ui';

@Component({
	selector: 'func-auth-page',
	templateUrl: './func-auth-page.component.html',
	styleUrls: ['./func-auth-page.component.css'],
	providers: [FormBuilder]
})

export class funcAuthPageComponent implements OnInit {

	constructor(private fb: FormBuilder, private confirmServ: NzModalService, private service: funcAuthPageService, private activatedRoute: ActivatedRoute, private router: Router) {

	}
	searchOptions: any = [];
	selectedMultipleOption: any = [];
	@Input() tenantId: any = [];
	@Input() targetId: any = [];
	@Input() nodeInfo: any = {}; // 点击树节点的数据
	@Input() chanNodeFlag: number;
	storeNodeData: any = {};
	ngOnInit() {
		// 列表参数示例
		/*  this.selectedMultipleOption = ['jack'];
			this.searchOptions = [{
				value: 'jack',
				label: '杰克'
			}];
			
		*/
		let params: any = {};
		params.page = 1;
		params.rows = 9999;
		params.tenantId = this.tenantId;
		this.service.getRole(params).then((data: any) => {
			// console.log('角色',data);
			if (data.success && data.data) {
				if (this.searchOptions && this.searchOptions.length > 0) {
					this.searchOptions.splice(0, this.searchOptions.length);
				}
				data.data.forEach((item: any) => {
					item.value = item.name;
					item.label = item.name;
					this.storeNodeData[item.name] = item.id;
					this.searchOptions.push(item);
				});
			}
		});
	}
	ngOnChanges(changes: SimpleChanges) {
		if (changes.nodeInfo && !changes.nodeInfo.firstChange) { // 切换节点
			let params: any = {};
			params.dataId = changes.nodeInfo.currentValue.dataId;
			params.targetId = this.targetId;
			params.tenantId = this.tenantId;
			this.selectedMultipleOption = [];
			this.service.queryNodeInfo(params).then((data: any) => {
				if (data.success && data.data) {
					let tempList = data.data.roleRels;
					let tempChosen: any = [];
					if (tempList && tempList.length > 0) {
						tempList.forEach((item: any) => {
							item.value = item.umRoleName;
							item.label = item.umRoleName;
							tempChosen.push(item.umRoleName);

						});
						this.selectedMultipleOption = tempChosen;
					}
				}

			});

		}
	}
	showDialog(msg: any) {
		this.confirmServ.warning({
			nzTitle: msg,
			nzOnCancel: () => {
			}
		});
	}
	handleOk() {
		let params: any = {};
		params.dataId = this.nodeInfo.dataId;
		params.dataName = this.nodeInfo.dataName;
		params.targetId = this.targetId;
		params.tenantId = this.tenantId;
		params.roleRels = [];
		this.selectedMultipleOption.forEach((item: any) => {
			params.roleRels.push({ "umRoleId": this.storeNodeData[item] })
		});

		this.service.saveRole(params).then((data: any) => {
			if (data.success) {
				this.showDialog(data.data);
			} else {
				this.showDialog('授权失败');
			}

		});

	}

}
