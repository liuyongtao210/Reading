import { Component, ViewChild, NgZone } from '@angular/core';
import { App,Slides, Events, ModalController, NavController, Content, Platform } from 'ionic-angular';

import { CourseDetailPage } from '../course-detail/course-detail';
import { ArticleDetailPage } from '../article-detail/article-detail';

import { LoginModal } from '../modal-login/modal-login';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { UmengModel } from '../../model/umengModel/umengModel';
import { ChapterListPage } from '../chapter-list/chapter-list';
import { JPushService } from 'ionic2-jpush'
import { JumpModel } from '../../model/jumpModel/JumpModel';
import { PayPage } from '../../pages/pay/pay';
import { NewThingsPage } from '../../pages/new-things/new-things';
import { personalDataPage } from '../../pages/personal-data/personal-data';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	@ViewChild(Content) content: Content;
	@ViewChild(Slides) slides: Slides;
	userId: string;
	token: string;
	defaultUserImg: string = "assets/imgs/mine/mine-avatar.png";
	userInfo: any = {userImg:'', name:""};
	systemTime: number;
	AdvertismentList = [];
	productList = [
		{pic:"assets/imgs/home-new/icon1.png", name:"云讲堂", jumpType:2, path:"app://live"},
		{pic:"assets/imgs/home-new/icon2.png", name:"原版阅读", jumpType:2, path:"app://reading"},
		{pic:"assets/imgs/home-new/icon3.png", name:"活动课", jumpType:2, path:"app://activity-list"},
		{pic:"assets/imgs/home-new/icon4.png", name:"大咖说", jumpType:2, path:"app://teacher-list"}
	];
	bookList = [];
	bookCategory = [];
	hotcourse = [];
	msgList = []; //公告栏消息
	currentMsgIndex:number = 0; //当前正在显示的公关栏消息索引
	msgTypeName:any = ["系统消息", "最新活动"]; //公告栏消息类型名称
	msgChangeTime:number = 5000; //公告栏消息切换间隔（毫秒）
	pushMessageList = [
		// {content:"您预约的公开课将在10:00开始直播", jumpType:1, link:"http://my.saclass.com"},
		// {content:"精品图书Milo系列更新啦，快去查看吧", jumpType:2, link:"app://reading-chapter?id=25"},
		// {content:"特优生携手北京大学创办留学活动，快来参加，有优惠", jumpType:2, link:"app://news-detail?id=348"}
	];
	pushMsgPanelBottom:number = 50;
	latestStudy: any;
	saPage: number = 0;
	saLimitPageSize: number = 5;
	communityList = [];
	infiniteScrollEvent: any;
	refresherEvent: any;
	canClick: boolean = true;
	backTopHide: boolean = true;
	filePath: string = "";
	firstLoadedData:boolean = false;
	isLoadMore:boolean = false; //是否正在加载更多数据
	noMoreData:boolean = false; //是否还有更多下滑的数据

	constructor(
		public events: Events,
		public navCtrl: NavController,
		private plt: Platform,
		private weui: WeuiModel,
		private comman: commanModel,
		private umeng:UmengModel,
		public modalCtrl: ModalController,
		private app: App,
		public zone: NgZone,
		private jPushPlugin: JPushService,
		private jump: JumpModel
	) {
		this.pushMsgPanelBottom = this.navCtrl.parent._tabbar.nativeElement.clientHeight;

		//获取插屏数据
		this.getScreenAdvert();

		//监听登录状态改变事件
		this.events.subscribe('login-state-change', ()=>{
			var isActive = this.app.getActiveNav().getActive().name=="HomePage";
			if(isActive){
				this.initData();
			}else{
				this.firstLoadedData = false;
			}
		});
		//监听书籍购买成功事件
		this.events.subscribe("book-buy-success", ()=>{
			var isActive = this.app.getActiveNav().getActive().name=="HomePage";
			if(!isActive){
				this.getHomePage();
			}
		})
		//监听用户信息改变事件
		this.events.subscribe("userinfo-updated", (data)=>{
			if(data.NickName!=""){
				this.userInfo.name = data.NickName;
			}else{
				this.userInfo.name = data.name;
			}
			this.userInfo.userImg = data.userImg;
		})
		
		//平台准备就绪
		this.plt.ready().then(() =>{
			//初始化极光推送
			this.initJpush();
			//处理极光推送通知
		 	this.jPushPlugin.openNotification()
		 		.subscribe( res => {
				 this.jump.jumpTo(res.extras.jumpType, res.extras.path, res.aps.alert);
		 	});
		 	this.jPushPlugin.receiveNotification()
		 		.subscribe( res => {
				 console.log(res);
				 //清除推送消息以及设置数字角标为0
				 this.clearNotification();
				 this.setBadge();
				 //插件的回调里改变数据，视图不会刷新，要放到zone的run方法里
				 this.zone.run(() => {
					this.pushMessageList.push({
						jumpType:0,
						link:"",
						content:res.aps.alert
					});
				 });
		 	});
		 	this.jPushPlugin.receiveMessage()
		 		.subscribe( res => {
		 		console.log(res)
		 	});
		 })
	}

	//获取插屏数据
	getScreenAdvert(){
		this.comman.request("SA", "screenList", {}, (data)=>{
			if(data.code==0){
				if(data.data.picUrl!=undefined){
					this.events.publish("home-advert-loaded", 
						{
							jumpType:data.data.jumpType, 
							path:data.data.linkUrl, 
							picUrl:data.data.picUrl
						}
					);
				}
			}else{
				console.log("获取插屏数据失败："+data.msg);
			}
		});
	}

	//测试方法
	testPay(){
		if(this.isLogin()){
			let loginModalCtrl = this.modalCtrl.create(PayPage, {orderNumber:"20181112170725605"});
			loginModalCtrl.present();
			loginModalCtrl.onDidDismiss((data)=>{
				if(data.success){
					console.log("*****  pay success *****");
				}else{
					console.log("*****  cancel pay *****");
				}
			});
			// this.comman.request("SA", "bookList", {userId:this.userId, token:this.token, page:0, size:10}, (data)=>{
			// 	//
			// })
		}else{
			this.goLogin();
		}
	}

	//注册极光
    initJpush() {
	 	this.jPushPlugin.init()
	 	.then(res => {
			this.clearNotification();
			this.setBadge();
	 		//alert(res)
	 	})
	 	.catch(err => {
	 		//alert(err)
	 	})
    }
 
    //获取ID
    getRegistrationID() {
	 	this.jPushPlugin.getRegistrationID().then(res => {
	 		alert(res);
	 	}).catch(err => {
	 		alert(err);
	 	})
	 }
	 
	//设置别名
	setAlias(){
		this.jPushPlugin.setAlias({
			sequence: Date.now(),
			alias: this.userId
		}).then(res => {
			console.log(res);
		}).catch(err => {
			console.log(err);
		})
	}

	//获取用户系统设置（推送功能是否开启）
	getUserNotificationSettings(){
		this.jPushPlugin.getUserNotificationSettings().then(res => {
			console.log(res);
		}).catch(err => {
			alert(err);
		})
	}

	//清除所有推送对象（系统通知中心的条目）
	clearNotification(){
		//android
		this.jPushPlugin.clearAllNotification().then(res=>{console.log(res)}).catch(err=>{console.log(err)});
		//ios
		this.jPushPlugin.clearAllLocalNotifications().then(res=>{console.log(res)}).catch(err=>{console.log(err)});
	}

	//设置应用图标数字角标
	setBadge(){
		this.jPushPlugin.setApplicationIconBadgeNumber(0).then(res=>{console.log(res)}).catch(err=>{console.log(err)});
	}

	onUserImgTap(){
		if(this.isLogin()){
			this.navCtrl.push(personalDataPage);
		}else{
			this.goLogin();
		}
	}

	initUserId() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		if(this.isLogin()){
			this.setAlias();
			this.comman.getUserInfo((success, data)=>{
				if(success){
					if(data.nickName!=undefined && data.nickName!=""){
						data.name = data.nickName;
					}else{
						data.name = data.userName;
					}
					if(data.userImg==""){
						data.userImg = this.defaultUserImg;
					}
					this.userInfo = data;
				}else{
					this.userInfo.name = data;
					if(data=="登录失效"){
						this.userId = "";
						this.token = "";
					}
				}
			});
		}else{
			this.userInfo = {userImg:this.defaultUserImg, name:"未登录"};
		}
	}
	initData() {
		this.saPage = 0;
		this.noMoreData = false;
		this.initUserId();
		this.getHomePage();
		//this.getSACommunityList();
	}
	getHomePage() {
		let param = {
			userId: this.userId,
			token: this.token
		};
		this.comman.request("SA", "getHomePage", param, (data) => {
			if(data.code == 0) {
				this.filePath = data.filePath;
				this.systemTime = data.sysTime;
				this.setAdvertismentList(data.adList); //Banner数据
				if(data.readings.length<3){
					var offCount = 3 - data.readings.length;
					for(var i=0; i<offCount; i++){
						data.readings.push({name:"敬请期待", isBuy:-2});
					}
				}
				this.bookList = data.readings; //精品书籍
				if(data.tagsList.length>4){
					data.tagsList.splice(4);
				}
				this.bookCategory = data.tagsList; //分类标签
				this.communityList = data.dailyInfoList; //新鲜事
				this.hotcourse = data.courses; //热门课程
				this.msgList = data.msgList; //公告栏消息
				if(this.msgTimer!=null){
					clearInterval(this.msgTimer);
				}
				if(this.msgList.length>1){
					this.msgTimer = setInterval(()=>{
						if(this.currentMsgIndex<this.msgList.length-1){
							this.currentMsgIndex++;
						}else{
							this.currentMsgIndex = 0;
						}
					}, this.msgChangeTime);
				}
				if(data.latestReading != undefined) {
					this.setLatestReading(data.latestReading);
				}
			} else {
				this.firstLoadedData = false;
				this.weui.showAlert("获取内容失败", data.msg, "确定");
			}
			if(this.refresherEvent != undefined) {
				this.refresherEvent.complete();
			}
		}, (err) => {
			this.firstLoadedData = false;
			if(this.refresherEvent != undefined) {
				this.refresherEvent.complete();
			}
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			}
			if(err == "10099") {
				this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "", "去登陆", () => {}, () => {
					this.goLogin();
				});
			}
		})
	}
	onMsgTap(){
		var msg = this.msgList[this.currentMsgIndex];
		this.jump.jumpTo(msg.linkType, msg.link, msg.content);
	}

	onMoreReadingTap(){
		this.navCtrl.parent.select(1);
	}
	onMoreTagTap(){
		this.navCtrl.parent.select(1);
	}
	onMoreCourseTap(){
		this.navCtrl.parent.select(2);
	}
	onMoreNewsTap(){
		this.navCtrl.push(NewThingsPage);
	}

	onMessageClick(message, index){
		this.jump.jumpTo(message.jumpType, message.link, message.content);
		this.pushMessageList.splice(index,1);
	}
	onMessageClose(event, index){
		event.stopPropagation();
		this.pushMessageList.splice(index,1);
	}

	doRefresh(refresher) {
		this.refresherEvent = refresher;
		this.initData();
	}
	setAdvertismentList(list) {
		this.AdvertismentList = list;
		if(this.slidetimer==null){
			this.slidetimer = setTimeout(()=>{
				this.slides.slideNext(600);
			}, 5000);
		}
	}
	setProductList(list) {
		this.productList = new Array();
		this.productList = list;
	}
	setLatestReading(listObj) {
		if(listObj != undefined && listObj != null) {
			this.latestStudy = new Object();
			try{
				if(Math.floor(listObj["process"])>100){
					listObj["process"] = 100;
				}else if(Math.floor(listObj["process"])<0){
					listObj["process"] = 0;
				}
				listObj["process"] = Math.floor(listObj["process"]);
				listObj["processWidth"] = "calc("+Math.floor(listObj['process'])+"% - 2px)";
			}catch(e){
				listObj["process"] = 0;
			}
			this.latestStudy = listObj;
		}
	}
	goLogin() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
				this.initData();
			}
		});
	}
	goChapterPage(item) {
		if(!this.isLogin()){
			this.goLogin();
			return false;
		}
		if(item.seriesId!=undefined){
			(this.navCtrl).push(ChapterListPage, {
				data: item.seriesId
			})
		}else{
			this.weui.showToast("系列ID不能为空！",{duration:1500});
		}
	}

	appointmentCourse(courseObj,ev?){
		try{
			if(ev!=undefined){
				ev.stopPropagation();
			}
		}catch(e){
			//TODO handle the exception
		}
		if(!this.isLogin()){
			this.goLogin();
			return false;
		}
		var params = {
			userId:this.userId,
			token:this.token,
			seriesId:courseObj.seriesId,
			classId:courseObj.classId,
			id:courseObj.courseId,
			originType:7
		};
		this.comman.request("Course", "subscribeLive", params, (data) => {
			console.log(data);
			if(data.code == 0) {
				this.weui.showToast("课程预约成功！");
				this.initData();
			}else{
				this.weui.showAlert("课程预约失败",data.msg,"确定");
			}
		}, (err) => {
			this.weui.showAlert("课程预约失败","","确定");
			console.log(err);
			
			if(err == "10099") {
				this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "关闭", "去登陆", () => {}, () => {
					this.goLogin();
				});
			}
		})
	}
	isLogin(){
		if(this.userId==""||this.userId==undefined||this.userId==null||this.token==""||this.token==undefined||this.token==null){
			return false;
		}else{
			return true;
		}
	}
	goArticle(object) {
		if(object.sourceId != undefined) {
			this.navCtrl.push(ArticleDetailPage, {id: object.sourceId});
		} else {
			this.weui.showToast("该内容未关联文章！",{duration:1500});
		}
	}
	goProductDetail(productObj) {
		console.log(productObj);
		this.jump.jumpTo(productObj.jumpType, productObj.path);
		if(this.plt.is("cordova")) {
			this.umeng.onEvent("index_express",productObj.name);
		}
	}

	onCategoryTap(category){
		this.comman.setGlobal({"home_cateId":category.id});
		this.events.publish("home_cateid_change", category.id);
		this.navCtrl.parent.select(1, {cateId:category.id});
	}

	onCourseTap(course){
		if(this.isLogin()){
			this.navCtrl.push(CourseDetailPage, {id:course.id});
		}else{
			this.goLogin();
		}
	}

	onBookTap(book, dataName){
		let detailPage:any = dataName=="课程" ? CourseDetailPage : ChapterListPage;
		let param:any = dataName=="课程" ? {id:book.id} : {data:book.id};
		if(this.plt.is("cordova")) {
			this.umeng.onEvent("index_reading",book.name);
		}
		if(this.isLogin()){
			if(book.isBuy==-1){ //未购买
				if(book.goodsId==undefined){
					this.weui.showAlert("无法获取"+dataName, "没有返回商品Id", "确定");
					return;
				}
				let loading = this.weui.showLoading("获取"+dataName);
				this.comman.buyBook(book.goodsId, book.id, book.name, book.thumb, (success, res)=>{
					this.weui.hideLoading(loading);
					this.toPaybook(book, success, res, detailPage, param);
				});
			}else if(book.isBuy==0){ //待支付
				if(book.orderNumber==undefined){
					this.weui.showAlert("无法获取"+dataName, "没有返回待支付订单号", "确定");
					return;
				}
				let loading = this.weui.showLoading("处理"+dataName);
				this.comman.realPay(book.orderNumber, (success, res)=>{
					this.weui.hideLoading(loading);
					this.toPaybook(book, success, res, detailPage, param);
				})
			}else if(book.isBuy==1){ //1:已购买
				this.navCtrl.push(detailPage, param);
			}
		}else{
			this.goLogin();
		}
	}
	toPaybook(book, success, res, detailPage, param){
		if(success){
			if(res==0){
				book.isBuy = 1;
				this.events.publish("book-buy-success");
				this.navCtrl.push(detailPage, param);
			}else{
				book.isBuy = 0;
				book.orderNumber = res;
				let payModel = this.modalCtrl.create(PayPage, {orderNumber: res});
				payModel.present();
				payModel.onDidDismiss((data)=>{
					if(data.success){
						book.isBuy = 1;
						this.events.publish("book-buy-success");
						this.navCtrl.push(detailPage, param);
					}
				})
			}
		}else{
			this.weui.showAlert("获取错误", res, "确定");
		}
	}

	showToast() {
		let options = {
			position: "middle",
			duration: 1000,
			//			closeButtonText:"关闭"
		}
		this.weui.showToast("我是一条toast", options, () => {
			console.log("111");
		});
	}
	showAlert() {
		this.weui.showAlert("标题", "内容", "", "打开", () => {}, () => {});
	}
	dismissMask(maskArray) {
		let navOption = {
			animate: false
		};
		for(var i = 0; i < maskArray.length; i++) {
			maskArray[i].dismiss("", "", navOption).catch(() => {});
		}
	}
	imgError(ev) {
		console.log(ev);
		//ev.target.style.visibility = "hidden";
	}
	ionScroll(ev) {
		this.zone.run(() => {
			if(ev.scrollTop > 92) {
				this.backTopHide = false;
			} else {
				this.backTopHide = true;
			}
		})
	}
	ionScrollStart(ev) {
		this.zone.run(() => {
			this.canClick = false;
		})
	}
	ionScrollEnd(ev) {
		this.zone.run(() => {
			this.canClick = true;
			if(this.isClickRefresh){
				this.isClickRefresh = false;
				this.initData();
			}
		})
	}

	isClickRefresh:boolean = false; //用户是否点击了刷新按钮

	backTop() {
		if(this.canClick) {
			this.isClickRefresh = true;
			this.content.scrollToTop(300);
		}
	}
	ionViewDidLeave(){
		//
	}

	ionViewDidEnter() {
		if(!this.firstLoadedData){
			this.firstLoadedData = true;
			this.initData();
		}
	}

	slidetimer: any = null;
	msgTimer: any = null;

	ionSlideDidChange(event){
		let index = this.slides.getActiveIndex(); // caution: starts from 1
		if(index == this.AdvertismentList.length){
			this.slides.slideTo(0, 600);
		}else if(index == this.AdvertismentList.length-1){
			this.slidetimer = setTimeout(()=>{
				this.slides.slideTo(0, 600);
			}, 5000);
		}else{
			this.slidetimer = setTimeout(()=>{
				this.slides.slideNext(600);
			}, 5000);
		}
	}

	ionSlideDrag(){
		if(this.slidetimer!=null){
			clearTimeout(this.slidetimer);
		}
	}

	ionSlideTap(ev) {
		let index = this.slides.getActiveIndex(); // caution: starts from 1
		let advertisement = this.AdvertismentList[index];
		var h5Title = advertisement.title==undefined ? "" : advertisement.title;
		this.jump.jumpTo(advertisement.jumpType, advertisement.linkUrl, h5Title, advertisement.content, advertisement.thumbPic);
		if(this.plt.is("cordova")) {
			let eventName = "第"+(index+1)+"个Banner";
			this.umeng.onEvent("index_banner",eventName);
		}
	}
}