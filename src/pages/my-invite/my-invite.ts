import { Component } from '@angular/core';
import { IonicApp, NavController, ModalController, Events, Nav, Platform } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { ActiveRulePage } from '../active_rule/active_rule';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
@Component({
	selector: 'page-my-invite',
	templateUrl: 'my-invite.html'
}) 
export class MyInvitePage {
	invite_greenArr: any = [];
	inviteNotice: string = '';
	userId: string = '';
	token: string = '';
	page:number = 0;//当前页码
	size:number = 100;//每页条数
	total: number = 0; //总条数
	status: number = -1; //0邀请好友注册 1邀请好友注册结束已中奖2邀请好友注册结束未中奖3邀请好友注册结束已兑换
	userInfo:any = {};
	phoneNumber:string = '';
	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		private ionicApp: IonicApp,
		public WxsharePage:WxsharePage
	) {
       this.initData();
	}
	
	showRule() {
         this.navCtrl.push(ActiveRulePage)
	}
	checkMask() {
		let activePortalArray = this.ionicApp._modalPortal._views;
		console.log(activePortalArray);
		if(activePortalArray.length > 0) {
			return false;
		} else {
			return true;
		}

	}
	login() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
				this.initData();
			}
		});
	}
	/*初始化数据*/
	initData() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		this.init()
	}
	init() {
		this.status = 0;
		let status = this.status;
		this.inviteNotice = status == 2 ? '加油哦~' : '好消息告诉小伙伴';
		this.invite_greenArr = [{
				top: '好友获得价值XXX元线上课程',
				bot: '你可以获得10元/20元/50元电话卡',
			},
			{
				top: '共获得11个好友',
				bot: '恭喜您获得11元电话卡1张'
			},
			{
				top: '共获得11个好友',
				bot: '很遗憾，您没有获得奖励！'
			},
			{
				top: '共获得11个好友',
				bot: '恭喜您获得11元电话卡1张'
			}
		];
		this.initGetData()
	}
	initGetData(){
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		this.comman.getUserInfo((success, data)=>{
			if(success){
				this.userInfo = data;
				this.getActivityData();
			}else{
				this.weui.showAlert("获取用户信息失败", data);
			}
		});
	}

	getActivityData(){
		this.phoneNumber = this.userInfo.phone;
		let param = {};
		param['activityId'] = '1';
		param['token'] = this.token; 
		param['userId'] = this.userId;
		param['page'] = this.page;
		param['size'] = this.size;
		this.comman.request("SA", "activityDetail", param, (data) => {
			if(data.code == 0) {
				// 待处理...
				// 待处理...
				// 待处理...
			} else {
				this.weui.showAlert("获取数据失败", data.msg, "确定");
			}
		}, (err) => {
			if(err == "ajaxError") {
				this.weui.showAlert("获取数据", "请手机检查网络", "确定");
			} else if(err == '10099') {
				this.weui.showAlert("获取数据", "登录已失效，请返回重新登录", "确定");

			}
		})
	}

	shareFn(mode){
		let shareURL = "http://my.saclass.com/app/new-Invitation.html?actId=1&userId=" + this.userId;
		let shareIcon = "http://my.saclass.com/share1to1/img/logo.png";
		let shareTitle =  '下载特优生App免费得299元在线课程';
		let summary = '特优生 · 为世界创造有用人才';
		this.WxsharePage.shareWx(
			shareTitle,
			summary,
			mode,
			shareURL,
			1,
			shareIcon,
			()=>{
		   		//
			}
		)
	}
	ionViewDidEnter() {
		
		
	}
}