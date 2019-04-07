import { Component } from '@angular/core';
import { NavController, ModalController, Events } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';

@Component({
	selector: 'page-changePwd',
	templateUrl: 'changePwd.html'
})
export class ChangePwdPage {
	userId: string = '';
	token: string = '';
	newPwd: string = '';
	confirm: string = '';
	codePt: string = '';
	codeMsg: string = '';
	phoneNumber: string = '';
	stutesObj: any = {};
	imgCodeSrc:string = '';
	saveBtnStatus:boolean = false;
	timer:number = 0;
	sendMsgVal:string = '';
	constructor(
		public events: Events,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		private weui: WeuiModel,
		private comman: commanModel
	) {
		this.checkUserInfo();
		this.init();
	}
	checkUserInfo() {
		var userId = this.comman.getGlobal("userId");
		var token = this.comman.getGlobal("token");
		console.log(userId);
		console.log(token);
		if(userId == "" || userId == null || userId == undefined || token == "" || token == null || token == undefined) {
			this.login();
		}
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
	init() {
		this.userId = this.comman.getGlobal("userId");
		this.token = this.comman.getGlobal("token");
		this.stutesObj = {
			zero: false,
			one: false,
			two: false,
			three: false,
			four: false,
			five: false,
		};
		this.sendMsgVal = '发送验证码';
		this.ImgCodeAjax();
	}
	
	/*校验保存状态*/
	checkStatus(){
		if(this.newPwd != '' && this.confirm != '' && this.codePt != '' && this.codeMsg != '' && this.phoneNumber != ''){
			  this.saveBtnStatus = true;
			  return true;
		}else{
			return false;
		}
	}
	
	/*发送短信验证码*/
	sendMsg(){
		if(this.phoneNumber == '' || !this.isPoneAvailable(this.phoneNumber)){
			  this.weui.showAlert("请输入正确的手机号格式", "", "确定","",()=>{});
		}else if(this.codePt == ''){
			  this.weui.showAlert("请输入图片验证码", "", "确定","",()=>{});
		}else{
			this.sendMsgAjax();
		}
	}
	/*发送短信验证码接口*/
	sendMsgAjax(){
		if(this.timer == 0) {
			let myLoading: any = this.weui.showLoading("短信发送中");
			this.comman.request("Regist", "getPhoneCodeWithPic", {
				phone: this.phoneNumber,
				picCode: this.codePt.toLocaleUpperCase()
			}, (data) => {
				this.weui.hideLoading(myLoading);
				if(data.code == 0) {
					this.timer = 60;
					let codeFn = () => {
						this.timer--;
						let val = '';
						if(this.timer > 0) {
								val = `已发送(${this.timer}S)`;
							  setTimeout(codeFn, 1000)
						} else {
								val = `发送验证码`;
						}
						this.sendMsgVal = val;
					}
					setTimeout(codeFn, 1000)
				} else {
					this.weui.showAlert("短信发送失败", data.msg, "确定");
				}
			}, (err) => {
				this.weui.hideLoading(myLoading);
				if(err == "ajaxError") {
					this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
				} else if(err == '10099') {
					this.weui.showAlert("信息获取失败", "请先登录", "确定","",()=>{
						 this.login();
					});
	       
				}
			})
		}
	}
	
	/*校验手机号*/
	isPoneAvailable(str) {
		str = str * 1;
		let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
		if(!myreg.test(str)) {
			return false;
		} else {
			return true;
		}
	}
	
	/*保存密码发送请求*/
	saveAjax(){
		let obj = {};
		obj['phone'] = this.phoneNumber;
		obj['code'] = this.codeMsg;
		obj['userName'] = '';
		obj['newPwd'] = this.comman.tsMD5(this.newPwd);
		let myLoading: any = this.weui.showLoading("修改中");
		this.comman.request("FrontUser", "resetPwd",obj, (data) => {
			this.weui.hideLoading(myLoading);
			this.timer = 0;
			if(data.code == 0) {
				this.weui.showAlert("修改成功", '', "确定","",()=>{
					this.newPwd= '';
					this.confirm = '';
					this.codePt = '';
					this.codeMsg = '';
					this.phoneNumber= '';
				});
				
			} else {
				this.weui.showAlert("修改失败", data.msg, "确定");
			}
		}, (err) => {
			this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("信息获取失败", "请先登录", "确定","",()=>{
					 this.login();
				});
       
			}
		})
	}
	
	/*校验信息*/
	checkInfo(){
		if(this.newPwd == ''){
			this.weui.showAlert("请输入新密码", '', "确定");
		} else if(this.confirm == '' || this.newPwd != this.confirm){
			this.weui.showAlert("请输入正确的确认密码", '', "确定");
		}else if(this.phoneNumber == '' || !this.isPoneAvailable(this.phoneNumber)){
			this.weui.showAlert("请输入正确的手机号", '', "确定");
		}else if(this.codePt == ''){
			this.weui.showAlert("请输入图片验证码", '', "确定");
		}else if(this.codeMsg == ''){
			this.weui.showAlert("请输入正确的短信验证码", '', "确定");
		}else{
			this.saveAjax();
		}
	}
	
	
	/*修改密码*/
	save(){
		this.checkInfo();
	}

	/*删除内容*/
	deleteWordFn(word) {
		this[word] = '';
	}
	
	/*图片验证码接口*/
	ImgCodeAjax() {
		// let myLoading: any = this.weui.showLoading("获取验证码图片中");
		this.comman.request("PicCode", "getPicCode", {}, (data) => {
			// this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.imgCodeSrc = data.picUrl;
			} else {
				this.weui.showAlert("获取验证码图片失败", data.msg, "确定");
			}
		}, (err) => {
			// this.weui.hideLoading(myLoading);
			if(err == "ajaxError") {
				this.weui.showAlert("连接失败", "请手机检查网络", "关闭");
			} else if(err == '10099') {
				this.weui.showAlert("信息获取失败", "请先登录", "确定","",()=>{
					 this.login();
				});
       
			}
		})
	}
	
	/*切换验证码*/
	changeImg(){
		this.ImgCodeAjax();
	}
	
	/*修改border状态动画*/
	changeBorder(el) {
		for(let key in this.stutesObj) {
			this.stutesObj[key] = false;
		}
		//console.log(el.target.classList.constructor  == Array);
		let e = Array.from(el.target.classList);
		if(e['includes']('zero')) {
			this.stutesObj.zero = true;
		} else if(e['includes']('one')) {
			this.stutesObj.one = true;
		} else if(e['includes']('two')) {
			this.stutesObj.two = true;
		} else if(e['includes']('three')) {
			this.stutesObj.three = true;
		} else if(e['includes']('four')) {
			this.stutesObj.four = true;
		} else if(e['includes']('five')) {
			this.stutesObj.five = true;
		}
		console.log()
	}
	ionViewDidLoad() {
		//this.init()
	}
}