import { Component } from '@angular/core';
import { IonicApp, Events, ViewController, NavController, Platform } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';

import { Storage } from '@ionic/storage';

@Component({
	selector: 'modal-login',
	templateUrl: 'modal-login.html'
})
export class LoginModal {

	isLogin:boolean = false;
	userPhone: string = "";
	password: string = "";
	phoneCode: string = "";
	password_register: string = "";
	password_new: string = "";
	access_token: string = "";
	unionid: string = "";
	openId: string = "";
	isCodeSend: boolean = false;
	loginPanelMode: number = 0; //0登录选择页,1登录页,2注册,3忘记密码
	loginType: number = 0; //0短信登录，1密码登录
	loginType_transform: string = "translate(calc(-45vw / 2),0)";
	titleText: string = "";
	timeInterval: any;
	timeCount: number = 60;
	notinput: boolean = true; //还没有输入

	WECHAT_APPID: string = "wx8b64ccf4a7cc1992";
	WECHAT_APPSECRET: string = "7e63fbefb6a715fdac4309322fe7e992";

	constructor(
		private http: HTTP,
		public events: Events,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel,
		public viewCtrl: ViewController,
		private storage: Storage,
		private ionicApp: IonicApp,
		private platform: Platform
	) {}
	setLoginMode(type: number) {
		if(type == 0) {
			//登录tab选择界面
			this.loginPanelMode = 0;
			this.titleText = "";
		} else if(type == 1) {
			//登录界面
			this.loginPanelMode = 1;
			this.titleText = "登录";
		} else if(type == 2) {
			//注册
			this.loginPanelMode = 2;
			this.titleText = "注册";
		} else if(type == 3) {
			//忘记密码
			this.loginPanelMode = 3;
			this.titleText = "忘记密码";
		} else if(type == 4) {
			//绑定手机
			this.loginPanelMode = 4;
			this.titleText = "";
		}
	}
	onInput(event){
		console.log("*** input ***");
		this.notinput = this.userPhone=="";
	}
	loginTypeChange(type: number) {
		this.loginType = type;
		if(type == 0) {
			this.loginType_transform = "translate(calc(-45vw / 2),0)";
		} else {
			this.loginType_transform = "translate(calc(45vw / 2),0)";
		}
	}
	goWxLogin() {
		if(this.platform.is("cordova")){
			this.userWxLogin();
		}else{
			alert("请在手机上操作");
		}
	}
	userWxLogin() { //微信登录
		let wechat = (<any>window).Wechat;
		let scope = "snsapi_userinfo";
	  	let state = "_" + (+new Date());
		wechat.auth(scope, state,(response) => {
		  let userCode =response;//返回的相关数据
		  this.http.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid="+this.WECHAT_APPID+"&secret="+this.WECHAT_APPSECRET+"&code="+userCode.code+"&grant_type=authorization_code", {}, {})
			.then(data => {
			  	let userData=eval("("+data.data+")"); 
			  	this.access_token = userData.access_token;
			  	this.unionid= userData.unionid;//unionid
				this.openId = userData.openid;//openid
				let myLoading: any = this.weui.showLoading("数据加载中");
			  	this.comman.request('FrontUser','loginByWX',{unionId:this.unionid,openId:this.openId,appid:'wx465574bed6dd8fb9',userAgent:"OriginalReading"},(data)=>{
			  		this.weui.hideLoading(myLoading);
					if(data.code==0){
						let dadd = JSON.stringify(data);
//						this.userId = data.userId;
//						this.token = data.token;
						if(data.userId==''){//新用户
							this.setLoginMode(4);
						}else{//老用户
							this.weui.showToast('登录成功', {
								position: 'top'
							});
							var userInfo = {
								userId:data.userId,
								token:data.token
							}
							this.setUserInfo(userInfo);
							this.closeLogin();
						}
					}else{
						this.weui.showToast('获取数据失败',data.msg,'确定');
					}
				})
			})
			.catch(error => {
				this.weui.showToast('获取数据失败',error.error,'确定');
			});
		},(reason) =>{
		    //alert("Failed: " + reason);
		    let errText = reason;
		    if(errText=='用户点击取消并返回'){
		    	this.weui.showToast('微信登录','你取消了微信登录','确定');
		    }else{
		    	this.weui.showToast('微信打开失败',reason,'确定');
		    }
		});
	}
	goLogin(){
		if(this.loginType==0){
			this.messageLogin();
		}else{
			this.login();
		}
	}
	messageLogin(){
		let myLoading: any = this.weui.showLoading("登录中");
		let param = {
			phone: this.userPhone,
			phoneCode: this.phoneCode,
			userAgent: "OriginalReading"
		};
		this.comman.request("bstVocabulary.User", "messageLogin", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.weui.showToast('登录成功', {
					position: 'top'
				});
				var userInfo = {
					userId:data.userId,
					token:data.token
				}
				this.setUserInfo(userInfo);
				this.closeLogin();
			} else {
				this.weui.showAlert("登录失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			}
		})
	}
	setUserInfo(data){
		this.storage.set('userId', data.userId);
		this.storage.set('token', data.token);
		this.comman.setGlobal({
			userId: data.userId,
			token: data.token
		});
		this.events.publish('login-state-change', true);
		this.isLogin = true;
	}
	login() {
		let myLoading: any = this.weui.showLoading("登录中");
		let param = {
			phone: this.userPhone,
			password: this.comman.tsMD5(this.password),
			userAgent: "OriginalReading"
		};
		this.comman.request("bstVocabulary.User", "accountLogin", param, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.weui.showToast('登录成功', {
					position: 'top'
				});
				var userInfo = {
					userId:data.userId,
					token:data.token
				}
				this.setUserInfo(userInfo);
				this.closeLogin();
			} else {
				this.weui.showAlert("登录失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			}
		})
	}
	goRegist(type:number){
		this.regist(type);
	}
	regist(registType){
		if(!this.phoneform(this.userPhone)){
			this.weui.showToast('手机号输入有误');
			return false;
		}
		if(this.phoneCode==""||this.phoneCode==null||this.phoneCode==undefined){
			this.weui.showToast('验证码不能为空');
			return false;
		}
		var params;
		let myLoading: any;
		let loginSuccessText="";
		if(registType==0){
			loginSuccessText = "登录成功";
			if(this.password_register==""||this.password_register==null||this.password_register==undefined){
				this.weui.showToast('密码不能为空');
				return false;
			}
			myLoading = this.weui.showLoading("正在注册");
			params = {
				registType:"3ff611ca",
				phone: this.userPhone,
				phoneCode:this.phoneCode,
				password:this.password_register,
				userAgent: "OriginalReading", //用户代码
			};
		}else if(registType==1){
			loginSuccessText = "绑定成功";
			myLoading = this.weui.showLoading("正在注册");
			params = {
				registType:"3ff611ca",
				phone: this.userPhone,
				phoneCode:this.phoneCode,
				userAgent: "OriginalReading", //用户代码
				isBundling:1,
				appId:'wx465574bed6dd8fb9',
				openId:this.openId,
				unionId:this.unionid,
			};
		}
		this.comman.request("Regist", "regist", params, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.weui.showToast(loginSuccessText, {
					position: 'top'
				});
				var userInfo = {
					userId:data.userId,
					token:data.token
				}
				this.setUserInfo(userInfo);
				this.closeLogin();
			} else {
				this.weui.showAlert("注册失败", data.msg, "关闭");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert('网络连接失败', '请检查网络', '确定');
			}
		})
		
	}
	goModify(){
		if(!this.phoneform(this.userPhone)){
			this.weui.showToast('手机号输入有误');
			return false;
		}
		if(this.phoneCode==""||this.phoneCode==null||this.phoneCode==undefined){
			this.weui.showToast('验证码不能为空');
			return false;
		}
		if(this.password_new==""||this.password_new==null||this.password_new==undefined){
			this.weui.showToast('密码不能为空');
			return false;
		}
		let params = {
			phone:this.userPhone,
			phonecode:this.phoneCode,
			password:this.comman.tsMD5(this.password_new),
			userAgent:'OriginalReading'
		}
		let myLoading: any = this.weui.showLoading("正在修改……");
		this.comman.request("bstVocabulary.User", "forgotPassword", params, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.weui.showToast('修改成功', {
					position: 'top'
				});
				var userInfo = {
					userId:data.userId,
					token:data.token
				}
				this.setUserInfo(userInfo);
				this.closeLogin();
			} else {
				this.weui.showAlert("密码修改失败", data.msg, "关闭");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert('网络连接失败', '请检查网络', '确定');
			}
		})
	}
	sendMessage(){
		if(!this.isCodeSend){
			this.getPhoneCode();
		}
	}
	getPhoneCode() { //短信验证码校验
		if(this.phoneform(this.userPhone)) {
			let myLoading: any = this.weui.showLoading("短信发送中");
			this.comman.request("bstVocabulary.User", "sendPhoneCode", {
				phone: this.userPhone
			}, (data) => {
				this.weui.hideLoading(myLoading);
				if(data.code == 0) {
					this.isCodeSend = true;
					this.setTimeInterval();
					this.weui.showToast('发送成功', {
						position: 'top'
					});
				} else {
					this.weui.showAlert("发送失败", data.msg, "关闭");
				}
			}, (err) => {
				this.weui.hideLoading(myLoading);
				if(err == "ajaxError") {
					this.weui.showAlert('网络连接失败', '请检查网络', '确定');
				}
			})
		} else {
			this.weui.showToast('手机号输入有误');
		}
	}
	closeLogin() {
		this.viewCtrl.dismiss({"isLogin":this.isLogin});
	}
	phoneform(value) {
//		if(!(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
//			return false;
//		} else {
//			return true;
//		}
		if(/\d{11}$/.test(value)) {
			return true;
		} else {
			return false;
		}
	}
	setTimeInterval(){
		this.timeInterval = setInterval(()=>{			
			if(this.timeCount!=1){
				this.timeCount--;
			}else{
				this.timeCount = 60;
				clearInterval(this.timeInterval);
				this.isCodeSend = false;
			}
		},1000);
	}
	ionViewWillLeave(){
		try{
			clearInterval(this.timeInterval);
		}catch(e){
			//TODO handle the exception
		}
	}
}