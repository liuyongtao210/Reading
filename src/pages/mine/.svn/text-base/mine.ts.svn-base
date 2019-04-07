import { Component } from '@angular/core';
import { IonicApp, NavController, ModalController, Events, Platform } from 'ionic-angular';
import { ChangePwdPage } from '../changePwd/changePwd';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { PunchCardPage } from '../punchCard/punchCard';
import { wordBookPage } from '../wordBook/wordBook';
import { MyBookPage } from '../my-book/my-book';
import { MyFollowPage } from '../my-follow/my-follow'; 
//import { CoursePage } from '../course/course';
import { personalDataPage } from '../personal-data/personal-data';
import { MyInvitePage } from '../my-invite/my-invite';
import { CoursesPaidPage } from '../courses_paid/courses_paid';
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/storage';
import { H5DetailPage } from '../h5-detail/h5-detail';
 
@Component({
	selector: 'page-mine',
	templateUrl: 'mine.html'
})
export class MinePage {
	currVersion:number = 2.0;//当前版本号
	isLogin: boolean = false; //默认没登录
	avatar: string = 'assets/imgs/mine/mine-avatar.png';
	name: string = '';
	userId: string = '';
	token: string = '';
	isPunchCard: boolean = false; //默认未打卡
	firstLoadedData: boolean = false;
	versionInfo: string = ''; //版本信息
	constructor(
		private callNumber: CallNumber,
		public events: Events,
		public modalCtrl: ModalController,
		private plt: Platform,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		private storage: Storage,
		private ionicApp: IonicApp,
	) {
		//监听用户信息改变事件
		this.events.subscribe("userinfo-updated", (data)=>{
			this.avatar = data.userImg;
			if(data.NickName!=""){
				this.name = data.NickName;
			}else{
				this.name = data.name;
			}
		})
	}
	goCoursePaid() {
		if(this.isLogin) {
			this.navCtrl.push(CoursesPaidPage);
		} else {
			this.login();
		}
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
	callNow_(){
		// if(this.plt.is("cordova")) {
		// 	this.callNumber.callNumber("18515159491", true);
		// }
		if(this.isLogin) {
			var contactUrl = "http://vipwebchat.tq.cn/pageinfo.jsp?version=vip&admiuin=9696598&ltype=1&iscallback=1&page_templete_id=92027&is_message_sms=0&is_send_mail=3&action=acd&acd=1&type_code=1";
			this.navCtrl.push(H5DetailPage, {title:"在线咨询", url:contactUrl});
		} else {
			this.login();
		}
	}

	checkVerson(){
	  if(this.plt.is("android")) {
	      this.getVersion(1)	
	 }else if(this.plt.is("ios")){
	 	  this.getVersion(2)
	 }else{
	 	let options = {
	 		position: "middle"
	 	}
	 	this.weui.showToast('请使用手机', options);
	 }
	}
	getVersion(platform){
		let param = {};
		let myLoading: any = this.weui.showLoading("信息获取中");
		param['platform'] = platform;
		 this.comman.request("SA", "getVerison", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				console.log(data);
				let version = Number(data.version);
				if(this.currVersion < version){
					this.weui.showAlert("当前版本不是最新版本", '建议您更新到最新版，更多精彩内容为您呈现。', "取消","更新",()=>{}, ()=>{
						alert("去更新");
						if(platform == 1){ //安卓
							//http://files.specialaedu.com/files/work/app/originalreading.apk
						}else if(platform == 2){
							//https://itunes.apple.com/us/app/%E7%89%B9%E4%BC%98%E7%94%9F-%E4%B8%BA%E4%B8%96%E7%95%8C%E5%88%9B%E9%80%A0%E6%9C%89%E7%94%A8%E4%BA%BA%E6%89%8D/id1435748862?l=zh&ls=1&mt=8
						}
					});
				}else{
					this.weui.showAlert("当前版本为最新版本", '无需更新，敬请期待更多精彩内容', "确定");
				}
				
			} else {
				this.weui.showAlert("信息获取失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}

			}
		})	
	}
	/*测试*/
	goCourse() {
		// 	 this.navCtrl.push(CoursePage)
	}
	goMyInvite() {
		if(this.isLogin) {
			this.navCtrl.push(MyInvitePage);
		} else {
			this.login();
		}
	}
	goAttention() {
		if(this.isLogin) {
			this.navCtrl.push(MyFollowPage); 
		} else {
			this.login();
		}
	}

	goCollection() {
		if(this.isLogin) {
			this.navCtrl.push(MyBookPage);
		} else {
			this.login();
		}
	}

	goPersonalData() {
		if(this.isLogin) {
			this.navCtrl.push(personalDataPage);
		} else {
			this.login();
		}
	}
	/*测试*/
	checkUserInfo() {
		var userId = this.comman.getGlobal("userId");
		var token = this.comman.getGlobal("token");
		console.log(userId);
		console.log(token);
		if(userId == "" || userId == null || userId == undefined || token == "" || token == null || token == undefined) {
			this.firstLoadedData = false;
			this.login();
		} else {
			this.isLogin = true;
			this.initData();
		}
	}
	login() {
		this.name = '';
		this.avatar = 'assets/imgs/mine/mine-avatar.png';
		this.isLogin = false;
		this.isPunchCard = false;
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data) => {
			console.log(data)
			if(data.isLogin) {
				this.userId = this.comman.getGlobal("userId");
				this.token = this.comman.getGlobal("token");
				this.isLogin = true;
				this.firstLoadedData = true;
				this.initData(); //更新数据
			}
		});
	}

	//进入生词本
	goWordBook() {
		if(this.isLogin) {
			this.navCtrl.push(wordBookPage);
		} else {
			this.login();
		}

	}

	//进入打卡页面
	goPunchCard() {
		if(this.isLogin) {
			this.navCtrl.push(PunchCardPage);
		} else {
			this.login();
		}
	}
	//退出登录
	exit() {
		if(this.isLogin) {
			this.weui.showAlert("确定退出吗？", "退出登录后将无法查看精彩内容", "取消", "确定", ()=>{}, ()=>{
				this.storage.remove("userId");
				this.storage.remove("token");
				this.name = '';
				this.avatar = 'assets/imgs/mine/mine-avatar.png';
				this.isLogin = false;
				this.isPunchCard = false;
				this.comman.clearGlobal();
				this.events.publish('login-state-change', false);
				this.firstLoadedData = false;
				this.login();
			})
		} else {
			this.login();
		}
	}

	//初始化函数
	initData() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		// let myLoading: any = this.weui.showLoading("信息获取中");
		let param = {
			userId: this.userId,
			token: this.token,
			type: 3
		};

		this.comman.request("TalkCatUser", "getUserInfo", param, (data) => {
			// this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				console.log(data)
				//把用户数据塞进Global
				this.comman.setGlobal({
					userInfoMine:data
				})
				this.avatar = data.icon ? data.icon : 'assets/imgs/mine/mine-avatar.png';
				this.name = (data.nickName==undefined || data.nickName=="") ? data.name : data.nickName;
				this.isPunchCard = data.todaySign
			} else {
				this.firstLoadedData = false;
				this.weui.showAlert("信息获取失败", data.msg, "确定");
			}
		}, (err) => {
			this.firstLoadedData = false;
			// this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}

			}
		})
	}
	/*进入修改密码页*/
	goChangePw() {
		if(this.isLogin) {
			this.navCtrl.push(ChangePwdPage);
		} else {
			this.login();
		}
	}

	//图片加载失败时触发
	errFn(e) {
		console.log(e)
		this.avatar = 'assets/imgs/mine/mine-avatar.png';
	}
	upData() {
		this.isPunchCard = true;
	}

	ionViewDidEnter() {
		if(!this.firstLoadedData) {
			this.firstLoadedData = true;
			this.checkUserInfo()
		}
	}
}