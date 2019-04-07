import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import {IonicApp, NavController, ModalController, Platform, Events } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { WxsharePage } from '../../model/wxshare/wxshare'; //分享
import { SpecialSharePopPage } from '../../pages/share_pop/share_pop';//分享模态框
//components
import { PunchCardDateComponent } from '../../components/punch-card-date/punch-card-date';
@Component({
	selector: 'page-punchCard',
	templateUrl: 'punchCard.html'
})
export class PunchCardPage {
	@ViewChild("punchCanvas") punchCanvas: ElementRef;
	@ViewChild("header") header: ElementRef;
//	@ViewChild("img_") img: ElementRef;
	@ViewChild(PunchCardDateComponent) PunchCardDateComponent: PunchCardDateComponent;
	year: any; //年
	month: any; //月
	dayArray: any = []; //每个月有多少天包括格子
	slidesArr: any = []; //滑动块
	winWidth: number = 0;
	winHeight: number = 0;
	canvas_: any; //canvas
	canvasWidth: number = 0;
	canvasHeight: number = 0;
	canvasContent: any = []; //canvas内容
	weekHeight: number = 50; //传子组件属性周的高
	monthHeight: number = 50; //传子组件属性月的高
	userId: string = '';
	token: string = '';
	dayNumber: number = 0; //一共打卡多少天
	bottomHeight: number = 0;
	headerHeight:number = 0;
	sourceSrc:string = '';//图片路径的前缀
	dataURL:string = '';//生成分享图的url
	randomNum:number = 0;//随机抽取展示的分享背景的图文
	cavasDom:any;//canvas的dom
	isPunchCard:boolean = false;//默认未打卡
	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		public WxsharePage: WxsharePage,
		private weui: WeuiModel,
		private ref: ChangeDetectorRef, //脏检查
		private comman: commanModel,
		public plt: Platform,
		private ionicApp: IonicApp,
	) {
		this.checkUserInfo();
		this.init();
		

	}
	
	
	
	
	/*点击分享按钮弹出层*/
	shareFn_title(){
		let SharePopModal = this.modalCtrl.create(SpecialSharePopPage,{});
		SharePopModal.present();
		SharePopModal.onDidDismiss((data)=>{
			console.log(data)
			if(data.isshareFriend){
			    this.shareFn(0);
			}
			if(data.isshareCircle){
				this.shareFn(1);
			}
		});
		
		
	}
	
	/*检查登录-一开始就需要检查*/
	checkUserInfo() {
		var userId = this.comman.getGlobal("userId");
		var token = this.comman.getGlobal("token");
		console.log(userId);
		console.log(token);
		if(userId == "" || userId == null || userId == undefined || token == "" || token == null || token == undefined) {
			this.login();
		}
	}
	/*分享*/
	shareFn(num){ //0好友  1朋友圈
		this.DrawCanvas(num);
		
	}
	

	/*打卡的接口*/
	punchCardAjax() {
		let myLoading: any = this.weui.showLoading("打卡中");
		let param = {
			userId: this.userId,
			token: this.token
		};
		this.comman.request("OReading", "sign", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.isPunchCard = true;
				console.log(data);
				this.events.publish('punchCardAlready');
				this.punchCardInfoAjax();//打卡成功再调一次打卡信息接口
				
			} else if(data.code == 2) { //已经打过卡了
				this.isPunchCard = true;
				

			} else {
				this.weui.showAlert("打卡失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("打卡失败", "请先登录", "确定");

			}
		})
	}

	/*处理date数据*/
	handleDate() {
		let slidesArr_ = this.slidesArr[1];
		let CurrMonth = slidesArr_.month;
		let Curryear = slidesArr_.year;
		let beginmonth_: any;
		let beginyear_: any;
		let beginday_ = slidesArr_.date[0].data;
		let endmonth: any;
		let endyear_: any;
		let endday_ = slidesArr_.date[slidesArr_.date.length - 1].data;
		let beginAllTime = '';
		let endAllTime = '';
		if(slidesArr_.date[0].prev) { //说明绝对有上个月的
			beginyear_ = CurrMonth == 1 ? Curryear - 1 : Curryear;
			beginmonth_ = CurrMonth - 1 <= 0 ? 12 : CurrMonth - 1 > 9 ? `${CurrMonth-1}` : `0${CurrMonth-1}`;
			beginAllTime = `${beginyear_}-${beginmonth_}-${beginday_}`;

		} else { //在当前月
			beginmonth_ = CurrMonth < 10 ? `0${CurrMonth}` : CurrMonth;
			beginAllTime = `${Curryear}-${beginmonth_}-${beginday_}`;
		}
		if(slidesArr_.date[slidesArr_.date.length - 1].next) { //说明绝对有下个月的
			endyear_ = CurrMonth == 12 ? Curryear + 1 : Curryear;
			endmonth = CurrMonth + 1 > 12 ? `01` : CurrMonth > 9 ? CurrMonth + 1 : '0' + (CurrMonth + 1);
			endAllTime = `${endyear_}-${endmonth}-${endday_}`;
		} else { //在当前月 没有下一个月了
			endmonth = CurrMonth < 10 ? `0${CurrMonth}` : CurrMonth;
			endAllTime = `${Curryear}-${endmonth}-${endday_}`;
		}
		let obj = {};
		obj['beginAllTime'] = beginAllTime;
		obj['endAllTime'] = endAllTime;
		return obj;
	}

	/*获取打卡信息接口*/
	punchCardInfoAjax() {
		let obj_ = this.handleDate()
		let param_ = {
			userId: this['userId'],
			token: this['token'],
			beginTime: obj_['beginAllTime'],
			endTime: obj_['endAllTime']
		};
		this.comman.request("OReading", "getSignInfo", param_, (data) => {
			if(data.code == 0) {
				console.log(data);
				let signList = data.signList;
				for(let z = 0; z < signList.length; z++) {
					for(let i = 0; i < this.slidesArr[1]['date'].length; i++) {
						if(signList[z] == this.slidesArr[1]['date'][i].wholeTime) {
							this.slidesArr[1]['date'][i].AlreadyCard = 'already';
						}
					}
				}
				this.dayNumber = data.signNum;
				this.handleCanvasData();//canvas数据初始化

			} else {
				this.weui.showAlert("打卡信息获取失败", data.msg, "确定");
			}
		}, (err) => {
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("打卡失败", "请先登录", "确定");

			}
		})
	}

	login() {
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {});
		loginModalCtrl.present();
		loginModalCtrl.onDidDismiss((data)=>{
			if(data.isLogin){
			    this.init();
			}
		});
		
		
		
		
		
	}

	/*返回按钮事件*/
	backPage() {

	}

	/*处理星期的英文*/
	handleWeek() {
		let weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let date_ = new Date();
		console.log(weeks[date_.getDay()])
		return weeks[date_.getDay()];
	}

	/*处理canvas中的数据*/
	handleCanvasData() {
		let obj = this.timestampToTimeCanvas();
		this.canvasContent = [{
			    linePath:`${this.sourceSrc}assets/imgs/mine/fill_line.png`,
				imgPath: `${this.sourceSrc}assets/imgs/mine/share_one.png`,
				punchDate: this.isPunchCard ? this.dayNumber : (this.dayNumber)*1+1,
				shareCodeImgPath: `${this.sourceSrc}assets/imgs/mine/share_erweicode.png`,
				shareWord: '不会宽容别人的人 是不配受到别人的宽容',
				Currweek: this.handleWeek(),
				CurrMonth: obj['top'],
				CurrDay: obj['bot'],
				shareLogo: `${this.sourceSrc}assets/imgs/mine/share_logo.png`
			}

		]
//		console.log(this.isPunchCard,this.canvasContent[0].punchDate)
	}

	/*canvas开始画图*/
	DrawCanvas(num) {
		let myLoading: any = this.weui.showLoading("分享图生成中");
		this.randomNum = Math.floor((Math.random() * this.canvasContent.length))
        let imgBg =new Image();
        console.log(this.canvasContent)
	    imgBg.src= this.canvasContent[this.randomNum].imgPath;
		imgBg.onload = ()=>{
			console.log(imgBg.height);
			this.canvasWidth = imgBg.width;
			this.canvasHeight = imgBg.height;
			let canvasW = imgBg.width;
			let canvasH = imgBg.height;
			let c = this.canvas_;//canvas对象
			console.log(canvasW+"  "+canvasH);
		   c.drawImage(imgBg,0,0,canvasW,canvasH);//绘制大图
		   this.drawDate(c,canvasW);//绘制日期上
		   this.drawDate_bot(c,canvasW);//绘制日期中
		   this.drawDate_bot_week(c,canvasW);//绘制日期下
		   //画第二个版块
		   this.drawsecondPart(c,canvasW,canvasH);
		   this.drawsecondPartLeft(c,canvasW,canvasH);
		   /*画框线*/
		   this.drawLine(c,canvasW,canvasH,num,myLoading);
		   /*画第三个版块*/
		   this.drawThirdPart(c,canvasW,canvasH);
		   /*画第三个版块的左边*/
		   this.drawThirdPartLeft(c,canvasW,canvasH);
		  
		}
		
	}
	/*画框线*/
	drawLine(c,canvasW,canvasH,num,myLoading){
		let imgLine = new Image();
	    imgLine.src = this.canvasContent[this.randomNum].linePath;
		imgLine.onload = ()=>{
		   	 c.drawImage(imgLine,(canvasW)/2,canvasH-444 + 40,1,104);//绘制大图  
		   	/*画logo*/
		   this.drawLogo(c,canvasW,canvasH,num,myLoading);
		 }
	}
	/*画logo*/
	drawLogo(c,canvasW,canvasH,num,myLoading){ 
		let imgLogo = new Image();
	    imgLogo.src = this.canvasContent[this.randomNum].shareLogo;
		imgLogo.onload = ()=>{
			let width = 122;
			let height = 102;
		   c.drawImage(imgLogo,canvasW/2 + ((canvasW/2)/2 -80) ,(canvasH-444) + (height /2)-10,width,height);//绘制大图  
		   /*画二维码*/
		   this.drawCode(c,canvasW,canvasH,num,myLoading);
		   
		 }
	}
	/*画二维码*/
	drawCode(c,canvasW,canvasH,num,myLoading){ 
		let imgCode = new Image();
	    imgCode.src = this.canvasContent[this.randomNum].shareCodeImgPath;
		imgCode.onload = ()=>{
			let width = 172;
			let height = 172;
		   	 c.drawImage(imgCode, canvasW-40 - width - 36,(canvasH-250)+ (218 -height)/2 ,width,height);//绘制大图  
		   	 let canvas_ = this.cavasDom;
		     this.dataURL = canvas_.toDataURL('image/png');
		     console.log(this.dataURL)
		     this.weui.hideLoading(myLoading);
		     this.WxsharePage.imgShare(this.dataURL,()=>{
		     	if(!this.isPunchCard){
		     		this.punchCardAjax();
		     		
		     	}
		     	
		     },num);
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
	
	/*判断打没打卡*/
	isPullCard(){
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
//		let myLoading: any = this.weui.showLoading("信息获取中");
		let param = {
			userId: this.userId,
			token: this.token,
			type:3
		};
		this.comman.request("TalkCatUser", "getUserInfo", param, (data) => {
//			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				console.log(data)
				this.isPunchCard = data.todaySign;
				this.handleCanvasData();//canvas数据初始化
			} else {
				this.weui.showAlert("信息获取失败", data.msg, "确定");
			}
		}, (err) => {
//			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			}else if(err == '10099') {
				if(this.checkMask()) {
					this.login();
				}
       
			}
		})
	}
	
	/*画canvas最上面的日期*/
	drawDate(c,canvasW){
     c.fillStyle = '#e4f5fb';  //设置填充的背景颜色
     c.fillRect(canvasW-240,0,186,218); //绘制矩形
     c.font="30px sans-serif";
     c.fillStyle="#333333";
     let width = parseInt(c.measureText(this.canvasContent[this.randomNum].CurrMonth).width);
     console.log(width)
     c.fillText(this.canvasContent[this.randomNum].CurrMonth,(canvasW-240) +(186 - width)/2 ,76);
	}
	
	/*画canvas最下面的日期*/
	drawDate_bot(c,canvasW){
     c.font="56px sans-serif";
     c.fillStyle="#333333";
     let width = parseInt(c.measureText(this.canvasContent[this.randomNum].CurrDay).width);
     console.log(this.canvasContent[this.randomNum].CurrDay)
     c.fillText(this.canvasContent[this.randomNum].CurrDay,(canvasW-240) +(186 - width)/2 ,70 + 30 + 40);
	}
	/*画canvas最下面的星期*/
	drawDate_bot_week(c,canvasW){
      c.font="24px sans-serif";
     c.fillStyle="#333333";
     let width = parseInt(c.measureText(this.canvasContent[this.randomNum].Currweek).width);
     console.log(this.canvasContent[this.randomNum].Currweek)
     c.fillText(this.canvasContent[this.randomNum].Currweek,(canvasW-240) +(186 - width)/2 ,76 + 30 + 44 + 40);
	}
	
	/*画canvas第二个版块*/
	drawsecondPart(c,canvasW,canvasH){
     this.drawBorderRadios(c,40,canvasH-444,canvasW - 80,174,30);
	}
	
	/*画第三个版块*/
	drawThirdPart(c,canvasW,canvasH){
	 this.drawBorderRadios(c,40,canvasH-250,canvasW - 80,218,30);	
	}
	
	/*画第三个版块的左边*/
	drawThirdPartLeft(c,canvasW,canvasH){
     c.fillStyle = 'rgba(255,255,255,0)';  //设置填充的背景颜色
     c.fillRect(40,canvasH-250,(canvasW - 80)/2,218); //绘制矩形
     let arr = this.canvasContent[this.randomNum].shareWord.split(' ');
     console.log(arr)
     /*鸡汤上文*/
     c.font="bold 36px sans-serif";
     c.fillStyle="#333333";
     let width = parseInt(c.measureText(arr[0]).width);
     c.fillText(arr[0],40 + ((canvasW - 80)/2 - width)/2,canvasH-250 + 100);
     let width_bot = parseInt(c.measureText(arr[1]).width);
     console.log(arr[1].length)
     c.fillText(arr[1],76 + ((canvasW - 80)/2 - width_bot)/2,canvasH-250 + 100 + 36 + 16);
	}
	
	/*画左边第二个版块*/
	drawsecondPartLeft(c,canvasW,canvasH){
	 c.fillStyle = 'rgba(255,255,255,0)';  //设置填充的背景颜色
     c.fillRect(40,canvasH-444,(canvasW - 80)/2,174); //绘制矩形
     c.font="30px sans-serif";
     c.fillStyle="#999999";
     let width = parseInt(c.measureText('学习已打卡').width);
     c.fillText('学习已打卡',40 + ((canvasW - 80)/2 - width)/2,canvasH-444 + 64);
     
     //天数
     c.font="70px sans-serif";
     c.fillStyle="#d81d4a";
     let width_bot = parseInt(c.measureText(this.canvasContent[this.randomNum].punchDate).width);
     console.log(this.canvasContent[this.randomNum].punchDate)
     c.fillText(this.canvasContent[this.randomNum].punchDate,40 + ((canvasW - 80)/2 - width)/2,canvasH-444 + 64 + 30 + 50);
     
     //天
     c.font="28px sans-serif";
     c.fillStyle="#333333";
     let width_bot_ = parseInt(c.measureText('天').width);
     c.fillText('天',40 + ((canvasW - 80)/2 - width)/2 + width_bot + 16,canvasH-444 + 64 + 30 + 50);
	}
	
	/*绘制圆角*/
	drawBorderRadios(c,x, y, w, h, r){
		c.save();
		if (w < 2 * r) {r = w / 2;}
	    if (h < 2 * r){ r = h / 2;}
	    c.beginPath();
	    c.moveTo(x+r, y);
	    c.arcTo(x+w, y, x+w, y+h, r);
	    c.arcTo(x+w, y+h, x, y+h, r);
	    c.arcTo(x, y+h, x, y, r);
	    c.arcTo(x, y, x+w, y, r);
	    c.closePath();
	    c.fillStyle = 'rgba(255,255,255,0.8)';  //设置填充的背景颜色
	    c.fill();
	    c.restore();
	   
	}

	/*canvas中的时间转换*/
	timestampToTimeCanvas() {
		let date = new Date();
		let Y = date.getFullYear() + '/';
		let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
		let obj = {};
		obj['top'] = Y + M;
		obj['bot'] = D;
		return obj;
	}

	/*时间转换*/
	timestampToTime() {
		var date = new Date();
		var Y = date.getFullYear();
		//var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
		var M = date.getMonth() + 1;
		this.year = Y;
		this.month = M;
	}

	/*计算每月天数及上月补全下月补全*/
	computedDay(year_, month_) {
		let _date = new Date();
		let NowYear = _date.getFullYear();
		let NowMonth = _date.getMonth();
		let year = year_; //年
		let month = month_ - 1; //月
		let date = _date.getDate() //日
		let compuArr = [];
		let NowDate = new Date(year, month + 1, 0).getDate(); //这个月一共多少天
		for(let i = 1; i < NowDate + 1; i++) {
			let obj = {};
			obj['data'] = i < 10 ? `0${i}` : i;
			obj['isCurrent'] = true; //当月
			obj['prev'] = false; //上月
			obj['next'] = false; //下月
			obj['minToday'] = i < _date.getDate() && this.year == NowYear && month == NowMonth ? 'AlreadyDay' : ''; //判断是否当前天之前

			obj['CurrDay'] = i == _date.getDate() && this.year == NowYear && month == NowMonth ? 'cur_' : i == _date.getDate() ? 'cur' : ''; //判断是否是当前天
			obj['txt'] = i == _date.getDate() && this.year == NowYear && month == NowMonth ? '今' : i;
			obj['AlreadyCard'] = ''; //已打卡
			compuArr.push(obj)
		}
		//上个月开始
		let lastCount = new Date(year, month, 0).getDate(); //上个月多少天
		let offDay = new Date(year, month, 1).getDay() == 0 ? 7 : new Date(year, month, 1).getDay();
		let offCount = 7 - (7 - offDay + 1); //有多少个格子
		let lastArr = [];
		for(let i = 1; i < lastCount + 1; i++) { //将数字转成数组形式
			let obj = {};
			obj['data'] = i < 10 ? `0${i}` : i;
			obj['isCurrent'] = false;
			obj['prev'] = true; //上月
			obj['next'] = false; //下月
			obj['minToday'] = '';
			obj['CurrDay'] = '';
			obj['txt'] = obj['CurrDay'] == 'cur' ? '今' : i;
			obj['AlreadyCard'] = ''; //已打卡
			lastArr.push(obj)
		}
		lastArr.reverse(); //反转一下
		lastArr = lastArr.filter((item, index) => {
			return index < offCount
		});
		lastArr.reverse(); //这里需要再反转下
		//上个月结束

		//下个月开始
		let offCountNext;
		if(35 - lastArr.length - compuArr.length >= 0) { //如果能保证35个
			offCountNext = 35 - lastArr.length - compuArr.length; //下个月有多少个格子~
		} else {
			offCountNext = 42 - lastArr.length - compuArr.length;
		}
		let nextArr = [];
		for(let i = 1; i < offCountNext + 1; i++) { //因为下个月不可能都展示所以只需要遍历就成
			let obj = {};
			obj['data'] = i < 10 ? `0${i}` : i;
			obj['isCurrent'] = false;
			obj['prev'] = false;
			obj['next'] = true; //下月
			obj['minToday'] = '';
			obj['CurrDay'] = '';
			obj['txt'] = obj['CurrDay'] == 'cur' ? '今' : i;
			obj['AlreadyCard'] = ''; //已打卡
			nextArr.push(obj);
		}
		compuArr.unshift(...lastArr); //~~把上个月的加上喽
		compuArr.push(...nextArr); //~~把下个月的加上喽
		//下个月结束
		this.dayArray = compuArr;
		return this.dayArray;
	}

	fatherFunction(obj) {
		console.log(obj)
		this.slidesArr = obj['arr'];
		this.bottomHeight = this.winHeight - obj['height'] * 1 - this.header.nativeElement.clientHeight;
		this.punchCardInfoAjax();
	}

	/*初始化函数*/
	init() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		this.timestampToTime();//时间转换
		this.handleSlide();//滑动块初始化三个月份
        this.isPullCard();
	}

	/*处理滑块数组中的时间*/
	handleTime(arr, year, month) {
		for(let o = 0; o < arr.length; o++) {
			if(arr[o]['prev']) {
				let m = month - 1 <= 0 ? 12 : month - 1 > 9 ? `${month-1}` : `0${month-1}`;
				arr[o]['wholeTime'] = `${year}-${m}-${arr[o]['data']}`
			} else if(arr[o]['isCurrent']) {
				let m = month < 10 ? `0${month}` : `${month}`;
				arr[o]['wholeTime'] = `${year}-${m}-${arr[o]['data']}`
			} else if(arr[o]['next']) {
				let m = month + 1 > 12 ? `01` : month > 9 ? month + 1 : '0' + (month + 1);
				arr[o]['wholeTime'] = `${year}-${m}-${arr[o]['data']}`
			}

		}
	}

	/*处理滑动块数组函数*/
	handleSlide() {
		let arr = [];
		for(let i = 0; i < 3; i++) {
			let obj = {};
			if(i == 0) {
				obj['date'] = this.computedDay(this.year, this.month - 1);
				obj['year'] = this.year;
				obj['month'] = this.month * 1 - 1;

			} else if(i == 1) {
				obj['date'] = this.computedDay(this.year, this.month);
				obj['year'] = this.year;
				obj['month'] = this.month * 1;
			} else {
				obj['date'] = this.computedDay(this.year, this.month + 1);
				obj['year'] = this.year;
				obj['month'] = this.month * 1 + 1;

			}
			this.handleTime(obj['date'], obj['year'], obj['month'])
			obj['index'] = i - 1;
			arr.push(obj);
		}
		this.slidesArr = arr;
		console.log(this.slidesArr)
		/*获取打卡信息接口*/
		this.punchCardInfoAjax();
       
	}

	/*设置高度*/
	setDateHeight() {
		this.winWidth = this.plt.width(); //当前屏幕宽度
		this.winHeight = this.plt.height(); //当前屏幕高度
		this.bottomHeight = this.winHeight - this.PunchCardDateComponent.dateHeight - this.header.nativeElement.clientHeight;
		this.cavasDom = this.punchCanvas.nativeElement;
		this.canvas_ = this.punchCanvas.nativeElement.getContext('2d');
		this.headerHeight = this.header.nativeElement.clientHeight;
		console.log(this.header.nativeElement.clientHeight);
		console.log(`当前屏幕高度${this.winHeight},当前日历高度${this.PunchCardDateComponent.dateHeight},当前header的高度${this.header.nativeElement.clientHeight}`)

	}
	/*NG生命周期*/
	ngAfterViewInit() {
		this.setDateHeight();
	}
	ionViewWillEnter() {
      
	}

}