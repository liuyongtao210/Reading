import { Component } from '@angular/core';
import { NavController,ModalController } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';

@Component({
  selector: 'page-special_detail',
  templateUrl: 'special_detail.html'
})
export class SpecialDetailPage {

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
		let loginModalCtrl = this.modalCtrl.create(LoginModal, {}, {
			cssClass: "windowStyle"
		});
		loginModalCtrl.present();
	}
}
