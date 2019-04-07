import { Component, ElementRef, ViewChild,ChangeDetectorRef,NgZone } from '@angular/core';
import { Content,Events,IonicApp,ModalController,Platform,NavController, NavParams, ToastController, ActionSheetController,LoadingController } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';

import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { SAWS } from '../../assets/js/SAWS.js'
import { getXmlData, transformSymbols } from '../../assets/js/xmlAnalysis';

import { Brightness } from '@ionic-native/brightness';

declare var actorPlugins: any; //使用自定义插件
declare var VoiceSairalPlugins: any; //使用自定义插件
declare var $;
@Component({
	selector: 'page-live-actor',
	templateUrl: 'live-actor.html'
})
export class LiveActorPage {
	@ViewChild(Content) content: Content;
	@ViewChild("myCanvas") myCanvas: ElementRef;
	skeletonShow:boolean = true;
	isTeacherInRoom:boolean=false;
	pageName:string="直播课教室";
	roomPersonNumber:number=0;
	isBgTransparent = false;
	userInfo = {
		courseId: "",
		userId: "",
		token: "",
		userIcon: "",
		userName: ""
	}
	message: string;
	videoBoxHeight: number = 0;
	videoBoxWidth: number = 0;
	canvasWidth: number = 0;
	canvasHeight: number = 0;
	liveBoxHeight: number = 0;

	toBottom = false;
	liveInfo = null;
	collect = 0;
	inputText = "";
	openChat = false;
	vip = false;
	chatList = [];
	chatListHelf = [];
	userList = [];
	docIndex = -1;
	page = 0;
	moveObj = null;
	drawRatio = $(window).width() / 800;
	drawReady: boolean = false;
	pptImgUrl = "";
	nobullet = false;
	ws: any;
	ctx: any;
	tagNumber: number = 0;
	roomInfo: any;
	courseId: number;
	seriesId:number;
	classId:number;
	viewType:number = 0;
	sysTime: any;
	courseInfo:string;
	courseObj:any;//父页面传过来的间接信息
	roomObj:any;//接口获取的简介信息
	//voice
	isShowVoice:boolean = false;
	isReadOver:boolean = false;
	word:string;
	speechStatus:string;
	loadingMsg = "loading...";
	loading: any;
	isSpeeking: boolean = false;
	result: string;
	score: any; //得分
	sumScore:any = [];//分数数组
	totalScore:number;总分
	volume: number;//返回的声音大小
	volumeShadow: string;//发音的css样式
	xmlInfo: string;//讯飞返回所有信息
	xmlDatas: any;//讯飞返回的数据
	subjectType: string; //1，单词word，2 短语 phrase 3 句子 content  4 文章 chapter
	isActoring:boolean = false;
	timeCountInterval:any;
	isClass:boolean = false;
	classStatus:any;
	currentStyles:{};
	//往期公开课
	videoArray = [];
	videoUrl:string = "";
	audioUrl:string = "";
	videoPic:string = "";
	videoArrayIndex:number=0;
	isFullscreen:boolean = false;
	ccVideoInfo:{};
	filePath:string = "http://files.specialaedu.com/files/";
	pptlist:any=[];
	
	constructor(
		public events: Events,
		public navCtrl: NavController,
		private navParams: NavParams,
		public toastCtrl: ToastController,
		public actionSheetCtrl: ActionSheetController,
		public loadingCtrl: LoadingController,
		private ref: ChangeDetectorRef,
  		public platform:Platform,
		private brightness: Brightness,
		public weui: WeuiModel,
		private comman: commanModel,
		public modalCtrl: ModalController,
		private ionicApp: IonicApp,
		public zone: NgZone
	) {
		this.userInfo.userName = this.comman.getGlobal("userName");
		this.userInfo.userIcon = this.comman.getGlobal("userIcon");
		console.log(this.userInfo);
		this.brightness.setKeepScreenOn(true);//屏幕常亮
	}
	pushView() {
		this.comman.request("WangYiCloud", "createImId", {
			userId: this.userInfo.userId.toLowerCase(),
			name: "学生姓名"
		}, (data) => {
			console.log(data);
			if(data.code == 0) {
				var actorToken = data.token;
				var width = Math.ceil(this.videoBoxWidth);
				var height = Math.ceil(this.videoBoxHeight);
				var isActorType = 'false';
				if(this.classStatus==1){
					isActorType = 'true';
				}
				console.log("房间信息：");
				console.log("roomId："+this.roomInfo.roomId);
				console.log("userId："+ this.userInfo.userId.toLowerCase());
				var messageParam = "width=" + width + "&height=" + height + "&roomId=" + this.roomInfo.roomId + "&userId=" + this.userInfo.userId.toLowerCase() + "&token=" + actorToken + "&isActor=" + isActorType + "&teacherId=" + this.roomInfo.teacherId;
				try{
					actorPlugins.initActor(messageParam, (msg) => {
						this.message = msg;
					});
				}catch(e){
					//TODO handle the exception
					console.log(e);
				}
			}
		}, (err) => {
			console.log(err);
		})

	}
	
	getPPTlist(){
		this.comman.request("DocumentConvert", "getCourseImage", {
			courseId: this.courseObj.courseId,
			type: 9
		}, (data) => {
			if(data.code == 0) {
				this.filePath = data.filePath;
				if(data.list.length>0){
					this.pptlist = data.list[0].imgList;
				}else{
					//this.weui.showToast("未上传课件ppt", {position:"middle"})
				}
			}else{
				this.weui.showToast(data.msg, {position:"middle"})
			}
		})
	}
	
	setJoinActor(isActor) {
		if(isActor=='true'){
			this.isActoring = true;
		}else if(isActor=='false'){
			this.isActoring = false;
		}
		try{
			actorPlugins.setJoinActor(isActor, (msg) => {
				this.message = msg;
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	setVolume(isVolumeOff){
		let volumeCoommand = "volumeOn";
		if(isVolumeOff){
			volumeCoommand = "volumeOff";
		}
		try{
			actorPlugins.setJoinActor(volumeCoommand, (msg) => {
				this.message = msg;
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	destroyView() {
		try{
			actorPlugins.destroyView("destroy", (msg) => {
				this.message = msg;
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	initUI() {
//		this.videoBoxWidth = $(".streamVideoContent").width();
		this.videoBoxWidth = this.platform.width();
		if(this.viewType==0&&this.courseObj.dataType==12){
			this.videoBoxHeight = this.videoBoxWidth * 9 / 16;
		}else{
			this.videoBoxHeight = this.videoBoxWidth * 3 / 4;
		}
//			this.liveBoxHeight = window.document.body.offsetHeight - 30 - this.videoBoxHeight - 60;
			this.liveBoxHeight = this.content.contentHeight - this.videoBoxHeight;
			this.skeletonShow = false;
	}
	initData() {
		console.log(this.viewType);
		console.log(this.courseObj);
		if(this.courseObj.dataType==10){
			this.initLiveCourse();
		}else if(this.courseObj.dataType==12){
			this.initRecordCourse();
			this.getPPTlist();
		}
	}
	initRecordCourse(){
		let myLoading = this.weui.showLoading("正在获取视频");
		this.comman.request("Course", "getCourseDetails", {
			id: this.courseObj.courseId,
			dataType: 12,
			originType: 9
		}, (data) => {
			console.log(data);
			if(data.code == 0) {
				this.setCcVideoInfo(data,myLoading);
			}else{
				this.weui.showAlert("获取课程失败",data.msg,"确定");
				this.weui.hideLoading(myLoading);
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			console.log(err);
			if(err == "10099") {
				if(this.checkMask()) {
					this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "", "去登陆", () => {}, () => {
						this.goLogin();
					});
				}
			}else{
				this.weui.showAlert("获取课程失败","","确定");
			}
		})
	}
	setCcVideoInfo(ccVideoData,myLoading){
		if(this.courseObj.ccid==undefined){
			this.weui.showAlert("获取视频失败","视频id为空","关闭");
			return false;
		}
		this.comman.request("Video", "getVideoUrlByCcId", {
			ccId: this.courseObj.ccid,
		}, (data) => {
			this.weui.hideLoading(myLoading);
			console.log(data);
			if(data.code == 0) {
				if(data.url.videoHdUrl==undefined||data.url.videoHdUrl==""){
					this.weui.showAlert("没有视频资源","","确定");
					return false;
				}else{
					this.videoArray.push({
						video:data.url.videoHdUrl,
//						audio:data.url.audioHdUrl
						audio:"http://192.168.1.235/demo/uH57CdbOrf-20.mp3"
					});
					this.videoArrayIndex = 0;
					this.videoUrl = this.videoArray[this.videoArrayIndex]["video"];
					this.audioUrl = this.videoArray[this.videoArrayIndex]["audio"];
					this.videoPic = ccVideoData.details[0].bigPic;
					this.ccVideoInfo = {
						originText:ccVideoData.details[0].originText,
						name:ccVideoData.details[0].name
					};
					this.pageName = ccVideoData.details[0].name;
				}				
			}else{
				this.weui.showAlert("获取视频失败",data.msg,"确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			console.log(err);
			this.weui.showAlert("获取视频失败","","确定");
		})
	}
	initLiveCourse(){			
		if(this.viewType==1){
			this.classStatus = 0;
			this.comman.request("Course", "getLiveRoomInfo", {
				userId:this.userInfo.userId,
				token:this.userInfo.token,
				courseId: this.courseId,
			}, (data) => {
				console.log(data);
				if(data.code == 0) {
					this.setRoomInfo(data);
				}else{
					this.weui.showAlert("获取直播间失败",data.msg,"确定");
				}
			}, (err) => {
				this.weui.showAlert("获取直播间失败","获取直播间失败","确定");
				console.log(err);
				if(err == "10099") {
					if(this.checkMask()) {
						this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "", "去登陆", () => {}, () => {
							this.goLogin();
						});
					}
				}
			})
		}else{
			this.classStatus = 0;
			this.comman.request("Course", "getLiveRoomInfo", {
				userId:this.userInfo.userId,
				token:this.userInfo.token,
				courseId: this.courseId,
			}, (data) => {
				console.log(data);
				if(data.code == 0) {
					this.pageName = data.roomInfo.className;
					this.roomObj = data.roomInfo;
					if(this.courseObj.isFinish==1){//已结课
						this.setVideoInfo(data);
					}else{//未结课
						this.courseObj.isSub = data.roomInfo.isSub;
						if(data.sysTime>=this.courseObj.courseTimeStamp&&this.courseObj.isSub==1){
							this.viewType=1;
							this.setRoomInfo(data);
						}else{
							this.viewType=0;
						}
					}
				}else{
					this.weui.showAlert("获取直播间失败",data.msg,"确定");
				}
			}, (err) => {
				this.weui.showAlert("获取直播间失败","获取直播间失败","确定");
				console.log(err);
				
				if(err == "10099") {
					if(this.checkMask()) {
						this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "", "去登陆", () => {}, () => {
							this.goLogin();
						});
					}
				}
			})
		}
	}
	setVideoInfo(data){
//		var demoVideoUrl = "http://vodhrfsa7dq.vod.126.net/vodhrfsa7dq/78f48fa6493d41868eb3a2eea6a187fb_1536027481951_1536027552954_876840864-00000.mp4,http://vodhrfsa7dq.vod.126.net/vodhrfsa7dq/78f48fa6493d41868eb3a2eea6a187fb_1535943550414_1535943906922_871133961-00000.mp4"
		if(data.roomInfo['videoPath']==undefined){
			this.weui.showAlert("没有视频资源","","确定");
			return false;
		}else{
//			data.roomInfo['videoPath'] = demoVideoUrl;
			var tempVideoArray = data.roomInfo.videoPath.split(',');
//			var tempAudioArray = data.roomInfo.audioPath.split(',');
//			this.videoArray = data.roomInfo.videoPath.split(',');
			for(var i=0;i<tempVideoArray.length;i++){
				this.videoArray.push({
					video:tempVideoArray[i],
					audio:"http://192.168.1.235/demo/uH57CdbOrf-20.mp3"
				}) 
			}
			this.videoArrayIndex = 0;
			this.videoUrl = this.videoArray[this.videoArrayIndex]["video"];
			this.audioUrl = this.videoArray[this.videoArrayIndex]["audio"];
			this.videoPic = data.roomInfo.bigPic;
		}
	}
	videoLoadedActive(ev){
		if(!ev.idLoading&&!ev.isPlay){
			console.log(this.videoBoxWidth+" 开始的！: "+this.videoBoxHeight);
			this.videoBoxHeight = this.videoBoxWidth*ev.videoCurrentHeight/ev.videoCurrentWidth;
//			this.liveBoxHeight = window.document.body.offsetHeight - 30 - this.videoBoxHeight - 60;
			this.liveBoxHeight = this.content.contentHeight - this.videoBoxHeight;
			console.log("计算了一次！: "+this.videoBoxHeight);
			console.log(ev);
			
				this.ref.markForCheck();//提示当前要被检测
				this.ref.detectChanges();//检查和更检测程序,也可以进行局部的检测
		}
	}
	videoActive(ev){
		if(ev.isEnded){
			this.videoArrayIndex++;
			if(this.videoArrayIndex<this.videoArray.length){
				this.videoUrl = this.videoArray[this.videoArrayIndex]["video"];
				this.audioUrl = this.videoArray[this.videoArrayIndex]["audio"];
			}
		}
	}
	fullscreenEvent(ev){
		if(ev.isFullscreen){
			this.isFullscreen = true;
		}else{
			this.isFullscreen = false;
			this.zone.run(()=>{
				this.content.resize();
			})
		}
	}
	setRoomInfo(data){
		this.pageName = data.roomInfo.className;
		var newClassTime = this.getClassTime(data.roomInfo.date,data.roomInfo.bookingTime);
		data.roomInfo.classTime = newClassTime;
		this.changeCountTimeView(data.systemTime,data.roomInfo.classTime);
		data.roomInfo.systemTime = data.sysTime;
		this.roomInfo = data.roomInfo;
		this.sysTime = data.sysTime;
		this.userInfo.courseId = "speciala_"+this.courseId;
		this.initWs();
		this.timeCount();
	}
	appointmentCourse(){
		if(!this.isLogin()){
			this.weui.showAlert("提示","只有登录用户才能进行预约","取消","去登陆",()=>{
				
			},()=>{
				this.goLogin();
			})
			return false;
		}
		var params = {
			userId:this.userInfo.userId,
			token:this.userInfo.token,
			seriesId:this.seriesId,
			classId:this.classId,
			id:this.courseId,
			originType:7
		};
		this.comman.request("Course", "subscribeLive", params, (data) => {
			if(data.code == 0) {
				this.weui.showToast("课程预约成功！");
				this.events.publish('hasAppointment');
				this.initData();
			}else{
				this.weui.showAlert("课程预约失败",data.msg,"确定");
			}
		}, (err) => {
			this.weui.showAlert("课程预约失败","","确定");
			if(err == "10099") {
				if(this.checkMask()) {
					this.weui.showAlert("登录失败", "登录状态已失效，请从新登录", "关闭", "去登陆", () => {}, () => {
						this.goLogin();
					});
				}
			}
		})
	}
	isLogin(){
		if(this.userInfo.userId==""||this.userInfo.userId==undefined||this.userInfo.userId==null||this.userInfo.token==""||this.userInfo.token==undefined||this.userInfo.token==null){
			return false;
		}else{
			return true;
		}
	}
	changeCountTimeView(systemTime,classTime){
		if(systemTime-classTime<0){
			this.isClass = false;
		}else{
			this.isClass = true;
		}
	}
	getClassTime(classTime:number,bookingTime:string){
		var d1 = new Date(classTime);
		var minArr = bookingTime.split("-");
		var minArr2 = minArr[0].split(":");
		console.log(d1.getFullYear());
		console.log(d1.getMonth());
		console.log(d1.getDate());
		console.log(parseInt(minArr2[0]));
		console.log(parseInt(minArr2[1]));
		var d = new Date(d1.getFullYear(),d1.getMonth(),d1.getDate(),parseInt(minArr2[0]),parseInt(minArr2[1]));
		return d.getTime();
	}
	canvasLoad() {

	}
	changeTag(tagNum) {
		let left:number = 0;
		let width:number = 0;
		this.tagNumber = tagNum;
		if(tagNum==0){
			left = $(".tagLine0").offset().left;
			width = $(".tagLine0").width();
		}else if(tagNum==1){
			left = $(".tagLine1").offset().left;
			width = $(".tagLine1").width();
		}else{
			left = $(".tagLine2").offset().left;
			width = $(".tagLine2").width();
		}
		this.setCurrentStyles(left,width);
	}
	
	setCurrentStyles(left,width){
		this.currentStyles = {
//			'left':left+(width-35)/2+"px",
			'transform':"translate("+(left+(width-35)/2)+"px,0)",
//			'width':width+12+"px"
		}
	}
	initWs() {
		//		var canvas = document.getElementById("mycan");
		var canvas = this.myCanvas.nativeElement;
		console.log(canvas);
		this.ctx = canvas.getContext("2d");
		this.ws = new SAWS();
		this.ws.onopen = () => {
			console.log("登录直播室");
			this.ws.login(this.userInfo.courseId, this.userInfo.userId, "405486", 3, this.userInfo.userName, this.userInfo.userIcon);
		}
		this.ws.onmessage = (res) => {
			console.log(res);
			console.log("********************************");
			console.log(res.type);
			switch(res.type) {
				case SAWS.MES_DOWN_REGIST:
					if(res.status == 0) {
						this.onLogin();
					} else {
						this.onLoginFail(res);
					}
					break;
				case SAWS.MES_DOWN_ROOM_LIST:
					switch(res.options[0].key) {
						case 1:
							this.onRoomUserList(res);
							break;
						case 11:
							this.onUserLogin(res);
							break;
						case 12:
							this.onUserLogout(res);
							break;
					}
					break;
				case SAWS.MES_DOWN_CHAT_ROOM:
					this.onRoomChat(res);
					break;
				case SAWS.MES_DOWN_CHAT_SINGLE:
					this.onSingleChat(res);
					break;
				case SAWS.MES_DOWN_SHARE_UPD:
					this.onShareObjectUpd(res);
					break;
				case SAWS.MES_DOWN_RESPONSE:
					console.log(res);
					if(res.status != 0) {
						if(res.status == 10095 || res.status == 10096) { //禁言 10095  解除禁言 10096
							var alertMsg = "";
							if(res.status == 10095) {
								alertMsg = "您被禁言了.";
							} else if(res.status == 10096) {
								alertMsg = "禁言解除.";
							}
							this.weui.showAlert("通知",alertMsg,"关闭");
							for(var i = 0; i < this.userList.length; i++) {
								if(this.userList[i].id == res.toUserId) {
									this.userList[i].auth[0].SPEAK = (res.status == 10095 ? 0 : 1);
									break;
								}
							}
						}else if(res.status == 10097){//踢人
								this.navCtrl.popToRoot();
							this.weui.showAlert("通知","您被踢出了房间","确定","",()=>{
							});
						}else {
							this.onResponseFail(res);
						}
					}
					break;
				case SAWS.MES_DOWN_SHARE_GET:
					this.onShareObjectGet(res);
					break;
				case SAWS.MES_DOWN_CHAT_HISTORY:
					this.onChatHistory(res);
					break;
				case SAWS.MES_DOWN_ROOM_DISPOSE:
					console.log("房间已销毁");
					break;
				case SAWS.MES_DOWN_SHAREHIS_GET:
					console.log("draw");
					console.log(this.drawRatio);
					var canvas = this.myCanvas.nativeElement;
					var pointArr = res.options[0].value.split(",");
					for(var i = 0; i < pointArr.length; i++) {
						if(pointArr[i].indexOf("SET") != -1) {
							var arr = pointArr[i].split(":")[1].split("_");
							this.ctx.strokeStyle = arr[0];
//							this.ctx.lineWidth = arr[1];
							this.ctx.lineWidth = 2;
							this.ctx.beginPath();
							this.ctx.lineJoin = "round";
							this.ctx.lineCap = "round";
						} else if(pointArr[i] != "UP") {
							var xy = pointArr[i].split("_");
							var xx = canvas.width * xy[0];
							var yy = canvas.height * xy[1];
							this.ctx.lineTo(xx, yy);
						} else {
							this.ctx.stroke();
						}
					}
					break;
			}
		}
		this.ws.onclose = () => {
			//				hideLoad();
			console.log("SOCKET连接已关闭！");
		}

		console.log("获取直播信息");
		this.openMessageDiv(1);
		this.ws.init();
		$("#pptImg").load(() => {
			var imgW = $("#pptImg").width();
			var imgH = $("#pptImg").height();
			if(imgW > imgH) {
				$("#pptImg").addClass("pptImg_2");
			} else {
				if($("#pptImg").hasClass("pptImg_2")) {
					$("#pptImg").removeClass("pptImg_2");
				}
			}
			imgW = $("#pptImg").width();
			imgH = $("#pptImg").height();
			var canvasTop=0;
			var parentBoxHeight = this.liveBoxHeight-41;
			canvasTop=-(imgH-parentBoxHeight)/2;
			this.canvasWidth = imgW;
			this.canvasHeight = imgH;
			$("#mycan")[0].width = imgW;
			$("#mycan")[0].height = imgH;
			$("#mycan").css("top",canvasTop+"px");
			this.ws.getShareHistory(this.userInfo.courseId, this.userInfo.userId, "draw", this.docIndex, this.page);
		})
	}

	getLiveInfo() {
		console.log("获取直播信息");
		this.openMessageDiv(1);
		this.ws.init();
	}
	onLogin() {
		this.getRoomUserList();
		this.getHistoryChat();
		this.getShareObject();
	}
	onLoginFail(res) {
		console.log("登录失败" + res);
	}
	onResponseFail(res) {
		console.log("出状况了" + res);
	}
	getRoomUserList() {
		console.log("获取人员列表");
		this.ws.getRoomUserList(this.userInfo.courseId, this.userInfo.userId);
	}
	getHistoryChat() {
		console.log("获取历史聊天列表");
		this.ws.getRoomHistoryChat(this.userInfo.courseId, this.userInfo.userId);
	}
	getShareObject() {
		this.ws.getShareObject(this.userInfo.courseId, this.userInfo.userId, "docConfig");
		this.ws.getShareObject(this.userInfo.courseId, this.userInfo.userId, "docImg");
		this.ws.getShareObject(this.userInfo.courseId, this.userInfo.userId, "config");
	}
	onRoomUserList(res) {
		var arr = JSON.parse(res.options[0].value);
		this.userList = this.userList.concat(arr);
		this.roomPersonNumber = this.userList.length;
		for(var i = 0; i < this.userList.length; i++) {
			if(this.userList[i].id == this.userInfo.userId) {
				this.userInfo.userIcon = this.userList[i].icon;
				break;
			}
		}
	}
	onUserLogin(res) {
		var user = JSON.parse(res.options[0].value);
		this.userList.push(user);
	}
	onUserLogout(res) {
		console.log(res);
		var uid = res.options[0].value;
		for(var i = 0; i < this.userList.length; i++) {
			if(this.userList[i].id == uid) {
				this.userList.splice(i, 1);
				break;
			}
		}
		if(uid == this.roomInfo.teacherId){
			this.isTeacherInRoom = false;
			try{
				actorPlugins.destroyView("leaveRoom", (msg) => {
					this.message = msg;
				});
			}catch(e){
				//TODO handle the exception
				console.log(e);
			}
			
		}
	}
	onRoomChat(res) {
		var uname = "未知";
		var icon = "";
		for(var i = 0; i < this.userList.length; i++) {
			if(this.userList[i].id == res.fromUserId) {
				uname = this.userList[i].name;
				icon = this.userList[i].icon;
				break;
			}
		}
		var mtime = new Date(parseInt(res.options[1].value));
		var content = res.options[0].value
		this.toBottom = true;
		console.log(content);
		this.chatList.push({
			id: res.fromUserId,
			name: uname,
			icon: icon,
			time: mtime,
			content: content
		});
		this.messageToBottom();
		this.showBarrage(uname, content);
		this.cutChatList();
	}
	onSingleChat(res) {
		console.log("************************************");
		console.log(res);
		console.log(this.userList);
		var uname = "未知";
		var icon = "";
		console.log(this.userList.length);
		for(var i = 0; i < this.userList.length; i++) {
			if(this.userList[i].id == res.fromUserId) {
				uname = this.userList[i].name;
				icon = this.userList[i].icon;
				break;
			}
		}
		var mtime = new Date(parseInt(res.options[1].value));
		/*收到消息*/
		var content = res.options[0].value;
		var arr = content.split("_&%#_");
		if(arr[0] == "accept" && arr[1] == "live") {
			content = "accept_&%#_" + "同意连麦.";
			this.setJoinActor("true");
		} else if(arr[0] == "disable" && arr[1] == "live") {
			content = "disable_&%#_" + "禁止连麦.";
			this.setJoinActor("false");
		} else if(arr[0] == "voicetest") {
			content = "voicetest_&%#_收到评测信息:" + arr[1];
			this.testD2(arr[1]);
		} else if(arr[0] == "live" && arr[1] == "login") {
			this.pushView();/*************************************************************/
			this.initSpeech();/************************************************/
			this.isTeacherInRoom = true;
			content = "同学们好！";
		}
		console.log("接收到的arr: "+arr[0]+"   "+arr[1]);
		this.toBottom = true;
		console.log(content);
		this.chatList.push({
			id: res.fromUserId,
			name: uname,
			icon: icon,
			time: mtime,
			content: content
		});
		this.messageToBottom();
		this.showBarrage(uname, content);
		this.cutChatList();

	}
	cutChatList() {
		//if(this.chatList.length>5){
		//	this.chatList.splice(0,this.chatList.length-5);
		//}
		if(this.chatListHelf.length>2){
			this.chatListHelf.splice(0,this.chatListHelf.length-2);
			this.chatListHelf.push(this.chatList[this.chatList.length-1]);
		}else{
			if(this.chatList.length>0){
				this.chatListHelf.push(this.chatList[this.chatList.length-1])
			}
		}
		
	}
	showBarrage(name, contentstr) {
		console.log(contentstr);
		var arr = contentstr.split("_&%#_");
		var span = $("<span></span>");
		//		if(arr[0] == "can") {
		//			span.addClass("gift-effect");
		//			span.html('<img src="img/live2-icon-gt@2x.png" />');
		//		} else if(arr[0] == "cookie") {
		//			span.addClass("gift-effect");
		//			span.html('<img src="img/live2-icon-cookie@2x.png" />');
		//		}
		var ll = $(window).width() * 0.5 - 30;
		var tt = $(".barrage").height() - 100;
		//tt *= Math.random();
		span.css("left", ll + "px");
		span.css("top", tt + "px");
		$(".barrage").append(span);
		span.animate({
			top: 30,
			easing: "linear"
		}, 2000, function() {
			span.remove();
		});
	}
	onChatHistory(res) {
		var notfirst = this.chatList.length > 0;
		var arr = JSON.parse(res.options[0].value);
		console.log("历史记录：");
		console.log(notfirst);
		console.log(arr);
		if(notfirst) {
			if(arr.length > 0) {
				this.toBottom = false;
				arr.reverse();
			} else {
				$(".more-chat").hide();
				$(".no-more-chat").show();
			}
		}
		console.log(arr.length);
		for(var i = 0; i < arr.length; i++) {
			var mes = {
				transactionId: arr[i].transactionId,
				id: arr[i].userId,
				icon: arr[i].icon,
				name: arr[i].name,
				time: new Date(parseInt(arr[i].sendTime)),
				content: arr[i].chat,
			};
			if(notfirst) {
				this.chatList.unshift(mes);
			} else {
				console.log(mes);
				this.chatList.push(mes);
				this.messageToBottom();
//				this.cutChatList();
			}
		}
		console.log(this.chatList);
		this.cutChatList();
	}
	onShareObjectGet(res) {
		switch(res.options[0].value) {
			case "docConfig":
				if(res.options[1].value != "") {
					var obj = JSON.parse(res.options[1].value);
					this.docIndex = obj.index;
					this.page = obj.page;
				}
				break;
			case "docImg":
				this.pptImgUrl = res.options[1].value;
				break;
			case "config":
				if(res.options[1].value != "") {
					var obj = JSON.parse(res.options[1].value);
				}
				break;
		}
	}
	onShareObjectUpd(res) {
		var canvas = this.myCanvas.nativeElement;
		switch(res.options[0].value) {
			case "draw":
				var point = res.options[1].value;
				if(point.indexOf("SET") != -1) {
					var arr = point.split(":")[1].split("_");
					this.ctx.strokeStyle = arr[0];
//					this.ctx.lineWidth = arr[1];
					this.ctx.lineWidth = 2;
					this.ctx.beginPath();
					this.ctx.lineJoin = "round";
					this.ctx.lineCap = "round";
				} else if(point != "UP") {
					if(point == "CLEAR") {
						canvas.width = canvas.width;
					} else {
						var xy = point.split("_");
						var xx = canvas.width * xy[0];
						var yy = canvas.height * xy[1];
						this.ctx.lineTo(xx, yy);
						this.ctx.stroke();
					}
				}
				break;
			case "docConfig":
				if(res.options[1].value != "") {
					var obj = JSON.parse(res.options[1].value);
					this.docIndex = obj.index;
					this.page = obj.page;
				}
				break;
			case "docImg":
				this.pptImgUrl = res.options[1].value;
				break;
			case "config":
				if(res.options[1].value != "") {
					var obj = JSON.parse(res.options[1].value);
				}
				break;
		}
	}
	openMessageDiv(mode) {
		if(mode == 0) {
			this.openChat = false;
			//								$(".btn-like").hide();
			//								$("#txtMes").attr("disabled", true);
			//								$("#txtMes").attr("placeholder", "聊天未开启");
		} else {
			this.openChat = true;
			//								$(".btn-like").show();
			//								$("#txtMes").attr("disabled", false);
			//								$("#txtMes").attr("placeholder", "发言（最多50字）");
		}
	}
	sendMessage(ct, htmlstr) {
		for(var i = 0; i < this.userList.length; i++) {
			if(this.userList[i].id == this.userInfo.userId && this.userList[i].auth[0].SPEAK == 0) {
				this.weui.showAlert("通知","您被禁言了","关闭");
				return;
			}
		}
		var objstr = ct + "_&%#_" + htmlstr;
		this.showBarrage("我", objstr);
		this.ws.sendRoomMessage(this.userInfo.courseId, this.userInfo.userId, objstr);
		this.toBottom = true;
		this.chatList.push({
			id: this.userInfo.userId,
			name: this.userInfo.userName,
			icon: this.userInfo.userIcon != "" ? this.userInfo.userIcon : "",
			time: new Date(),
			content: objstr
		});
		this.messageToBottom();
		this.cutChatList();
	}
	sendSingleMessage(ct, htmlstr, teacherId) {
		var objstr = ct + "_&%#_" + htmlstr;
//		if(ct != "voiceresult"){
//			this.showBarrage("我", "结果已提交");
//		}else{
//			this.showBarrage("我", objstr);
//		}
		this.ws.sendSingleMessage(this.userInfo.courseId, this.userInfo.userId, objstr, teacherId);
//		this.toBottom = true;
//		if(ct == "handsup" && htmlstr == "live") {
//			objstr = ct + "_&%#_已发送举手请求";
//		}
//		this.chatList.push({
//			id: this.userInfo.userId,
//			name: this.userInfo.userName,
//			icon: this.userInfo.userIcon != "" ? this.userInfo.userIcon : "",
//			time: new Date(),
//			content: objstr
//		});
//		this.messageToBottom();
//		this.cutChatList();

	}
	testD(value) {
		console.log(value);
		if(value==""||value==null||value==undefined){
			
		}else{
			this.sendMessage("text", value.trim().replace(/\</g, "&lt;").replace(/\>/g, "&gt;"))
			$(".sentInput").val("");			
		}

	}
	testD2(testWord) {
		this.word = testWord;
		if(this.isActoring){
			
		}else{
			let actionSheet = this.actionSheetCtrl.create({
				title: '收到一条语音评测'+this.word,
				buttons: [{
					text: '开始评测',
					role: 'speek',
					handler: () => {
						this.setVolume(true);
						this.isShowVoice = true;
						this.isSpeeking = true;
						this.isReadOver = false;
						this.speek(this.word);
					}
				}, {
					text: '取消',
					role: 'cancel',
					handler: () => {
						this.setVolume(false);
						
					}
				}]
			});
			actionSheet.present();			
		}

	}
	/*语音*/
	initSpeech() {
		this.speechStatus = "初始化录音中";
		var endTime = "1200";
		this.subjectType = "word";
		var message = "readType="+this.subjectType+"&language=en&beginTime=3000&endTime=" + endTime + "&maxTime=120000";
		try{
			VoiceSairalPlugins.coolMethod(message, (msg) => {
				console.log("语音初始化");
				this.speechStatus = "初始化完成";
				this.loadingMsg = "正在分析……";
	//			this.loading = this.loadingCtrl.create({
	//				content: this.loadingMsg,
	//				dismissOnPageChange: true
	//			});
				this.isSpeeking = false;
	//			this.loading.present();
				this.readOverCallback(msg);//分析用户的读音
				this.ref.markForCheck();//提示当前要被检测
				this.ref.detectChanges();//检查和更检测程序,也可以进行局部的检测
			}, (err) => {
				this.isSpeeking = false;
				this.ref.markForCheck();
				this.ref.detectChanges();
				this.weui.showAlert('语音解析错误',err.msg,'确定');
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
		
	}
	speek(word) {//单词录音
		this.goSpeech(word);
	}
	goSpeech(subject) {
		var appid = "5a056aa7";//正式
		var message = "text=" + subject + "&appId=" + appid + "&readType=word";//当前单词的详细信息
		try{
			VoiceSairalPlugins.startSpeech(message, (msg) => {
				this.isSpeeking = true;// 显示播放按钮
				this.speechStatus = "正在说话……";
				this.volume = msg;//音量
				this.getSpeechVolume();//单词发音的声音大小
				this.ref.markForCheck();//数据检测
				this.ref.detectChanges();//数据更新
			}, (err) => {
				console.log(err);
				this.isSpeeking = false;//播放按钮
				this.weui.showAlert('获取语音错误',err,'确定');
			});
			
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	getSpeechVolume() {//音量大小
		console.log("检测用户是否发音");
		try{
			VoiceSairalPlugins.getSpeechVolume("aaaa", (msg) => {
				this.volume = Number(msg);
				if(this.volume > 35) {
					this.volume = 35;
				}
				this.volumeShadow = "0 0 " + this.volume * 2 + "px #44c2cb";
				this.ref.markForCheck();
				this.ref.detectChanges();
				this.getSpeechVolume();
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	readOver() {//手机点击语音分析
		console.log("手机点击语音分析")
		this.loadingMsg = "正在分析";
//		this.loading = this.loadingCtrl.create({
//			content: this.loadingMsg,
//			dismissOnPageChange: true
//		});
//		this.loading.present();
		this.isSpeeking = false;//播放按钮
		//发送用户的读音
		try{
			VoiceSairalPlugins.stopSpeech("aaaa", (msg) => {
	//			this.loading.dismiss();
				this.readOverCallback(msg);
			}, (err) => {
	//			this.loading.dismiss();
				this.xmlInfo = err;
				this.ref.markForCheck();
				this.ref.detectChanges();
				this.weui.showAlert('停止错误:原因:',err.msg,'确定');
			});
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	readOverCallback(msg) {//分析用户的读音
		this.setVolume(false);
		this.isReadOver = true;
		console.log('分析用户的读音')
		this.isSpeeking = false;//播放按钮
		this.loadingMsg = "正在解析……";
		this.speechStatus = msg;//评测文字提示
		this.result = msg;//未知
		var data = eval('(' + msg + ')');//返回的测评数据
		if(data.code == 0) {
			this.xmlDatas = getXmlData(data.msg, this.subjectType);
			var isRight = true;//显示下一个单词
			if(this.xmlDatas[0].is_rejected != "false") {//为true的时候表明检测为乱读
				isRight = false;
				let toast = this.toastCtrl.create({
					message: '系统检测为乱读，请重新阅读',
					duration: 3000,
					position: 'middle'
				});
				toast.present();
			}
			if(this.xmlDatas[0].except_info != '0' && this.xmlDatas[0].except_info != undefined) {
				let errMsg = "";
				console.log("当前详细数字为:"+errMsg)
				if(this.xmlDatas[0].except_info == '28673'){
					errMsg = "无语音输入或音量太小";
				} else if(this.xmlDatas[0].except_info == '28676') {
					errMsg = "检测到语音为乱说类型";
				} else if(this.xmlDatas[0].except_info == '28680') {
					errMsg = "音频数据信噪比太低";
				} else if(this.xmlDatas[0].except_info == '28690') {
					errMsg = "音频数据出现截幅";
				} else {
					errMsg = "错误,请重新阅读";
				}
				isRight = false;
				let toast2 = this.toastCtrl.create({
					message: errMsg,
					duration: 3000,
					position: 'middle'
				});
				toast2.present();
			}
			if(isRight) {
				this.score = this.xmlDatas[0].chapterScore;
//				this.loading.dismiss();
				this.isReadOver = true;
				
				var resultArray = new Array();
				if(this.subjectType == "word") {
					for(var m = 0; m < this.xmlDatas.length; m++) {
						for(var i = 0; i < this.xmlDatas[m].childrenArr.length; i++) {
							resultArray.push({
								content: transformSymbols(this.xmlDatas[m].childrenArr[i].content),
								score: this.xmlDatas[m].childrenArr[i].syll_score
							});
						}
					}

				}
				
				
				var message = this.score+"###"+this.word+"###"+JSON.stringify(resultArray);
				this.sendSingleMessage("voiceresult", message, this.roomInfo.teacherId);
			} else {
//				this.loading.dismiss();
//				this.isReadOver = false;
				this.isShowVoice = false;
				this.isSpeeking = false;
				this.isReadOver = false;
				this.score = 0;
			}
		} else {
//			this.loading.dismiss();
//			this.isReadOver = false;
				this.isShowVoice = false;
				this.isSpeeking = false;
				this.isReadOver = false;
				this.score = 0;
		}

		this.ref.markForCheck();
		this.ref.detectChanges();
	}
	closePanel(){
		this.isShowVoice = false;
		this.isSpeeking = false;
		this.isReadOver = false;
		this.score = 0;
	}
	imgError(e) {
//		e.target.style.visibility = "hidden";
		$(e.target).attr("src", "assets/imgs/live/default_photo.png");
	}
	onFaceClick() {
		this.sendMessage("emoj", "<img src='http://static.gensee.com/webcast/static/emotion/emotion.smile.gif' />");
	}
	requestActor(teacherId) {
		let toast = this.toastCtrl.create({
			message: '已举手,等待老师同意……',
			duration: 2000
		});
		toast.present();
		this.sendSingleMessage("handsup", "live", teacherId);
	}
	messageToBottom() {
		setTimeout(()=>{
			$(".barrage").scrollTop(55000);
			$(".barrageArea").scrollTop(55000);	
		},100);

	}
	timeCount(){
		this.timeCountInterval = setInterval(()=>{
			this.sysTime+=1000;
			if(this.sysTime-this.roomInfo.classTime<0){
				this.isClass = false;
			}else{
				this.isClass = true;
				try{
					this.ws.heart();
				}catch(e){
					//TODO handle the exception
				}
			}
		},1000)
	}
	ngAfterViewInit() {
//		this.afterViewInit();
	}
	afterViewInit(){
		this.changeTag(0);
		this.courseId = this.navParams.get("courseId");
		this.seriesId = this.navParams.get("seriesId");
		this.classId = this.navParams.get("classId");
		this.courseObj = this.navParams.get("courseObj");
		console.log(this.courseObj);
		this.viewType = this.navParams.get("viewType");
		this.userInfo.userId = this.comman.getGlobal("userId");
		this.userInfo.token = this.comman.getGlobal("token");
		this.initData();
		this.initUI();
	}
	ionViewDidEnter() {
		this.isBgTransparent = true;
		this.afterViewInit();
	}
	ionViewWillEnter() {
	}
	ionViewWillLeave() {
		try{
			this.brightness.setKeepScreenOn(false);//屏幕常亮
			clearInterval(this.timeCountInterval);
			this.ws.logout(this.userInfo.courseId, this.userInfo.userId); // roomid   userid 根据自己写的来
			this.destroyView();
			window['page-live-actor'].destroy();
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	backPage(){
		try{
			if(this.platform.is('ios') || this.platform.is('android')) {
		    	this.navCtrl.popToRoot();
			}
		}catch(e){
			//TODO handle the exception
			console.log(e);
		}
	}
	ionViewDidLeave() {
		this.isBgTransparent = false;

	}
	goLogin() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {});
		loginModalCtrl.present();
   		loginModalCtrl.onDidDismiss(data => {
			this.afterViewInit();
//			this.navCtrl.pop();
		});
	}
	checkMask() {
		let activePortalArray = this.ionicApp._modalPortal._views;
		console.log(activePortalArray);
		if(activePortalArray.length > 0) {
			//			this.dismissMask(activePortalArray);
			return false;
		} else {
			return true;
		}

	}
}