import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { SegmentCommunicationService } from "../../../../../../../../services/communication/segment.communication.service";
import { CreateSegmentAppCommunicationService } from "../../../../../../../../services/communication/create-segment-app.communication.service";

@Component({
	selector: 'app-push-piece',
	templateUrl: 'app-push-piece.component.html',
	styleUrls: ['app-push-piece.component.css'],
	providers: []
})


export class AppPushPieceComponent implements OnInit {
    appPush: any;
	piece: any = {
		flowCount: 100,
		type: 'A'
	};
 	pieceIndex: number;
	otherIndex: number;
	pieceList: any[];
	min: number = 5;
	max: number = 100;
	selectd: boolean = true;
	child3: boolean = false;

	@Input()
	set index(numb: any) {
		if (numb) {
			this.showPiece(numb);
		}
	}

	@Input()
	set showIndex(index: any) {//错误时，展示哪个AB
		if (index || typeof(index) == "number") {
			this.showPiece({},index);
		}
	}

	@Output() deletePiece = new EventEmitter<number>();

	constructor(
		private segmentCommunicationService: SegmentCommunicationService,
		private createSegmentAppCommunicationService: CreateSegmentAppCommunicationService
	) {
		let that = this;
		createSegmentAppCommunicationService.missionSelectFlowCount$.subscribe(data => {

			if (!segmentCommunicationService.segmentInfo) {
				segmentCommunicationService.segmentInfo = {};
			}
			if (!segmentCommunicationService.segmentInfo.platform) {
				segmentCommunicationService.segmentInfo.platform = 'android';
                segmentCommunicationService.segmentInfo.androidData = [];
				segmentCommunicationService.segmentInfo.androidData[data.index] = {};
				segmentCommunicationService.segmentInfo.androidData[data.index].groupOption = data.list[data.index].type;
			    that.appPush = segmentCommunicationService.segmentInfo.androidData;
			} else {
			    if (segmentCommunicationService.segmentInfo.platform == 'ios') {
                    if (!segmentCommunicationService.segmentInfo.iosData[data.index]) {
                        segmentCommunicationService.segmentInfo.iosData[data.index] = {};
                    }
                    that.appPush = segmentCommunicationService.segmentInfo.iosData;
                } else {
                    if (!segmentCommunicationService.segmentInfo.androidData[data.index]) {
                        segmentCommunicationService.segmentInfo.androidData[data.index] = {};
                    }
                    that.appPush = segmentCommunicationService.segmentInfo.androidData;
                }

                that.appPush[data.index].groupOption = data.list[data.index].type;
			}
			for (let i = 0; i < data.list.length; i++) {
                that.appPush[i].ratio = data.list[i].flowCount;
			}
			if ((that.pieceIndex || that.pieceIndex == 0) && that.pieceIndex != data.index) {
				that.selectd = false;
				that.pieceList = data.list;
				setTimeout(() => {
					that.piece.flowCount = (that.pieceList[that.pieceIndex] && that.pieceList[that.pieceIndex].flowCount) || that.piece.flowCount;
				}, 1);
			}
			setTimeout(function() {
				that.max = 100 - (data.list.length - 1) * that.min;
			}, 1);
		})
	}

	ngOnInit() {
	}

	//初始化展示AB内容
	showPiece(numb: any,index?: any) {
		if ((index || index == 0) && this.pieceIndex == index) {
			this.selectd = true;
			let json: any = {index: this.pieceIndex, list: this.pieceList};
			this.createSegmentAppCommunicationService.selectFlowCountMission(json);
		} else if (!index && index != 0) {
            let appPush: any;

			this.pieceIndex = numb.index;
			if (numb.index == 2) {
				this.child3 = true;
			}
            if (this.segmentCommunicationService.segmentInfo && this.segmentCommunicationService.segmentInfo.platform) {
			    if (this.segmentCommunicationService.segmentInfo.platform == 'ios') {
                    appPush = this.segmentCommunicationService.segmentInfo.iosData;
                } else {
                    appPush = this.segmentCommunicationService.segmentInfo.androidData;
                }
            }

			if (this.pieceIndex === 0) {
				this.piece.type = 'A';
				this.pieceList = [];
				if (this.segmentCommunicationService.segmentInfo && appPush) {
					this.piece.flowCount = appPush[0].ratio || 100;
				}
				this.pieceList.push(this.piece);
				let json: any = {index: this.pieceIndex, list: this.pieceList};
				this.createSegmentAppCommunicationService.selectFlowCountMission(json);
			} else if (this.pieceIndex === 1) {
				this.piece.type = 'B';
				this.pieceList = [{
					flowCount: 95,
					type: 'A'
				},{
					flowCount: 5,
					type: 'B'
				}];
				this.piece.flowCount = this.pieceList[this.pieceIndex].flowCount;
				if (this.segmentCommunicationService.segmentInfo
					&& appPush && appPush.length >= 2 && appPush[1].ratio) {
					this.piece.flowCount = appPush[1].ratio;
					this.pieceList[0].flowCount = appPush[0].ratio;
					this.pieceList[1].flowCount = appPush[1].ratio;
				}
				let json: any = {
					index: this.pieceIndex,
					list: this.pieceList
				};
				this.createSegmentAppCommunicationService.selectFlowCountMission(json);
			} else if (this.pieceIndex === 2) {
				this.piece.type = 'C';
				this.pieceList = [{
					flowCount: 90,
					type: 'A'
				},{
					flowCount: 5,
					type: 'B'
				},{
					flowCount: 5,
					type: 'C'
				}];
				this.piece.flowCount = this.pieceList[this.pieceIndex].flowCount;
				if (this.segmentCommunicationService.segmentInfo
					&& appPush && appPush.length == 3 && appPush[2].ratio) {
					this.piece.flowCount = appPush[2].ratio;
					this.pieceList[0].flowCount = appPush[0].ratio;
					this.pieceList[1].flowCount = appPush[1].ratio;
					this.pieceList[2].flowCount = appPush[2].ratio;
				}
				let firstJson: any = {
					index: this.pieceIndex,
					list: this.pieceList
				};
				this.createSegmentAppCommunicationService.selectFlowCountMission(firstJson);
			}
		}
	}

	changeFlowCount() {
		let growCount = this.piece.flowCount - this.pieceList[this.pieceIndex].flowCount;     //该次选择改变了多少流量
		let nextIndex = (this.pieceIndex + 1) >= this.pieceList.length ? 0 : this.pieceIndex + 1;
		//如果只有一个标签永远为100 不能改变
		if (nextIndex === this.pieceIndex) {
			this.piece.flowCount = 100;
			return ;
		}
		//如果有两个标签
		if (this.pieceList.length === 2) {
			this.pieceList[this.pieceIndex].flowCount = this.piece.flowCount;
			this.pieceList[nextIndex].flowCount = this.pieceList[nextIndex].flowCount - growCount;
			let json: any = {
				index: this.pieceIndex,
				list: this.pieceList
			};
			this.createSegmentAppCommunicationService.selectFlowCountMission(json);
		} else if (this.pieceList.length === 3) {   //如果有三个标签
			let otherIndex: number = (nextIndex + 1) >= this.pieceList.length ? 0 : nextIndex + 1;  //获取第三个标签的index
			//下个一个推送内容流量数量当前推送内容流量的增减范围
			if (this.pieceList[nextIndex].flowCount - growCount > 5 && this.pieceList[nextIndex].flowCount - growCount < 90) {
				this.pieceList[this.pieceIndex].flowCount = this.piece.flowCount;
				this.pieceList[nextIndex].flowCount = this.pieceList[nextIndex].flowCount - growCount;
				let json: any  = {
					index: this.pieceIndex,
					list: this.pieceList	
				};
				this.createSegmentAppCommunicationService.selectFlowCountMission(json);
			} else if (this.pieceList[nextIndex].flowCount - growCount <= 5) {  //下个一个推送内容流量数量不满足当前推送内容流量的增加的数量
				this.pieceList[this.pieceIndex].flowCount = this.piece.flowCount;
				this.pieceList[otherIndex].flowCount = this.pieceList[otherIndex].flowCount - (growCount - (this.pieceList[nextIndex].flowCount - 5));
				this.pieceList[nextIndex].flowCount = 5;
				let json: any = {
					index: this.pieceIndex,
					list: this.pieceList
				};
				this.createSegmentAppCommunicationService.selectFlowCountMission(json);
			} else if (this.pieceList[nextIndex].flowCount - growCount >= 90) { //下个一个推送内容流量数量不满足当前推送内容流量的减少的数量
				this.pieceList[this.pieceIndex].flowCount = 5;
				this.pieceList[otherIndex].flowCount = this.pieceList[otherIndex].flowCount + (this.pieceList[nextIndex].flowCount - growCount - 90);
				this.pieceList[nextIndex].flowCount = 90;
				let json: any = {
					index: this.pieceIndex,
					list: this.pieceList
				};
				this.createSegmentAppCommunicationService.selectFlowCountMission(json);
			}
		}
	}

	onSelect() {
		let that = this;
		that.selectd = true;
		let json: any = {
			index: that.pieceIndex,
			list: this.pieceList
		};
		that.createSegmentAppCommunicationService.selectFlowCountMission(json);
	}

	delete() {
		let that = this;
		that.deletePiece.emit(that.pieceIndex);
	}
}