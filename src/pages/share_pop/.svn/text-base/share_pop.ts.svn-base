import { Component, ViewChild, ElementRef } from '@angular/core';
import {NavController, ModalController, ViewController,Events,Platform  } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';

@Component({
  selector: 'page-share_pop',
  templateUrl: 'share_pop.html'
})
export class SpecialSharePopPage {
  share:any = {};
  constructor(
  	public modalCtrl: ModalController,
  	public navCtrl: NavController,
  	private weui:WeuiModel,
  	private comman: commanModel,
		public viewController: ViewController,
		public events: Events,
		
  ) {
  	
  }
  /*关闭弹框*/
	closePop() {
		this.share = {
			 isshareFriend:false,
			 isshareCircle:false
		}
		this.viewController.dismiss(this.share);
	}
	closePops(e){
		let el = Array.from(e.target.classList);
		console.log(el);
		if(el['includes']('date_share_frame') || el['includes']('date_share_img') || el['includes']('data_share_txt')){
			return 
		}else{
			this.share = {
			 isshareFriend:false,
			 isshareCircle:false
		}
			this.viewController.dismiss(this.share);
		}
		
	}
	/*发布事件*/
	goShare(num,e){
		e.preventDefault();
		this.share = {
			 isshareFriend:false,
			 isshareCircle:false
		}
		if(num == 0){//0是好友
			this.share.isshareFriend = true;
		}else{
			this.share.isshareCircle = true;
		}
		this.viewController.dismiss(this.share);
	}
}
