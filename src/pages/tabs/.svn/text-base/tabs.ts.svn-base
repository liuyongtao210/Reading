import { Component,ViewChild } from '@angular/core';
import { IonicApp,Platform,NavController,ModalController,Events,Tabs,App } from 'ionic-angular';

import { ReadPage } from '../read/read';
import { LiveListPage } from '../live-list/live-list';
import { CourseListPage } from '../course-list/course-list';
import { MinePage } from '../mine/mine';
import { HomePage } from '../home/home';
import { LoginModal } from '../modal-login/modal-login';

import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { CheckVModel } from '../tabs/checkVModel';
import { UmengModel } from '../../model/umengModel/umengModel';
import { JumpModel } from '../../model/jumpModel/JumpModel';

declare var MyFunctionPlugins: any; //使用自定义插件

@Component({
	selector:"page-tabs",
	templateUrl: 'tabs.html'
})
export class TabsPage {
	@ViewChild('indexTabs') tabRef: Tabs;

	tab1Root = HomePage;
	tab2Root = ReadPage;
	tab3Root = CourseListPage;
	tab4Root = LiveListPage;
	tab5Root = MinePage;
	backButtonPressed: boolean = false;
	showAdvert: boolean = false;
	advertData: any = {};
	showReadTip: boolean = false;

	constructor(
		public app:App,
		public navCtrl: NavController,
		public events: Events,
		public modalCtrl: ModalController,
		public platform: Platform,
  		private ionicApp:IonicApp,
		private comman: commanModel,
		private weui: WeuiModel,
		public cvm:CheckVModel,
		private umeng:UmengModel,
		private jump: JumpModel
	) {
		try {
			//this.checkV();
			if(this.platform.is('android')) {
				MyFunctionPlugins.coolMethod("addPermission", (msg) => {
					
				});
			}
		} catch(e) {
			
		}
		events.subscribe('tabSelect', (index) => {
			this.tabRef.select(index);
		});
		// events.subscribe('loginSuccess', (index) => {
		// 	this.getUserInfo();
		// });
		this.checkUserInfo();
		//监听首页插屏数据加载事件: home-advert-loaded
		this.events.subscribe("home-advert-loaded", (data)=>{
			console.log("*** 首页插屏数据加载事件 ***", data);
			this.advertData = data;
			this.showAdvert = true;
		})
		//监听阅读提示事件: home-advert-loaded
		this.events.subscribe("read-pull-tip", ()=>{
			console.log("*** 阅读提示事件 ***");
			this.showReadTip = true;
		})
		//监听App的后台/激活事件
		this.platform.pause.subscribe(()=>{
			this.events.publish("app-pause");
		})
		this.platform.resume.subscribe(()=>{
			this.events.publish("app-resume");
		})
	}

	onReadTipTap(){
		this.showReadTip = false;
	}

	onTabChange(event){
		let tabName = ["首页", "阅读", "课程", "云讲堂", "我的"];
		if(this.platform.is("cordova")) {
			this.umeng.onEvent("tab_active",tabName[event.index]);
		}
	}

	onImgTap(){
		this.showAdvert = false;
		this.jump.jumpTo(this.advertData.jumpType, this.advertData.path, "");
	}

	onCloseTap(){
		this.showAdvert = false;
	}

	getUserInfo(){
		let param = {
			userId: this.comman.getGlobal("userId"),
			token: this.comman.getGlobal("token"),
			type:3
		};
		this.comman.request("TalkCatUser", "getUserInfo", param, (data) => {
			if(data.code == 0) {
				var userInfo={
					userName:data.name,
					userIcon:data.icon ? data.icon : '../assets/imgs/mine/default_avatar.png',
					userTelphone:data.telphone
				}
				this.comman.setGlobal(userInfo);
			}
		}, (err) => {})
	}
	checkUserInfo() {
		var userId = this.comman.getGlobal("userId");
		var token = this.comman.getGlobal("token");
		console.log(userId);
		console.log(token);
		if(userId == "" || userId == null || userId == undefined || token == "" || token == null || token == undefined) {
//			this.goLogin();
			this.comman.setGlobal({
				userId: "",
				token: ""
			});
		}else{
			//this.getUserInfo();
		}
	}
	goLogin() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {});
		loginModalCtrl.present();
	}
	checkMask(){
		// this.ionicApp._toastPortal.getActive() || this.ionicApp._loadingPortal.getActive() || this.ionicApp._overlayPortal.getActive()
        let activePortalArray = this.ionicApp._modalPortal._views;
        let toastPortalArray = this.ionicApp._toastPortal._views;
        let loadingPortalArray = this.ionicApp._loadingPortal._views;
        let overlayPortalArray = this.ionicApp._overlayPortal._views;
        console.log(this.ionicApp);
        let canGoBack = true;
       	if (activePortalArray.length>0) {
       		this.dismissMask(activePortalArray);
       		canGoBack = false;
       	}
       	if (toastPortalArray.length>0) {
			if(this.navCtrl.length()>1){
	       		this.dismissMask(toastPortalArray);
	       		canGoBack = false;
			}
       	}
       	if (loadingPortalArray.length>0) {
       		this.dismissMask(loadingPortalArray);
//     		canGoBack = false;
       	}
       	if (overlayPortalArray.length>0) {
       		this.dismissMask(overlayPortalArray);
       		canGoBack = false;
       	}
       	return canGoBack;
		
	}
	dismissMask(maskArray){
		for(var i=0;i<maskArray.length;i++){
			maskArray[i].dismiss().catch(() => {});
		}
	}
	addRegist(){
		this.platform.registerBackButtonAction(()=>{
			let canGoBack = this.checkMask();
			if(canGoBack){
//				this.navCtrl.length()>1 ? this.navCtrl.pop() : this.showExit();
      			let activeNav: NavController = this.app.getActiveNav();
				activeNav.canGoBack() ? activeNav.pop() : this.showExit();
			}
		}, 0)
	}
	//双击退出提示框
	showExit() {
		if(this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
			this.platform.exitApp();
		} else {
			this.weui.showToast('再按一次退出应用',{
				position: 'bottom',
				duration: 2000
			});
			this.backButtonPressed = true;
			setTimeout(() => this.backButtonPressed = false, 2000); //2秒内没有再次点击返回则将触发标志标记为false
		}
	}
	ionViewDidEnter(){
		if(this.platform.is("android")){
			this.addRegist();
		}
	}
	checkV() {
		this.cvm.checkV();
	}
}