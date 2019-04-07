import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Header, Platform } from 'ionic-angular';
import { commanModel } from '../../model/comman/comman';
import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { SpecialSharePopPage } from '../../pages/share_pop/share_pop';//分享模态框
import { TeacherIndexPage } from '../../pages/teacher-index/teacher-index'; //教师详情页面
import { SAWS } from '../../assets/js/SAWS.js'
import { Brightness } from '@ionic-native/brightness';
import { setTimeout } from 'timers';

declare var actorPlugins: any; //使用自定义插件
declare var VoiceSairalPlugins: any; //使用自定义插件

@IonicPage()
@Component({
  selector: 'page-live',
  templateUrl: 'live.html',
})
export class LivePage {

  userId:string = "";
  token:string = "";
  userInfo:any = {name:"loading..."};

  @ViewChild("header") header: ElementRef;
  @ViewChild("mycan") canvas: ElementRef;
  @ViewChild("pptPanel") pptPanel: ElementRef;
  @ViewChild("messageUl") messageUl: ElementRef;
  @ViewChild("myinput") myinput: ElementRef;
  ctx:any;

  mode:number = 0;
  bottomBarHeight:number = 49;
  filePath:string = "";

  sourceId:string = "";
  sourceInfo:any = {};
  roomInfo:any = {};
  pptList:any = [];
  chatList:any = [];
  chatBullet:any = []; //弹幕
  inputMsg:string = ""; //输入框的内容
  isTeacherLive:boolean = false; //老师是否正在直播

  ws: any; //socket对象
  wsTimer:any; //WebSocket的心跳计时器
  wsTimerCount = 3000; //WebSocket的心跳时间间隔（毫秒）
  wsRoomId:string = ""; //WebSocket房间号
  userList:any = []; //房间内人员列表
  pptUrl:string = ""; //当前PPT的url
  docindex:number = 0; //当前是第几个文档
  page:number = 0; //当前是第几页

  constructor
  (
    public navCtrl: NavController, 
    public navParams: NavParams,
    private common: commanModel,
    private weui: WeuiModel,
    public wx:WxsharePage,
    public modalCtrl: ModalController,
    private brightness: Brightness,
    private plt: Platform
  ) 
  {
    this.brightness.setKeepScreenOn(true); //开启屏幕常亮
    this.bottomBarHeight = this.navCtrl.parent._tabbar.nativeElement.clientHeight+15;
    this.userId = this.common.getGlobal("userId");
    this.token = this.common.getGlobal("token");
    this.sourceId = this.navParams.get("id");
    this.getSourceInfo();
  }

  getSourceInfo(){
    this.common.request("SA", "sourceInfo", 
      {
        userId:this.userId, 
        token:this.token, 
        dataType:10, 
        sourceId:this.sourceId
      }, 
      (data)=>{
      if(data.code==0){
        this.filePath = data.filePath;
        if(data.data.length>0){
          if(data.data[0].isBuy<0){
            data.data[0].isBuy = 0;
          }
          this.sourceInfo = data.data[0];
          if(this.sourceInfo.files!=undefined){
            this.pptList = this.sourceInfo.files.split(",");
          }
          this.getRoomInfo();
        }else{
          this.log("当前直播没有内容");
        }
      }else{
        this.log(data.msg);
      }
    }, (err)=>{
      if(err=="10099"){
        this.log("登录失效，请重新登录");
      }else{
        this.log("网络错误");
      }
    })
  }

  getRoomInfo(){
    this.common.request("Course", "getLiveRoomInfo", {userId:this.userId, token:this.token, courseId:this.sourceId}, (data)=>{
      if(data.code==0){
        this.roomInfo = data.roomInfo;
        if(this.sourceInfo.isBuy!=0){
          this.joinRoom();
        }else{
          //先预约
        }
      }else{
        this.log(data.msg);
      }
    }, (err)=>{
      if(err=="10099"){
        this.log("登录失效，请重新登录");
      }else{
        this.log("网络错误");
      }
    })
  }

  log(msg){
    this.weui.showAlert("获取直播失败", msg, "确定");
  }

  log2(msg, conformBack?){
    this.weui.showAlert("提示", msg, "", "确定", ()=>{}, ()=>{
      if(conformBack){
        this.navCtrl.pop();
      }
    });
  }

  ionViewDidLoad() {
    //...
  }

  gotoTeacherDetail(){
    this.navCtrl.push(TeacherIndexPage, {teacherId:this.sourceInfo.teacherId});
  }

  onBuyTap(){
    let loading = this.weui.showLoading("预约中");
    this.common.request("SA", "bookLive", {userId:this.userId, token:this.token, sourceId:this.sourceId}, (data)=>{
      this.weui.hideLoading(loading);
      if(data.code==0){
        this.sourceInfo.isBuy = 1;
        this.weui.showToast("预约成功", {position:"middle"});
        this.joinRoom();
      }else{
        this.weui.showAlert("预约失败", data.msg, "确定");
      }
    }, (err)=>{
      this.weui.hideLoading(loading);
      if(err=="10099"){
        this.weui.showAlert("预约失败", "登录已失效", "确定");
      }else{
        this.weui.showAlert("预约失败", "网络问题", "确定");
      }
    })
  }

  //加入聊天室
  joinRoom(){
    //先获取用户基本信息
    this.common.getUserInfo((success, data)=>{
      if(success){
        if(data.nickName!=undefined && data.nickName!=""){
          data.name = data.nickName;
        }else{
          data.name = data.userName;
        }
        this.userInfo = data;
        //初始化socket、加入房间
        this.wsRoomId = "speciala_"+this.sourceId;
        this.ws = new SAWS();
        this.ws.init();
        this.ws.onopen = () => {
          //创建心跳
          this.wsTimer = setInterval(()=>{
            this.ws.heart();
          }, this.wsTimerCount);
          //登录聊天室
          this.ws.login(this.wsRoomId, this.userId, "405486", 3, this.userInfo.name, this.userInfo.userImg);
        }
        this.ws.onmessage = (res) => {
          //console.log("<WebSocket onMessage>", res);
          this.onWSMessage(res);
        };
        this.ws.onclose = () => {
          console.log("SOCKET连接已关闭！");
        }
      }else{
        this.userInfo.name = data;
      }
    });
  }

  //聊天室登录成功
  onJoinRoom(){
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.ws.getRoomUserList(this.wsRoomId, this.userId);
    this.ws.getRoomHistoryChat(this.wsRoomId, this.userId);
    this.ws.getShareObject(this.wsRoomId, this.userId, "docImg");
    this.ws.getShareObject(this.wsRoomId, this.userId, "docConfig");
    this.initSpeech();
  }

  //处理收到的socket消息
  onWSMessage(res){
    switch(res.type) {
      case SAWS.MES_DOWN_REGIST:
        if(res.status == 0) {
          //登录成功
          this.onJoinRoom();
        } else {
          //登录失败
          this.log2("登录房间失败");
        }
        break;
      case SAWS.MES_DOWN_ROOM_LIST:
        //获取到人员列表、有人登陆或退出
        this.onGetUserList(res);
        break;
      case SAWS.MES_DOWN_CHAT_ROOM:
        //房间内有人发消息
        console.log("<WebSocket消息>", "房间内有人发消息", res);
        this.onRoomChat(res);
        break;
      case SAWS.MES_DOWN_CHAT_SINGLE:
        //有人给你发私信
        this.onSingleMessage(res);
        break;
      case SAWS.MES_DOWN_SHARE_UPD:
        //共享对象被修改了
        console.log("<WebSocket消息>", "共享对象被修改了", res);
        if(res.options[0].value=="docConfig" && res.options[1].value!=""){
          var obj = JSON.parse(res.options[1].value);
          this.docindex = obj.index;
          this.page = obj.page;
        }else if(res.options[0].value=="docImg" && res.options[1].value!=""){
          this.mode = 1;
          this.pptUrl = res.options[1].value;
        }else if(res.options[0].value=="draw" && res.options[1].value!=""){
          var point = res.options[1].value;
          if(point.indexOf("SET") != -1) {
            var arr = point.split(":")[1].split("_");
            this.ctx.strokeStyle = arr[0];
  					//this.ctx.lineWidth = arr[1];
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "round";
          } else if(point != "UP") {
            if(point == "CLEAR") {
              this.canvas.nativeElement.width = this.canvas.nativeElement.width;
            } else {
              var xy = point.split("_");
              var xx = this.canvas.nativeElement.width * xy[0];
              var yy = this.canvas.nativeElement.height * xy[1];
              this.ctx.lineTo(xx, yy);
              this.ctx.stroke();
            }
          }
        }
        break;
      case SAWS.MES_DOWN_RESPONSE:
        if(res.status != 0) {
          if(res.status == 10095 || res.status == 10096) { //禁言 10095  解除禁言 10096
            var alertMsg = "";
            if(res.status == 10095) {
              this.log2("你被禁言了");
            } else if(res.status == 10096) {
              this.log2("禁言解除了");
            }
            for(var i = 0; i < this.userList.length; i++) {
              if(this.userList[i].id == res.toUserId) {
                this.userList[i].auth[0].SPEAK = (res.status == 10095 ? 0 : 1);
                break;
              }
            }
          }else if(res.status == 10097){ //10097 踢人
            this.log2("你被移出了房间",()=>{
              this.navCtrl.pop();
            });
          }else {
            //其他情况的提示...
            console.log("其他状况", res);
          }
        }
        break;
      case SAWS.MES_DOWN_SHARE_GET:
        //获取到共享对象数据
        console.log("<WebSocket消息>", "获取到共享对象数据", res);
        if(res.options[0].value=="docConfig" && res.options[1].value!=""){
          var obj = JSON.parse(res.options[1].value);
          this.docindex = obj.index;
          this.page = obj.page;
        }else if(res.options[0].value=="docImg" && res.options[1].value!=""){
          this.mode = 1;
          this.pptUrl = res.options[1].value;
        }
        break;
      case SAWS.MES_DOWN_CHAT_HISTORY:
        //获取到聊天历史记录
        console.log("<WebSocket消息>", "获取到聊天历史记录", res);
        this.onRoomChatHistory(res);
        break;
      case SAWS.MES_DOWN_ROOM_DISPOSE:
        console.log("房间已销毁");
        break;
      case SAWS.MES_DOWN_SHAREHIS_GET:
        console.log("<WebSocket消息>", "获取到共享对象历史数据", res);
        //获取到共享对象历史数据
        var pointArr = res.options[0].value.split(",");
        for(var i = 0; i < pointArr.length; i++) {
          if(pointArr[i].indexOf("SET") != -1) {
            var arr = pointArr[i].split(":")[1].split("_");
            this.ctx.strokeStyle = arr[0];
						//this.ctx.lineWidth = arr[1];
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.lineJoin = "round";
            this.ctx.lineCap = "round";
          } else if(pointArr[i] != "UP") {
            var xy = pointArr[i].split("_");
            var xx = this.canvas.nativeElement.width * xy[0];
            var yy = this.canvas.nativeElement.height * xy[1];
            this.ctx.lineTo(xx, yy);
          } else {
            this.ctx.stroke();
          }
        }
        break;
    }
  }

  onGetUserList(res){
    switch(res.options[0].key) {
      case 1:
        //获取到房间人员列表
        console.log("<WebSocket消息>", "获取到房间人员列表", res);
        var arr = JSON.parse(res.options[0].value);
        for(var i=0; i<arr.length; i++){
          this.userList.push(arr[i]);
        }
        break;
      case 11:
        //有人进入房间
        console.log("<WebSocket消息>", "有人进入房间", res);
        var user = JSON.parse(res.options[0].value);
        this.userList.push(user);
        break;
      case 12:
        //有人离开房间
        console.log("<WebSocket消息>", "有人离开房间", res);
        var uid = res.options[0].value;
        for(var i=0; i<this.userList.length; i++){
          if(this.userList[i].id==uid){
            this.userList.splice(i,1);
            break;
          }
        }
        if(uid == this.roomInfo.teacherId){
          this.isTeacherLive = false;
          if(this.plt.is("cordova")){
            actorPlugins.destroyView("leaveRoom", (msg) => {
              console.log(msg);
            });
          }
        }
        break;
    }
  }

  onRoomChatHistory(res){
    var arr = JSON.parse(res.options[0].value);
    for(var i=0; i<arr.length; i++){
      var chatarr = arr[i].chat.split("_&%#_");
      if(chatarr[0]=="text"){
        arr[i].content = chatarr[1];
        arr[i].time = this.formatChatTime(arr[i].sendTime);
        arr[i].isme = arr[i].userId==this.userId;
        this.chatList.push(arr[i]);
      }
    }
    var max = this.chatList.length>=3 ? this.chatList.length-3 : 0;
    for(var j=max; j<this.chatList.length; j++){
      this.chatBullet.push(this.chatList[j]);
    }
  }

  onRoomChat(res) {
    var chatarr = res.options[0].value.split("_&%#_");
    if(chatarr[0]!="text") return;
    var obj = {};
		obj["name"] = "未知";
    obj["icon"] = "";
    obj["isme"] = false;
		for(var i = 0; i<this.userList.length; i++) {
			if(this.userList[i].id == res.fromUserId) {
				obj["name"] = this.userList[i].name;
				obj["icon"] = this.userList[i].icon;
				break;
			}
    }
    obj["sendTime"] = res.options[1].value;
		obj["time"] = this.formatChatTime(Number(res.options[1].value));
		obj["content"] = chatarr[1];
    this.chatList.push(obj);
    if(this.chatBullet.length==3){
      this.chatBullet.splice(0, 1);
    }
    this.chatBullet.push(obj);
    this.messageToBottom();
  }

  onSingleMessage(res){
    console.log("<WebSocket消息>", "有人给你发私信", res);
    var arr = res.options[0].value.split("_&%#_");
    if(arr[0]=="voicetest"){
      var testWord = arr[1];
      console.log("<语音评测功能 建设中...>", testWord);
    }else if(arr[0]=="accept" && arr[1]=="live"){
      if(this.plt.is("cordova")){
        actorPlugins.setJoinActor("true", (msg) => {
          console.log(msg);
        });
      }
    }else if(arr[0]=="disable" && arr[1]=="live"){
      if(this.plt.is("cordova")){
        actorPlugins.setJoinActor("false", (msg) => {
          console.log(msg);
        });
      }
    }else if(arr[0] == "live" && arr[1] == "login"){
      this.isTeacherLive = true;
      this.initLiveNative();
    }
  }

  //实例化直播原生插件
  initLiveNative(){
    this.common.request("WangYiCloud", "createImId", {userId: this.userId.toLowerCase(), name: this.userInfo.name}, (data) => {
			if(data.code == 0) {
				var actorToken = data.token;
				var width = 320;
				var height = 480;
				var isActorType = 'false';
        var messageParam = "width=" + width + 
                           "&height=" + height + 
                           "&roomId=" + this.roomInfo.roomId + 
                           "&userId=" + this.userId.toLowerCase() + 
                           "&token=" + actorToken + 
                           "&isActor=" + isActorType + 
                           "&teacherId=" + this.roomInfo.teacherId;
				if(this.plt.is("cordova")){
					actorPlugins.initActor(messageParam, (msg) => {
						console.log(msg);
					});
				}
			}else{
        this.log2(data.msg);
      }
		}, (err) => {
			if(err=="10099"){
        this.log2("登录失效，请重新登录");
      }else{
        this.log2("忘了错误，请检查你的网络");
      }
		})
  }

  onChatSubmit(event){
    event.stopPropagation();
    this.onSendChat();
    this.myinput.nativeElement.blur();
  }
  
  onSendChat(){
    var msg = this.inputMsg.trim();
    if(msg!=""){
      for(var i=0; i<this.userList.length; i++) {
        if(this.userList[i].id==this.userId) {
          if(this.userList[i].auth[0].SPEAK == 0){
            this.log2("你被禁言了");
            return;
          }
        }
      }
      var msgcontent = "text" + "_&%#_" + msg;
      this.ws.sendRoomMessage(this.wsRoomId, this.userId, msgcontent);
      var timecount = (new Date()).getTime();
      var time = this.formatChatTime(timecount);
      var obj = {
        id: this.userId,
        isme: true,
        name: this.userInfo.name,
        icon: this.userInfo.userImg,
        sendTime: timecount,
        time: time,
        content: msg
      }
      this.chatList.push(obj);
      if(this.chatBullet.length==3){
        this.chatBullet.splice(0, 1);
      }
      this.chatBullet.push(obj);
      this.inputMsg = "";
      this.messageToBottom();
    }else{
      this.weui.showToast("请输入聊天内容", {position:"middle"});
    }
  }

  messageToBottom(){
    setTimeout(()=>{
      var mainH = this.pptPanel.nativeElement.clientHeight;
      var messH = this.messageUl.nativeElement.clientHeight;
      this.pptPanel.nativeElement.scrollTop = messH-mainH+15;
    }, 300);
  }

  formatChatTime(timecount){
    var date = new Date(Number(timecount));
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds().toString();
    hour = hour.length==1 ? "0"+hour : hour;
    minute = minute.length==1 ? "0"+minute : minute;
    second = second.length==1 ? "0"+second : second;
    return hour+":"+minute+":"+second;
  }

  onPPTLoaded(ppt){
    this.canvas.nativeElement.width = ppt.clientWidth;
    this.canvas.nativeElement.height = ppt.clientHeight;
    this.ws.getShareHistory(this.wsRoomId, this.userId, "draw", this.docindex, this.page);
  }

  //科大讯飞语音评测实例化
	initSpeech() {
		//功能建设中......
  }
  
  onHandsUp() {
		this.weui.showToast("请等待老师同意", {position:"middle"});
		this.ws.sendSingleMessage(this.wsRoomId, this.userId, "handsup_&%#_live", this.roomInfo.teacherId);
	}

  onShareTap(){
		let SharePopModal = this.modalCtrl.create(SpecialSharePopPage,{});
		SharePopModal.present();
		SharePopModal.onDidDismiss((data)=>{
			console.log(data)
			if(data.isshareFriend){
			    this.doShare(0);
			}
			if(data.isshareCircle){
				this.doShare(1);
			}
		});
	}
	
	doShare(mode){
    let shareURL = "http://my.saclass.com/app/new-live.html?id="+this.sourceId;
		let shareIcon = this.roomInfo.smallPic;
		this.wx.shareWx(
			this.roomInfo.className,
			"特优生直播课程邀您来体验",
			mode,
			shareURL,
			1,
			shareIcon,
			()=>{
		   		//分享成功
			}
		)
		console.log({url:shareURL, title:this.roomInfo.className, summary:"特优生精品课程邀您来体验", icon:shareIcon});
  }

  ngOnDestroy(){
    this.brightness.setKeepScreenOn(false); //关闭屏幕常亮
    if(this.ws){
      clearTimeout(this.wsTimer); //清除socket心跳
      this.ws.logout(this.wsRoomId, this.userId); //退出socket房间
    }
    if(this.plt.is("cordova")){
      actorPlugins.destroyView("destroy", (msg) => {
        console.log(msg);
      });
    }
  }
  
  ionViewWillLeave() {
    
	}

}
