import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, ViewController,Events,Platform } from 'ionic-angular';

import { WeuiModel } from '../../model/weuiModel/weuiModel';
import { commanModel } from '../../model/comman/comman';
import { LoginModal } from '../modal-login/modal-login';
import { CallNumber } from '@ionic-native/call-number';
@Component({
	selector: 'page-special_pop',
	templateUrl: 'special_pop.html'
})
export class SpecialPopPage {
	@ViewChild("header") header: ElementRef;
	headerHeight: number = 0;
	constructor(
		private callNumber: CallNumber,
		public modalCtrl: ModalController,
		public navCtrl: NavController,
		private weui: WeuiModel,
		public plt: Platform,
		private comman: commanModel,
		public viewController: ViewController,
		public events: Events,

	) {

	}

	/*关闭弹框*/
	closePop() {
		this.viewController.dismiss();
	}
	/*去打电话*/
	callNow_(){
		if(this.plt.is("cordova")) {
			this.callNumber.callNumber("18515159491", true)
	//      .then(res => console.log('Launched dialer!', res))
	//      .catch(err => console.log('Error launching dialer', err));
		}
	    
	}
	/*隐藏弹框*/
	hidePop(e){
		let el = Array.from(e.target.classList);
		if(el['includes']('add') || el['includes']('phone')){
			  return;
		}else{
			this.viewController.dismiss();
		}
		console.log(e)
	}
	/*去设置页*/
	goSetPage(){
		this.events.publish('goSetPage');
		this.viewController.dismiss();
	}
	
	/*NG生命周期---当dom加载完成后执行*/
	ionViewDidEnter() {
		console.log(this.header)
		this.headerHeight = this.header['nativeElement']['clientHeight'];
		console.log(this.header['nativeElement']['clientHeight'])
	}
}