import { Component } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { SpecialPage } from '../../pages/special/special';

@Component({
  selector: 'page-special_set',
  templateUrl: 'special_set.html'
})
export class SpecialSetPage {
  name:string = '';
  phoneNumber:string = '';
  constructor(
  	public modalCtrl: ModalController,
  	public navCtrl: NavController,
  	private weui:WeuiModel,
  	private comman:commanModel
  ) {
  	this.checkUserInfo(); 
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
	/*点击提交*/
	submit(){
		if(this.name == ''){
			this.weui.showAlert("请输入姓名", '', "确定");
		}else if(this.phoneNumber == '' || !this.isPoneAvailable(this.phoneNumber)){
			this.weui.showAlert("请输入正确的手机号", '', "确定");
		}else{
			this.submitAjax();
		}
	}
	/*发送请求*/
	submitAjax(){
		let myLoading: any = this.weui.showLoading("提交中");
		let obj = {};
		obj['type'] = 12;
		obj['name'] = this.name;
		obj['telphone'] = this.phoneNumber;
		obj['content'] = '';
		this.comman.request("FrontUser", "addContact",obj, (data) => {
			this.weui.hideLoading(myLoading);
			if(data.code == 0) {
				this.weui.showAlert("提交成功", '', "确定","",()=>{
					this.name= '';
					this.phoneNumber = '';
					this.navCtrl.pop();
				});
				
			} else {
				this.weui.showAlert("提交失败", data.msg, "确定");
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
